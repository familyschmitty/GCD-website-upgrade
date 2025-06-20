/** the global variable  mobileApp that web site controller will be accessible by locale scripts */
var mobileApp;

/** Loader configuration */
var require = {
       "baseUrl" : "/js/lib",
       "paths" : {
           "jquery"     : "jquery-3.1.1.min",
           "bootstrap"  : "bootstrap.min",
           "controller" : "../web-site-controller.min",
           "delegate"   : "../web-site-delegate.min",
           "templates"  : "../web-templates.min",
       },
       "shim" : {
          "jquery"    : { deps: [], exports : "$" },
          "bootstrap" : { deps: ["jquery"] }
          }
};
