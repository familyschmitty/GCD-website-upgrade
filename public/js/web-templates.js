/**
 * Templates builder
 */
define(["jquery"], function($) {
   "use strict";
   
   var me = {};
   
   /**
    * Retrieves the tree node value by the provided tree node path.
    * 
    * @param    container
    *           The plain JS object in this form {"data" : data}
    * @param    path
    *           The node path, each nested tree node separated by a dot. 
    */
   function getPropertyByPath(container, path)
   {
      var refs = path.split('.');
      var ref, j;
      var obj = container["data"];
      for( j = 0; j < refs.length; j++)
      {
         ref = refs[j];
         if (!obj)
         {
            return obj;
         }
         if (obj.hasOwnProperty(ref))
         {
            obj = obj[ref];
         }
         else
         {
            return undefined;
         }
      }
      
      return obj;
   }
   
   /**
    * Set a specified property value for the given jQuery wrapped DOM node. The text
    * content is added before the existing one.
    * 
    * @param    node
    *           jQuery node
    * @param    name
    *           Property name
    * @param    value
    *           Property value
    */
   function setNodeProperty(node, name, value)
   {
      if (value !== undefined && value !== null)
      {
         if (name == "text")
         {
            // take into account content of the node
            var virtual = $("<div>");
            virtual.text(value);
            node.prepend(virtual.contents());
         }
         else if (name == "class")
         {
            node.addClass(value);
         }
         else
         {
            node.attr(name, value);
         }
      }
   }
   /**
    * Tests if this node should be processed by templates engine
    */
   function isIgnoreNode(iter, node, type)
   {
      var ifExistPath    = node.attr("data-if-exist");
      var ifNotExistPath = node.attr("data-if-not-exist");

      var ifExist;
      if (ifExistPath)
      {
         if (type === "plain")
         {
            ifExist = (getPropertyByPath(iter, ifExistPath) != null);
         }
         else /* if (type === "jQuery") */
         {
            ifExist = iter["node"].find(ifExistPath).length > 0;
         }
      }
      else
      {
         ifExist = true;
      }
      
      var ifNotExist;
      if (ifNotExistPath)
      {
         if (type === "plain")
         {
            ifNotExist = (getPropertyByPath(iter, ifNotExistPath) == null);
         }
         else /* if (type === "jQuery") */
         {
            ifNotExist = iter["node"].find(ifNotExistPath).length == 0;
         }
      }
      else
      {
         ifNotExist = true;
      }
      
      if (ifExist && ifNotExist)
      {
         return false;
      }
      // this node should not be processed by templates engine
      return true;
   }
   
   /**
    * Build DOM with help of template and data binding.
    * 
    * @param    data
    *           The plain data object binded to templates
    * @param    template
    *           The current template.
    */
   function applyTemplate(data, template, context)
   {
      var templateNode = $(template, context);
      var property = templateNode.attr("data-binding");
      var type = templateNode.attr("data-type") || "plain";
      var value;
      if (type === "plain")
      {
         value = getPropertyByPath(data, property);
      }
      else /* if (type === "jQuery") */
      {
         value = $(property, context);
      }
      
      var parent = templateNode.parent();
      var virtual = $("<div>", context);
      if (Array.isArray(value))
      {
         var i = 0;
         var iter;
         for(; i < value.length; i++)
         {
            iter = { "data" : value[i]};
            
            if (isIgnoreNode(iter, templateNode, type))
            {
               continue;
            }
            applyDataBinding(iter, templateNode, virtual, context);
         }
         parent.prepend(virtual.contents());
      }
      else
      {
         if (type === "plain")
         {
            value = {"data" : value};
         }
         else
         {
            data["node"] = value;
            value = data;
         }
         if (!isIgnoreNode(value, templateNode, type))
         {
            applyDataBinding(value, templateNode, virtual, context);
            parent.prepend(virtual.contents());
         }
      }
      // cleanup DOM
      templateNode.remove();
   }

   /**
    * Apply the current binding to the provided template node.
    * 
    * @param    iter
    *           The data provided by the binding to the cloned node
    * @param    templateNode
    *           The template node
    * @param    virtual
    *           The virtual parent node
    */
   function applyDataBinding(iter, templateNode, virtual, context)
   {
      var node = $(templateNode[0].innerHTML, context);
      var type = templateNode.attr("data-type") || "plain";
      virtual.append(node);
      var nodes = virtual.find("[data-binding]");
      nodes.each(function(index, node)
      {
         var jNode = $(node, context);
         if (node.nodeName == "TEMPLATE")
         {
            applyTemplate(iter, node, context);
            // cleanup DOM
            jNode.remove();
            return;
         }
         else
         {
            // data binding from jQuery object are not supported
            if (isIgnoreNode(iter, jNode, type) || type === "jQuery")
            {
               jNode.remove();
               return;
            }
            var bindings = JSON.parse(jNode.attr("data-binding"));
            var name;
            for (name in bindings) {
               if (bindings.hasOwnProperty(name))
               {
                  var path = bindings[name];
                  var obj = getPropertyByPath(iter, path);
                  setNodeProperty(jNode, name, obj);
               }
            }
         }
         // cleanup DOM
         jNode.removeAttr("data-binding");
         jNode.removeAttr("data-if-exist");
         jNode.removeAttr("data-if-not-exist");
         jNode.removeAttr("data-type");
      });
   }
   
   /**
    * Build DOM with help of templates and data binding, and attach it to the attachment
    * point.
    * 
    * @param    data
    *           The plain data object binded to templates
    * @param    anchorNode
    *           The attachment point.
    */
   function applyTemplates(data, anchorNode, context)
   {
      $("template[data-binding]", anchorNode).each(
         function(index, template)
         {
            applyTemplate({"data" : data}, template, context);
         });
   }
   
   me.applyTemplates = applyTemplates;
   
   return me;
});
