require(["jquery", "controller", "bootstrap"], function($, controller) {
   // initialize the global variable
   mobileApp = controller;
   /** Media queries break points */
   mobileApp.setBreakPoints({
         "screen-tn-max" : "479px",
         "screen-xs-min" : "480px",
         "screen-xs-max" : "767px",
         "screen-sm-min" : "768px",
         "screen-sm-max" : "991px",
         "screen-md-min" : "992px",
         "screen-md-max" : "1199px",
         "screen-lg-min" : "1200px"
   });

   mobileApp.setStaticMode(true);
});
