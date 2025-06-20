/** Loader configuration */
var require = {
       "baseUrl" : "js/lib",
       "paths" : {
           "jquery"     : "jquery-3.1.1.min",
           "bootstrap"  : "bootstrap.min",
           "FileSaver"  : "FileSaver.min",
           "builder"    : "../web-site-builder",
           "delegate"   : "../web-site-delegate",
           "templates"  : "../web-templates",
           "compile"    : "../compile"
       },
       "shim" : {
          "jquery"    : { deps: [], exports : "$" },
          "bootstrap" : { deps: ["jquery"] },
          "FileSaver" : {  deps: [], exports : "saveAs"},
          }
};
