define(["jquery","templates"], function($, WebTemplates) {
   
   /**
    * Extends a plain javascript object of key and value pairs so the destination
    * object accepts new values from the source object: a new array values are added
    * at the end of the destination values, primitive values are not overriden and
    * new keys are added with their corresponding values.
    * 
    * @param    dest
    *           The destination object, plain javascript object
    * @param    src
    *           The source object, plain javascript object
    * 
    * @return   The updated destination object
    */
   $.extendPlainObject = function (dest, src)
   {
      function extend (d, s)
      {
         var key;
         for (key in s)
         {
            if (!s.hasOwnProperty(key))
            {
               continue;
            }
            if (d[key])
            {
               if (Array.isArray(d[key]))
               {
                  Array.prototype.push.apply(d[key], s[key]);
               }
               else
               {
                  if ($.isPlainObject(d[key]))
                  {
                     d[key] = extend(d[key], s[key]);
                  }
               }
            }
            else
            {
               //add new key-value
               d[key] = s[key];
            }
         }
         return d;
      }
      
      return extend(dest, src);
   };

   /**
    * Creates a web site delegate.
    * 
    * @param    mode
    *           The current engine mode, its true value indicates this web site delegate
    *           is used to built static pages
    * @param    templateScriptAction
    *           Template script action
    * @param    linkManagementAction
    *           Link management action
    * @param    setupAction
    *           Performs a final web site setup on the web site structure is built
    * 
    * @returns  Web site delegate
    */
   return function(mode, templateScriptAction, linkManagementAction, setupAction) {
   "use strict";
   
   /** Build HTML fragments from the given templates */ 
   var builder = WebTemplates;
   
   /** The document object that represents this website*/
   var currentDocument;
   
   /** Engine Mode indicates that this web site delegate is used to built static pages */ 
   var engineMode = mode;
   
   /** pages resources - urls map */
   var urlsMap = {};
   
   /** url to hash map */
   var reversedUrlsMap = {};
   
   /** pages data - urls map */
   var dataMap = {};
   
   /** always visible sections */
   var fixedSections = [];
   
   /** visible float section */
   var visibleFloatSection;
   
   /** selected section */
   var selectedSection;
   
   /** object bounded to web site */
   var dataBinding;
   
   /** Footer section */
   var footerSection;

   var me = {};
   
   /**
    * Retrieves a path to get the section content.
    */
   function getSectionPath(id, dir)
   {
      var link = urlsMap[id];
      
      if (link)
      {
         return dir + "/" + link.path;
      }
      
      return null;
   };
   
   me.getSectionPath = getSectionPath;
   
   /**
    * Retrieves a path to optionally defined section data.
    */
   function getSectionDataPath(id, dir)
   {
      var jsonFile = dataMap[id];
      
      if (jsonFile)
      {
         return dir + "/" + dataMap[id];
      }
      
      return null;
   };
   
   me.getSectionDataPath = getSectionDataPath;
   
   /**
    * Gets a section content hash by its relative url.
    */
   function getSectionHash(url)
   {
      var link = reversedUrlsMap[url];
      
      if (link)
      {
         return link.hash;
      }
      
      return "";
   };
   
   me.getSectionHash = getSectionHash;
   
   /**
    * Retrieves a section canonical url in respect to the root web site.
    */
   function getSectionCanonicalUrl(id)
   {
      var link = urlsMap[id];
      
      if (link)
      {
         return link.url;
      }
      
      return null;
   };
   
   me.getSectionCanonicalUrl = getSectionCanonicalUrl;
   
   /**
    * Retrieves a section link.
    */
   function getSectionLink(id)
   {
      return urlsMap[id];
   };
   
   me.getSectionLink = getSectionLink;
   
   /**
    * Is a section with this id float, not fixed.
    * 
    * @param   id
    *          Section node id.
    */
   function isFloatSection(id)
   {
      return fixedSections.indexOf(id) < 0;
   };
   
   me.isFloatSection = isFloatSection;
   
   function setVisibleFloatSection(hash)
   {
      visibleFloatSection = hash;
   }
   
   me.setVisibleFloatSection = setVisibleFloatSection;
   
   function getVisibleFloatSection()
   {
      return visibleFloatSection;
   }
   
   me.getVisibleFloatSection = getVisibleFloatSection;
   
   function setSelectedSection(hash)
   {
      selectedSection = hash;
   }
   
   me.setSelectedSection = setSelectedSection;
   
   function isSelectedSection(hash)
   {
      return (selectedSection == hash);
   }
   
   me.isSelectedSection = isSelectedSection;
   
   /**
    * Activate link given by this hash.
    * 
    * @param    hash
    *           id selector, in this form #id.
    * @param    active
    *           If true, then add class 'active' to its parent node, otherwise remove
    *           'active' class.
    */
   function activateNavMenuItem(hash, active)
   {
      var link = getSectionCanonicalUrl(hash);
      if (link)
      {
         console.log("activateNavMenuItem('" + hash +"', " + active + ")");
         var node = $('a[href$="' + link + '"]', currentDocument).parent();
         if (active)
         {
            node.addClass("active");
         }
         else
         {
            node.removeClass("active");
         }
      }
   };
   
   me.activateNavMenuItem = activateNavMenuItem;
   
   /**
    * Hide the current section if new section to display is float and is not visible
    * on the screen.
    * 
    * @param    newHash
    *           New page hash
    */
   function hideCurrentSection(newHash)
   {
      var newPageSlot = $(newHash, currentDocument);
      newPageSlot.closest("section, footer").removeClass("hide");
      newPageSlot.removeClass("hide");
      console.log("hideCurrentSection('" + newHash +"')");
      var currentItem = selectedSection;
      if (currentItem != "" && currentItem !== undefined)
      {
         if (isFloatSection(newHash))
         {
            if (newHash != currentItem)
            {
               var slot = $(currentItem, currentDocument);
               slot.addClass("hide");
               slot.closest("section").addClass("hide");
               activateNavMenuItem(selectedSection, false);
               selectedSection = undefined;
            }
            else
            {
               // check old visible section.
               if (visibleFloatSection && newHash != visibleFloatSection)
               {
                  var slot = $(visibleFloatSection, currentDocument);
                  slot.addClass("hide");
                  slot.closest("section").addClass("hide");
               }
            }
         }
      }
   };
   
   me.hideCurrentSection = hideCurrentSection;
   
   /**
    * Load section by its unique #id.
    * 
    * @param    anchor
    *           An anchor string given by this form '#id',
    *           where 'id' is a resource identifier.
    * 
    * @return   The done notifier deferred object.
    */
   function loadSection(anchor, context, dir)
   {
      var doneNotifier = $.Deferred();
      if (isFloatSection(anchor))
      {
         activateNavMenuItem(anchor, true);
      }
      var url = getSectionPath(anchor, dir);
      if (!url)
      {
         return doneNotifier.promise();
      }
      var target = url + " " + anchor;
      var anchorNode = $(anchor, context);
      
      doneNotifier.done(function()
      {
         anchorNode.find(anchor).contents().unwrap();
         
         // use root object here
         builder.applyTemplates(dataBinding, anchorNode, context);
         
         $("a[data-link]", anchorNode).each(function(index, element) {
            var qnode = $(element, anchorNode);
            linkManagementAction(qnode, element, context, dir);
         });
         hideCurrentSection(anchor);
         if (isFloatSection(anchor))
         {   
            selectedSection = anchor;
         }
         // execute script only after the section becomes visible
         templateScriptAction(anchorNode, context, dir);
      });

      return {
         doneNotifier : doneNotifier.promise(),
         load : function()
               {
                  var events = [];
                  var dataUrl = getSectionDataPath(anchor, dir);
                  if (dataUrl)
                  {
                     var dataLoaded = $.getJSON(dataUrl);
                     dataLoaded.done(function(data) {
                        // merge data to dataBinding
                        $.extendPlainObject(dataBinding, data);
                        //add new managed links
                        if (data["pages"])
                        {
                           fillDataAndUrls(data["pages"]);
                        }
                        
                     });
                     events.push(dataLoaded);
                  }
                  var sectionLoaded = $.Deferred();
                  events.push(sectionLoaded);
                  // request section
                  anchorNode.load(target,
                        function (response, status, xhr) {
                           sectionLoaded.resolve();
                        });
                  $.when.apply(this, events).done(
                        function()
                        {
                           doneNotifier.resolve();
                        });
               }
         };
   };
   
   me.loadSection = loadSection;
   
   function fillDataAndUrls(pages)
   {
      var i = 0;
      for (; i < pages.length; i++) 
      {
         var page = pages[i];
         var hash = page["hash"];
         var url  = page["url"];
         var path = page["path"];
         var link = page["data-link"];
         var json = page["data"];
         
         if (hash && hash != "")
         {
            urlsMap[hash] = {
                  "url"       : url,
                  "path"      : (path) ? path : url,
                  "data-link" : (link != null && link != undefined) ? link : true
                  };
            // all urls are supposed to be from the root
            var isRootIncluded = (url.indexOf("/") == 0);
            if (isRootIncluded)
            {
               url = url.substring(1);
            }
            reversedUrlsMap[url] = {
                  "hash"       : hash,
                  "data-link"  : (link != null && link != undefined) ? link : true
                  };
            dataMap[hash] = json;
         }
      }
   }
   
   /**
    * Cuts the hash.
    * 
    * @param    hash
    *           The current window hash
    * 
    * @return   The updated hash value.
    */
   function cutHash(hash)
   {
      var values = hash.split("#");
      if (values.length > 1)
      {
         return "#" + values[1];
      }
      
      return hash;
   }
   
   /**
    * Returns hash of this document.
    * 
    * @return   The hash value or "".
    */
   function getCanonicalPageHash(dir, currentPage)
   {
      var url = (dir == ".") ? currentPage : (dir + "/" + currentPage);
      var isRootIncluded = (url.indexOf("/") == 0);
      if (isRootIncluded)
      {
         url = url.substring(1);
      }
      
      return getSectionHash(url);
   }

   /**
    * Returns a canonical page hash and a new requested section hash for this url. Examples, 
    * home-gcd.html#About gives {current: "#Home", requested : "#About"},
    * about-gcd.html#UnknownHash gives {current: "#About", requested : ""} and
    * UnknownPath#UnknownHash gives an empty pair {current: "", requested : ""}.
    * 
    * @param    href
    *           The given whole url.
    * 
    * @return   Its canonical page hash and new requested hash.
    */
   function getCanonicalHashPairs(href)
   {
      var parser = document.createElement('a');
      parser.href = href;
      var pair = { current : "", requested : ""};
      if (parser.pathname)
      {
         var url = parser.pathname;
         var isRootIncluded = (url.indexOf("/") == 0);
         if (isRootIncluded)
         {
            url = url.substring(1);
         }
         
         var hash = getSectionHash(url);
         if (hash)
         {
            pair.current = hash;
         }
      }
      
      if (parser.hash)
      {
         var newHash = cutHash(parser.hash);
         var newUrl = getSectionCanonicalUrl(newHash);
         if (newUrl)
         {
            pair.requested = newHash;
         }
      }
      
      return pair;
   }

   /**
    * Test if a target section has no been loaded yet.
    * 
    * @param    hash
    *            A section hash to test
    * @param    parent
    *            A given parent node
    * 
    * @return   True if a tested section has no been loaded yet, otherwise false.
    */
   function hasNotBeenLoaded(hash, parent)
   {
      var slot = parent.find(hash);
      
      return ((slot.length == 0) || (slot.children().length == 0));
   }
   
    /**
    * Setup a web site page.
    * 
    * @param    args
    *           {"data" : data, "anchor" : anchor}, where data is a Web site json data
    *           and anchor defines a web site page root point.
    */
   function setup(args)
   {
      var data    = args["data"];
      var anchor  = args["anchor"];
      var context = args["context"];
      var dir     = args["dir"];
      var href    = args["href"];
      
      // assign the root data object
      dataBinding = data;
      // assign the current document
      currentDocument = context;
      
      /** loaded sections */
      var loadedAtStart = [];
      
      var pages  = data["pages"];
      
      var sectionTemplateId = data["section"];
      var footerTemplateId  = data["footer"];
      
      // fill data and urls map first
      fillDataAndUrls(pages);
      
      var pageHash = getCanonicalHashPairs(href);
      
      var currentPage = pageHash.requested ? pageHash.requested: pageHash.current;
      
      var anchorNode = $(anchor, context);
      builder.applyTemplates(data, anchorNode, context);
      // execute script on the current page
      if (currentPage != "")
      {
         templateScriptAction($(currentPage, context), context, dir);
      }
      else
      {
         templateScriptAction(anchorNode, context, dir);
      }

      var parent = $("body", context);

      // add page in the reverse order as a first child to the existing content
      var i;
      for (i = pages.length - 1; i >=0; i--) 
      {
         var page = pages[i];
         var hash = page["hash"];
         
         var active = page["active"];
         if (active)
         {
            visibleFloatSection = hash;
         }
         var slot = parent.find(hash);
         var sectionIsDynamic = (slot.length == 0);
         var notLoaded  = hasNotBeenLoaded(hash, parent);
         
         var loaded = page["loaded"];
         if (loaded && notLoaded)
         {
            loadedAtStart.push(hash);
         }
         
         var fixed  = page["fixed"];
         if (fixed)
         {
            fixedSections.push(hash);
         }
         
         var footer = page["footer"];
         if (footer)
         {
            footerSection = hash;
         }
         if (sectionIsDynamic)
         {
            var addNewPage = !engineMode || 
                             (footer || (currentPage && (hash == currentPage)) ||
                             (!currentPage && (hash == visibleFloatSection)));
            if (addNewPage)
            {
               createPage(parent, footer, hash, footerTemplateId, sectionTemplateId, context);
            }
         }
      };
      
      setupListeners($(anchor, context), context, dir);
      var overrideActivePage;
      //override active loaded page
      if (currentPage)
      {
         // test if this new section has not been loaded yet
         if (hasNotBeenLoaded(currentPage, parent))
         {
            overrideActivePage = currentPage;
         }
      }
      
      var notifiers = loadPagesAtStart(loadedAtStart, context, dir, overrideActivePage, currentPage);
      // fix visible float section
      
      visibleFloatSection = (pageHash.current) ? pageHash.current : ((currentPage) ? currentPage : visibleFloatSection);
      
      if (notifiers.length > 0)
      {
         var deffereds = notifiers.map(function(wrapper) { return wrapper.doneNotifier;});
         $.when.apply(this, deffereds).done(
               function() {
                  if (setupAction)
                  {
                     setupAction.call();
                  }
               });
         var i;
         var deffered;
         var next;
         for(i = 0; i < (notifiers.length - 1); i++)
         {
            deffered = notifiers[i].doneNotifier;
            next = notifiers[i+1];
            deffered.done(function(){ next.load(); });
         }
         notifiers[0].load();
      }
      else
      {
         // static pages case nothing is loaded
         if (setupAction && !engineMode)
         {
            setupAction.call();
         }
      }
   };
   
   me.setup = setup;
   
   /**
    * Loaded sections by the order defined in data json file.
    * 
    * @param    loadedAtStart
    *           Pages loaded at start.
    */
   function loadPagesAtStart(loadedAtStart, context, dir, overrideActivePage, currentPage)
   {
      var doneNotifiers = [];
      
      loadedAtStart.forEach(
         function (hash)
         {
            if (hash != visibleFloatSection && hash != overrideActivePage && hash != footerSection)
            {
               doneNotifiers.push(loadSection(hash, context, dir));
            }
         });
      
      // check that overrideActivePage is not empty hash
      if (overrideActivePage && (overrideActivePage.length > 1) && isFloatSection(overrideActivePage))
      {
         visibleFloatSection = overrideActivePage;
         doneNotifiers.push(loadSection(visibleFloatSection, context, dir));
      } else if (visibleFloatSection && (loadedAtStart.indexOf(visibleFloatSection) > -1) &&
            (currentPage == ""))
      {
         doneNotifiers.push(loadSection(visibleFloatSection, context, dir));
      }
      
      if (footerSection && (loadedAtStart.indexOf(footerSection) > -1))
      {
         doneNotifiers.push(loadSection(footerSection, context, dir));
      }
      
      return doneNotifiers;
   };
   
   /**
    * Create page from its template.
    * 
    * @param    parent
    *           the parent pages container
    * @param    footer
    *           True value indicates the footer section.
    * @param    hash
    *           The page hash value
    * @param    footerTemplateId
    *           template identifier for a footer
    * @param    sectionTemplateId
    *           template identifier for sections
    */
   function createPage(parent, footer, hash, footerTemplateId, sectionTemplateId, context)
   {
      var pg;
      if (footer)
      {
         var footerTemplate = $("#" + footerTemplateId, context);
         if (footerTemplate.length > 0)
         {
            pg = $(footerTemplate[0].innerHTML, context);
         }
      }
      else
      {
         var sectionTemplate = $("#" + sectionTemplateId, context);
         if (sectionTemplate.length > 0)
         {
            pg = $(sectionTemplate[0].innerHTML, context);
         }
      }
      if (pg)
      {
         $(".gc-included-content", pg).attr("id", hash.substring(1));
         if (footer)
         {
            parent.append(pg);
         }
         else
         {
            parent.prepend(pg);
         }
      }
   };
   
   /**
    * Setup link listeners within the provided context node.
    * 
    * @param    contextNode
    *           context node
    */
   function setupListeners(contextNode, context, dir)
   {
      // Add smooth scrolling to all links in navbar + footer link
      $(".navbar a[data-link], footer a[data-link], section a[data-link]", contextNode).each(function(index, element) {
         var qnode = $(element, context);
         linkManagementAction(qnode, element, context, dir);
      });
   };
   
   return me;
};
});
