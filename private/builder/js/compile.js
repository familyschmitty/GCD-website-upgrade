define(["jquery", "FileSaver", "builder"], function($, saveAs, webSiteBuilder) {
   "use strict";

   function init(view)
   {
      var document = view.document;
      var session = view.sessionStorage;
      var parser = new DOMParser();
      var isRunning = false;
      
      // only get URL when necessary in case Blob.js hasn't defined it yet
      function get_blob()
      {
         return view.Blob;
      }

      function createEmptyHtmlDocument()
      {
         var doc_impl = document.implementation;
         var dt = doc_impl.createDocumentType('html', '', '');
         var doc = doc_impl.createDocument('', "html", dt);
         
         return doc;
      }
      
      function saveHtmlDocument(htmlString, characterSet, fileName)
      {
         var BB = get_blob();
         saveAs(new BB([ htmlString ], {
            type : "text/html;charset=" + characterSet}), fileName);
      }
      
      function saveJavaScriptModule(javaScriptString, characterSet, fileName)
      {
         var BB = get_blob();
         saveAs(new BB([ javaScriptString ], {
            type : "text/javascript;charset=" + characterSet}), fileName);
      }

      var form = $("#builder-options");
      
      var settings = {};
      
      function validate(settings)
      {
//         var node = form.find("#web-base-dir");
//         settings["baseDir"] = node.val() || node.attr("placeholder");
         var node = form.find("#web-virtual-dir");
         settings["dir"] = node.val() || node.attr("placeholder");
         node = form.find('#breakpoints-profile');
         settings["breakpoints"] = node.val();
         //node = form.find('#web-page-template-path');
         //settings["webPage"] = node.val(); causes incorrect path now 
         // recreate clean based tempalate document
         var htmlTemplate = settings["contextHtml"];
         var templateDoc = parser.parseFromString(htmlTemplate, "text/html");
         var context = jQuery(templateDoc);
         settings["context"] = context;
         settings["contextDoc"] = templateDoc;
         // recreate clean web page template
         htmlTemplate = settings["webPageContextHtml"];
         templateDoc = parser.parseFromString(htmlTemplate, "text/html");
         context = jQuery(templateDoc);
         settings["webPageContext"] = context;
         settings["webPageContextDoc"] = templateDoc;

      };

      
      form.find('#base-template-path').change(
            function(event)
            {
               var reader = new FileReader();
               reader.onload = function(evt)
                               {
                                  settings["contextHtml"] = evt.target.result;
                               };
               reader.readAsText(event.target.files[0]);
            });
      form.find('#web-page-template-path').change(
            function(event)
            {
               var reader = new FileReader();
               reader.onload = function(evt)
                               {
                                  settings["webPageContextHtml"] = evt.target.result;
                               };
               settings["webPage"] = event.target.files[0].name;
               reader.readAsText(event.target.files[0]);
            });
      form.find('#breakpoints-profile').change(
            function(event)
            {
               //alert(this.value);
            });

//      if (session.html_filename) {
//         html_filename.value = session.html_filename;
//      }
      webSiteBuilder.setSaver(function(javaScriptString, fileName)
            {
               saveJavaScriptModule(javaScriptString, 'utf-8', fileName);
            });

      form.submit(
            function(event) {
               event.preventDefault();
               if (isRunning)
               {
                  return false;
               }
               isRunning = true;
               validate(settings);
               if (settings.breakpoints == 0)
               {
                  /** GCD profile Media queries break points */
                  webSiteBuilder.setBreakPoints({
                        "screen-tn-max" : "289px",
                        "screen-xs-min" : "290px",
                        "screen-xs-max" : "559px",
                        "screen-sm-min" : "560px",
                        "screen-sm-max" : "991px",
                        "screen-md-min" : "992px",
                        "screen-md-max" : "1199px",
                        "screen-lg-min" : "1200px"
                  });
                  settings["bootstrap"] = "bootstrap-3.3.7/dist";
                  settings["webSiteCanonicalUrl"] = "https://www.goldencode.com";
               }
               else
               {
                  /** FWD profile Media queries break points */
                  webSiteBuilder.setBreakPoints({
                        "screen-tn-max" : "479px",
                        "screen-xs-min" : "480px",
                        "screen-xs-max" : "767px",
                        "screen-sm-min" : "768px",
                        "screen-sm-max" : "991px",
                        "screen-md-min" : "992px",
                        "screen-md-max" : "1199px",
                        "screen-lg-min" : "1200px"
                  });
                  settings["bootstrap"] = "bootstrap-3.3.7-dist";
                  settings["webSiteCanonicalUrl"] = "https://www.beyondabl.com";
               }
               var href = settings.dir + "/" + settings.webPage;
               webSiteBuilder.compile(settings.context, settings.dir, href, settings.bootstrap,
                     function()
                     {
                        var webPageContext = settings.webPageContext;
                        // find rel=canonical link
                        var canonicalPageUrl = $('link[rel="canonical"]', webPageContext).attr("href");
                        if (!canonicalPageUrl)
                        {
                           canonicalPageUrl = settings.webSiteCanonicalUrl + "/" + settings.webPage;

                        }
                        console.log(canonicalPageUrl);
                        // find meta name="description"
                        var descContent = $('meta[name="description"]', webPageContext).attr("content");
                        console.log(descContent);
                        // find meta name="keywords"
                        var keysContent = $('meta[name="keywords"]', webPageContext).attr("content");
                        console.log(keysContent);
                        
                        // replace these values in the compiled document
                        var compiledContext = settings.context;
                        $('link[rel="canonical"]', compiledContext).attr("href", canonicalPageUrl);
                        if (descContent)
                        {
                           $('meta[name="description"]', compiledContext).attr("content", descContent);
                        }
                        if (keysContent)
                        {
                           $('meta[name="keywords"]', compiledContext).attr("content", keysContent);
                        }
                        //replace title from the web page
                        var title = settings.webPageContextDoc.title;
                        console.log(title);
                        if (title)
                        {
                           compiledContext[0].title = title;
                        }
                        var doc = settings.contextDoc;
                        //console.log(doc.documentElement.innerHTML);
                        var htmlString = '<!DOCTYPE html>\n<html>\n'
                              + doc.documentElement.innerHTML + '\n</html>';
                        saveHtmlDocument(htmlString, 'utf-8', settings.webPage);
                        isRunning = false;
                     });
                  });

      view.addEventListener("unload", function() {
//         session.html = html.innerHTML;
//         session.html_filename = html_filename.value;
      }, false);
   };

   $(function() { init(self); });
   
});
