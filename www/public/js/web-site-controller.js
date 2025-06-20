/*
** Module   : web-site-controller.js
** Abstract : Static web site controller
**                       
** Copyright (c) 2016, Golden Code Development Corporation.
** ALL RIGHTS RESERVED. Use is subject to license terms.
**
**           Golden Code Development Corporation
**                      CONFIDENTIAL
**
** -#- -I- --Date-- --------------------Description-------------------
** 001 SBI 20161120   Static web site controller that loads pages and navigates between them.
** 002 SBI 20170213   Web site and template use cases are demarcated.
** 003 SBI 20170405   Fixed to reject js loading from unknown hosts.
*/


define(["jquery", "delegate"], function($, WebSite) {

            'use strict';

            var me = {};
            
            /** Web site virtual directory */
            var virtualDirectory;
            
            /** Web site */
            var webSite = WebSite(false, executeTemplateScript, linkManagementAction, uiSetup);
            
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
            
            /** Static mode */
            var staticMode = false;
            
            Object.defineProperty(
                  me,
                  "setStaticMode",
                  {
                     get: function ()
                     {
                        return function(mode)
                        {
                           staticMode = mode;
                        };
                     }
                  });

            /** OS detection flags. */
            me.isWindows = navigator.appVersion.indexOf('Win') > -1;
            me.isMac = navigator.appVersion.indexOf('Mac') > -1;
            me.isUnix = navigator.appVersion.indexOf('X11') > -1;
            me.isLinux = navigator.appVersion.indexOf('Linux') > -1;

            /** Browser detection flags. */
            me.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            me.isChrome  = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
            me.isSafari  = (navigator.userAgent.toLowerCase().indexOf('safari/') > -1) && !me.isChrome;
            me.isChromium = !!window.chrome;
            me.isIE11 = navigator.userAgent.indexOf("Trident") > -1
                                                               || navigator.userAgent.indexOf("Edge") > -1;
            me.isIe = !!window.ActiveXObject || me.isIE11;

            /** view more or hide main website sections if xs mode is on*/
            me.viewMoreSections = function (id, button, hiddenClass)
            {
               var elements = $("#" + id + " .view-more");
               if (hiddenClass)
               {
                  elements.toggleClass(hiddenClass);
               }
               $(button).toggleClass("more-sections");
               $(button).toggleClass("less-sections");
            };
            
            /** extend or collapse section */
            me.extendSection = function (id, button, extendClass, collapseClass,
                  sectionSelector, sectionContext, extendSection, collapseSection)
            {
               var query = "#" + id;
               // let us include id having 'view-more' class
               var elements = $(query + ".view-more, " + query + " .view-more");
               
               elements.toggleClass("hide");
               if (extendClass)
               {
                  $(button).toggleClass(extendClass);	
               }
               if (collapseClass)
               {
                  $(button).toggleClass(collapseClass);
               }
               $(sectionSelector, sectionContext).each(
                     function(index, element)
                     {
                        if ($(query, element).length > 0)
                        {
                           $(element).toggleClass(collapseSection);
                           $(element).toggleClass(extendSection);
                        }
                        else
                        {
                           $(element).toggleClass("hide");
                        }
                     });
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
             * Causes the window to load and display the document at the URL specified.
             * 
             * @param    url
             *           The document url
             */
            function followExternalLink(url)
            {
               window.location.assign(resolveUrl(url));
            }
            
            /**
             * Resolves the provided url in respect of the current page.
             * 
             * @param    url
             *           The document url.
             * 
             * @return   The resolved url.
             */
            function resolveUrl(url)
            {
               var curr  = window.location.href;
               // if regex is supported by browser?
               var currProtoIndex = curr.indexOf("://");
               var currProto = curr.substr(0, currProtoIndex);
               var hostPathAndQuery = curr.substr(currProtoIndex + 3);
               var currHost = hostPathAndQuery.substr(0, hostPathAndQuery.indexOf("/"));
               
               var resolvedUrl;
               
               // if protocol is provided
               if (url.indexOf("://") > -1)
               {
                  resolvedUrl = url;
               }
               else
               {
                  var pathIndex = url.indexOf("/");
                  var pathAndQuery;
                  var host;
                  //if host is provided
                  if (pathIndex > 0)
                  {
                     host = url.substr(0, pathIndex);
                     pathAndQuery = url.substr(pathIndex);
                  }
                  else if (pathIndex == 0)
                  {
                     host = currHost;
                     pathAndQuery = url;
                  }
                  else
                  {
                     var urlParts = url.split("?");
                     host = urlParts[0];
                     if (urlParts.length > 1)
                     {
                        pathAndQuery = "?" + urlParts[1];
                     }
                     else
                     {
                        pathAndQuery = "";
                     }
                  }
                  resolvedUrl = currProto + "://" + host + pathAndQuery;
               }
               
               return resolvedUrl;
            }
            
            /**
             * Click event handler. Loads a requested section and animates its scroll
             * to top appearance.
             * 
             * @param    evt
             *           Click event.
             */
            function doSmoothScroll(evt)
            {
               // Store hash
               var target = this.target;
               var hash = target.hash;
               // Prevent default anchor click behavior
               evt.preventDefault();
               // get correct section hash for these three types of links:
               // #section, new-page.html and new-page.html#sub-section 
               if (hash == "" || target.pathname != "")
               {
                  if (target.pathname)
                  {
                     var isRootIncluded = (target.pathname.indexOf("/") == 0);
                     var path;
                     if (isRootIncluded)
                     {
                        path = target.pathname.substring(1);
                     }
                     else
                     {
                        path = target.pathname;
                     }
                     // TODO support canonical pages loaded from the file system.
                     if (target.href.substr(0, 7) == "file://")
                     {
                        var parts = path.split("/");
                        var num = parts.length;
                        if (num > 0)
                        {
                           path = parts[num -1];
                        }
                     }
                     
                     hash = webSite.getSectionHash(path);
                     if (!hash)
                     {
                        if (target.href)
                        {
                           path = target.href;
                           var lastCharIndex = path.length - 1;
                           var isRootSuffix = (path.substring(lastCharIndex) == "/");
                           if (isRootSuffix)
                           {
                              path = path.substr(0, lastCharIndex);
                           }
                           
                           hash = webSite.getSectionHash(path);
                        }
                     }
                  }
               }
               
               if (hash !== "")
               {
                  var link = webSite.getSectionLink(hash);
                  var isInternal = link["data-link"];
                  
                  if (!isInternal)
                  {
                     // fixed the focused external link on back history
                     target.blur();
                     followExternalLink(link["url"]);
                     return;
                  }

                  // if target.hash and target.pathname are not empty
                  // then hash and target.hash becomes different values
                  var anchor = target.hash != "" ? target.hash : hash;
                  
                  var smoothScroll = function()
                  {
                     scrollToAnchor(hash, 0, function()
                        {
                           // Add hash (#) to URL when done scrolling (default click behavior)
                           window.location.hash = hash;
                           // collapse top navigation menu if mobile mode is on
                           $('#topNavMenu').collapse("hide");
                           
                           if (hash != anchor)
                           {
                              setTimeout(
                                 function()
                                 {
                                    me.scrollTo(anchor.substring(1), $("#topNavBar").height(), true);
                                 },
                                 500);
                           }
                        });
                  };
                  
                  var slot = $(hash);
                  
                  var childs = slot.children();
                  // TODO: find the better way to control if section hasn't been loaded yet
                  if (childs.length == 0)
                  {
                     var notifier = webSite.loadSection(hash, this.context, this.dir);
                     notifier.doneNotifier.done(smoothScroll);
                     notifier.load();
                  }
                  else
                  {
                     webSite.hideCurrentSection(hash);
                     webSite.activateNavMenuItem(hash, true);
                     smoothScroll();
                  }

                } // End if
            };
            
            /**
             * Scroll to an element having the specified id, taking into account the given
             * top padding.
             * 
             * @param    id
             *           The given HTML element id.
             * @param    topPadding
             *           The given padding from the page top.
             * @param    addToHistory
             *           The optional boolean value; true value means that the result of this action will be added to the history.
             * @param    restoreState
             *           The optional closure that restores this state via the history navigations.
             */
            me.scrollTo = function (id, topPadding, addToHistory, restoreState)
            {
               var anchor = "#" + id;
               topPadding = topPadding || 0;
               
               scrollToAnchor(anchor, topPadding,
                  function()
                  {
                     if (addToHistory)
                     {
                        window.history.pushState(
                           {
                              "hash"       : webSite.getVisibleFloatSection(),
                              "anchor"     : anchor,
                              "topPadding" : topPadding
                           },
                           "",
                           webSite.getVisibleFloatSection());
                     }
                  });
            }
            
            /**
             * Scroll to an anchor, taking into account the given top padding.
             * 
             * @param    anchor
             *           The HTML anchor given by this form "#id", where id is an element
             *           identifier.
             * @param    topPadding
             *           The given padding from the page top.
             * @param    callback
             *           A callback function that is invoked after the page has been scrolled to
             *           the target element.
             */
            function scrollToAnchor(anchor, topPadding, callback)
            {
               var topOffset = ($(anchor).offset().top - topPadding);
               var selector = "html";
               if (me.isChrome || me.isSafari)
               {
                  selector = "body";
               }
               $(selector).animate({scrollTop : topOffset}, 100,
                     function()
                     {
                        if (callback)
                        {
                           callback();
                        }
                     });
            }
            
            /**
             * Execute template script attached to anchor node.
             * 
             * @param    anchorNode
             *           The attachment point.
             */
            function executeTemplateScript(anchorNode, context, dir)
            {
               $("template[data-script]", anchorNode).each(
                     function(index, element)
                     {
                        var templateNode = $(element, context);
                        var scriptPath = templateNode.attr("data-script");
                        $.cachedScript(scriptPath).fail(
                              function( jqxhr, settings, exception )
                              {
                                 alert(exception);
                              });
                        templateNode.remove();
                     });
            }
            
            /**
             * Attach click listener to manage this link
             */
            function linkManagementAction(qnode, element, context, dir)
            {
               var thisContext = {"context" : context, "dir" : dir, "target" : element};
               qnode.on('click', function(event)
                  {
                     $.proxy(doSmoothScroll, thisContext, event)();
                  });
            }
            
            /**
             * Final web site setup: the current history state and active menu state
             */
            function uiSetup()
            {
               // important replace window location to Home page (visibleFloatSection)
               var fixedLocation;
               if (webSite.getSelectedSection())
               {
                  fixedLocation = webSite.getSelectedSection();
               }
               else
               {
                  fixedLocation = webSite.getVisibleFloatSection();
               }
               replaceLocation(fixedLocation);
               webSite.activateNavMenuItem(fixedLocation, true);
               
            };

            /**
             * Hash changed handler.
             */
            function locationHashChanged ()
            {
               var hash = window.location.hash;
               
               var slot = $(hash);
               var childs = slot.children();
               if (childs.length != 0)
               {
                  webSite.hideCurrentSection(hash);
                  if (webSite.isFloatSection(hash))
                  {
                     webSite.activateNavMenuItem(hash, true);
                  }
                  // change the current visible section
                  if (webSite.isFloatSection(hash))
                  {
                     webSite.setVisibleFloatSection(hash);
                     
                     var anchor     = hash;
                     var topPadding = 0;
                     
                     var state = window.history.state;
                     if (state)
                     {
                        topPadding = state["topPadding"];
                        anchor     = state["anchor"];
                     }
                     scrollToAnchor(anchor, topPadding, null);
      
                     webSite.setSelectedSection(hash);
                  }
               }
               else
               {
                  webSite.clickNavMenuItem(hash);
               }
            };
            
            /**
             * History events handler.
             * 
             * @param    event
             *           History event
             */
            function historyEventsHandler(event)
            {
               var hash       = window.location.hash;

               var anchor     = hash;
               var topPadding = 0;
               var state = event.state;
               if (state)
               {
                  topPadding = state["topPadding"];
                  anchor     = state["anchor"];
               }

               if (webSite.isSelectedSection(hash))
               {
                  scrollToAnchor(anchor, topPadding, null);
               }
            };
            
            /**
             * Replace the current location substituting the current history entry.
             * 
             * @param    hash
             *           The new location
             */
            function replaceLocation(hash)
            {
               var location = decodeURIComponent(window.location.href);
               // remove hash
               var index = location.indexOf("#");
               
               var len = location.length;
               
               if (index > -1)
               {
                  len = index;
               }
               
               location = location.substr(0, len);
               
               // important replace window location to Home page (visibleFloatSection)
               window.location.replace(location + hash);
               // invoke location change event
               if (window.location.hash == hash)
               {
                  locationHashChanged();
               }
            }
            
            /**
             * Returns the parameter value from the query.
             * 
             * @param    name
             *           The query parameter name.
             * 
             * @return   The query parameter value or null if there is no the target parameter
             *           in the query.
             */
            function getQueryParameter(name)
            {
               var query = decodeURIComponent(window.location.search.substring(1));
               var params = query.split("&");
               for (var i=0; i < params.length; i++)
               {
                  var pair = params[i].split("=");
                  if(pair[0] == name)
                  {
                     return pair[1];
                  }
               }
               
               return null;
            }
            
            /**
             * Get a relative path to the web site virtual directory. It retrieves "dir" parameter
             * from the query part of the GET request.
             * 
             * @return   a relative path to the web site virtual directory. 
             */
            function getVirtualDirectory()
            {
               if (!virtualDirectory)
               {
                  var dir = ".";
                  
                  var value = getQueryParameter("dir");
                  
                  if (value == "jvm" || value == "jta" || value == "kto" || value == "nto")
                  {
                     dir = dir + "/" + value; 
                  }
                  
                  virtualDirectory = dir;
               }
               
               return virtualDirectory;
            };
            
            /**
             * Append web site css on load the web site entry document.
             * 
             * @param    dir
             *           The web site virtual directory.
             */ 
            function appendWebSiteCSS(dir)
            {
               /* common css style */
               var cssLink = $("<link rel='stylesheet' type='text/css' href='"
                     + dir +"/web-site.css'>");
               $("head").append(cssLink);
               /* device-dependent css styles */
               cssLink = $("<link rel='stylesheet' type='text/css' media='screen and (max-width: "
                     + breakPoints["screen-tn-max"] + ")' href='" + dir +"/web-site-tn.css'>");
               $("head").append(cssLink); 
               cssLink = $("<link rel='stylesheet' type='text/css' media='screen and (min-width: "
                     + breakPoints["screen-xs-min"] + ") and (max-width: "
                     + breakPoints["screen-xs-max"] + ")' href='" + dir +"/web-site-xs.css'>");
               $("head").append(cssLink); 
               cssLink = $("<link rel='stylesheet' type='text/css' media='screen and (min-width: "
                     + breakPoints["screen-sm-min"] + ") and (max-width: "
                     + breakPoints["screen-sm-max"] + ")' href='" + dir +"/web-site-sm.css'>");
               $("head").append(cssLink); 
               cssLink = $("<link rel='stylesheet' type='text/css' media='screen and (min-width: "
                     + breakPoints["screen-md-min"] + ") and (max-width: "
                     + breakPoints["screen-md-max"] + ")' href='" + dir +"/web-site-md.css'>");
               $("head").append(cssLink); 
               cssLink = $("<link rel='stylesheet' type='text/css' media='screen and (min-width: "
                     + breakPoints["screen-lg-min"] + ")' href='" + dir +"/web-site-lg.css'>");
               $("head").append(cssLink); 
            };
            
            /**
             * Initialize web application controller.
             */
            function init ()
            {
               var dir = getVirtualDirectory();
               if (!staticMode)
               {
                  appendWebSiteCSS(".");
                  if (dir != ".")
                  {
                     appendWebSiteCSS(dir);
                  }
               }
               // using http://api.jquery.com/jQuery.getScript/
               Object.defineProperty(jQuery, "cachedScript",
               {
                  get : function() {
                     return function(url, options)
                     {
                        // test url based on window.location.origin
                        // https://connect.microsoft.com/IE/feedback/details/1763802/location-origin-is-undefined-in-ie-11-on-windows-10-but-works-on-windows-7
                        var parser = document.createElement('a');
                        parser.href = url;
                        
                        var test = window.location.origin;
                        if (test)
                        {
                           var length = test.length;
                           var href = parser.href.substr(0, length);
                           if (test != href)
                           {
                              var doneNotifier = $.Deferred();
                              // reject to load an unknown url
                              doneNotifier.reject();
                              return doneNotifier.promise();
                           }
                        }
                        // Allow user to set any option except for dataType, cache, and url
                        options = $.extend(
                              options || {},
                              {
                                 dataType : "script",
                                 cache : true,
                                 url : url
                              });
                        
                        // Use $.ajax() since it is more flexible than $.getScript
                        // Return the jqXHR object so we can chain callbacks
                        return jQuery.ajax(options);
                     };
                  }
               });
               
               // don't cache requests
               $.ajaxSetup({cache : false});
               var configPromise = $.getJSON(dir + "/web-site.json");
               configPromise.done(function(data) {
                  webSite.setup(
                        {
                          "data"        : data,
                          "anchor"      : "body",
                          "context"     : window.document,
                          "dir"         : dir,
                          "href" : window.location.href
                        });
               });
               
               window.onpopstate   = historyEventsHandler;
               window.onhashchange = locationHashChanged;
            }
            
            $(function() { init(); });
            
            return me;
   });
