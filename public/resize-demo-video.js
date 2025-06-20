(function()
{

      'use strict';
      function Demo()
      {
         function setIFrameHeight(aspectRatio)
         {
            var max = 0;
            $(".video-container", "#Demo").each(function(index, element)
                  {
                     //max = Math.max($(element).width(), max);
                     max = Math.max(parseInt($(element).css("width")), max);
                  });
            $(".video-container", "#Demo").each(function(index, element)
                  {
                     var h = max * aspectRatio;
                     $("iframe,video", element).attr("height", h + "px"); 
                  });
         };
         setIFrameHeight(0.5625);
         var resizeTimeout;
         function resizeThrottler()
         {
           if (!resizeTimeout)
           {
             resizeTimeout = setTimeout(function()
                                        {
                                           resizeTimeout = null;
                                           setIFrameHeight(0.5625);
                                        }, 100);
           };
         };

         window.addEventListener("resize", resizeThrottler, false);
      };
      Demo();
    
}());
