
define(["jquery", "delegate"], function($, WebSite) {

            'use strict';

            var me = {};
            
            /** {dir, doc, hash} */
            var state = {};
            
            /** script saver */
            var scriptModuleSaver;
            
            /** call back on page has been built*/
            var pageHasBeenBuiltCallback;
            
            /** Web site */
            var webSite = WebSite(true, saveTemplateScript, linkManagementAction, pageHasBeenBuilt);
            
            /** Media queries break points */
            var breakPoints = {
                  "screen-tn-max" : "289px",
                  "screen-xs-min" : "290px",
                  "screen-xs-max" : "559px",
                  "screen-sm-min" : "560px",
                  "screen-sm-max" : "991px",
                  "screen-md-min" : "992px",
                  "screen-md-max" : "1199px",
                  "screen-lg-min" : "1200px"
            };
            
            Object.defineProperty(
                  me,
                  "setBreakPoints",
                  {
                     get: function ()
                     {
                        return setNewBreakPoints;
                     }
                  });
            
            /**
             * Sets new media query bounds.
             * 
             * @param    queryPoints
             *            
             */
            function setNewBreakPoints(queryPoints)
            {
               if (queryPoints["screen-tn-max"])
               {
                  breakPoints["screen-tn-max"] = queryPoints["screen-tn-max"];
               }
               if (queryPoints["screen-xs-min"])
               {
                  breakPoints["screen-xs-min"] = queryPoints["screen-xs-min"];
               }
               if (queryPoints["screen-xs-max"])
               {
                  breakPoints["screen-xs-max"] = queryPoints["screen-xs-max"];
               }
               if (queryPoints["screen-sm-min"])
               {
                  breakPoints["screen-sm-min"] = queryPoints["screen-sm-min"];
               }
               if (queryPoints["screen-sm-max"])
               {
                  breakPoints["screen-sm-max"] = queryPoints["screen-sm-max"];
               }
               if (queryPoints["screen-md-min"])
               {
                  breakPoints["screen-md-min"] = queryPoints["screen-md-min"];
               }
               if (queryPoints["screen-md-max"])
               {
                  breakPoints["screen-md-max"] = queryPoints["screen-md-max"];
               }
               if (queryPoints["screen-lg-min"])
               {
                  breakPoints["screen-lg-min"] = queryPoints["screen-lg-min"];
               }
            }
            
            /**
             * Extract and store a template script attached to this node.
             * 
             * @param    anchorNode
             *           The attachment point.
             */
            function saveTemplateScript(anchorNode, context, dir)
            {
               $("template[data-script]", anchorNode).each(
               function(index, element)
               {
                  var templateNode = $(element, context);
                  var scriptName = templateNode.attr("name");
                  var scriptVirtualPath = dir + "/" + scriptName + ".js";
                  $(templateNode[0].innerHTML, context).filter(
                        function(index, script)
                  {
                     if (script.nodeName == "SCRIPT")
                     {
                        var javaScriptString = "(function()\n{\n" + script.textContent + "\n}());\n";
                        scriptModuleSaver.call(null, javaScriptString, scriptName + ".js");
                     }
                  });
                  templateNode.before("<template data-script=\"" + scriptVirtualPath + "\"></template>");
                  templateNode.remove();
               });
            }
            
            /**
             * Substitute hash by its canonical url
             */
            function linkManagementAction(qnode, element, context, dir)
            {
               var hash = qnode.attr("href");
               var result = webSite.getSectionCanonicalUrl(hash);
               if (result)
               {
                  qnode.attr("href", result); 
               }
            }
            
            /**
             * To save the current compiled page
             */
            function pageHasBeenBuilt()
            {
               webSite.activateNavMenuItem(webSite.getVisibleFloatSection(), true, state.doc);
               if (pageHasBeenBuiltCallback)
               {
                  pageHasBeenBuiltCallback.call();
               }
            };
            
            /**
             * Append web site css on load the web site entry document.
             * 
             * @param    dir
             *           The web site virtual directory.
             */ 
            function appendWebSiteCSS(dir, context, bootstrap)
            {
               var headNode = $("head", context);
               /* common css style */
               var cssLink = "<link rel='stylesheet' type='text/css' href='"
                  + dir +"/web-site.css'>";
               headNode.append(cssLink);

               /* device-dependent css styles */
               cssLink = "<link rel='stylesheet' type='text/css' media='screen and (max-width: "
                     + breakPoints["screen-tn-max"] + ")' href='" + dir +"/web-site-tn.css'>";
               headNode.append(cssLink); 
               cssLink = "<link rel='stylesheet' type='text/css' media='screen and (min-width: "
                     + breakPoints["screen-xs-min"] + ") and (max-width: "
                     + breakPoints["screen-xs-max"] + ")' href='" + dir +"/web-site-xs.css'>";
               headNode.append(cssLink); 
               cssLink = "<link rel='stylesheet' type='text/css' media='screen and (min-width: "
                     + breakPoints["screen-sm-min"] + ") and (max-width: "
                     + breakPoints["screen-sm-max"] + ")' href='" + dir +"/web-site-sm.css'>";
               headNode.append(cssLink); 
               cssLink = "<link rel='stylesheet' type='text/css' media='screen and (min-width: "
                     + breakPoints["screen-md-min"] + ") and (max-width: "
                     + breakPoints["screen-md-max"] + ")' href='" + dir +"/web-site-md.css'>";
               headNode.append(cssLink); 
               cssLink = "<link rel='stylesheet' type='text/css' media='screen and (min-width: "
                     + breakPoints["screen-lg-min"] + ")' href='" + dir +"/web-site-lg.css'>";
               headNode.append(cssLink); 
            };

            /**
             * Build static web pages.
             */
            function compile (context, dir, href, bootstrap, conversionReady)
            {
               dir = dir || ".";
               var headNode = $("head", context);
               
               $("script", headNode).each(function(index, element) {
                  var qnode = $(element, headNode);
                  var src = qnode.attr("src");
                  if (src == "/js/init_dynamic.js")
                  {
                     qnode.attr("src", "/js/init_static.js");
                  }
               });
               
               if (dir != ".")
               {
                  appendWebSiteCSS("..", context, bootstrap);
               }
               else
               {
                  appendWebSiteCSS(".", context, bootstrap);
               }
               
               if (dir != ".")
               {
                  appendWebSiteCSS("../" + dir, context, bootstrap);
               }
               
               // don't cache requests
               $.ajaxSetup({cache : false, crossDomain: true});
               
               pageHasBeenBuiltCallback = conversionReady;
               
               var configPromise = $.getJSON(dir + "/web-site.json");
               configPromise.done(function(data) {
                  // save current state
                  state.doc  = context;
                  state.dir  = dir;
                  
                  webSite.setup(
                        {
                          "data"    : data,
                          "anchor"  : "body",
                          "context" : context,
                          "dir"     : dir,
                          "href"    : href
                        });
               });
               
            };
            
            me.compile = compile;
            me.setSaver = function (saver) {scriptModuleSaver = saver;};
            
            return me;
   });
