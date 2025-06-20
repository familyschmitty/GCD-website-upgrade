(function()
{

      'use strict';
      function ExpandCard()
      {
         $(".gc-card", "#Why").click(
            function(event)
            {
               $(this).toggleClass("zoom-in");
               $(this).toggleClass("zoom-out");
               event.stopImmediatePropagation();
               event.stopPropagation();
               var id = $('div.view-more', this).attr("id");
               var anchor = $('span.glyphicon', this)[0];
               var cardRow = $(this).parent().parent();
               var extendSection   = 'col-md-12 col-lg-12';
               var collapseSection = 'col-xs-12 col-sm-6 col-md-4';
               mobileApp.extendSection(id,
                                       anchor,
                                       'glyphicon-zoom-in',
                                       'glyphicon-zoom-out',
                                       '.gc-card-container',
                                       cardRow,
                                       extendSection,
                                       collapseSection);
               // list all .gc-card-container in #Why section and collapse elements from the other card rows
               $(".gc-card-container", "#Why").each(
                  function(index, element)
                  {
                     var jnode = $(element);
                     if (!$.contains(cardRow[0], element))
                     {
                        if (jnode.hasClass(extendSection))
                        {
                           jnode.toggleClass(extendSection);
                           jnode.toggleClass(collapseSection);
                           // hide extended content
                           $('div.view-more', element).toggleClass("hide");
                           //toggle mouse pointer
                           var cardNode = $(".gc-card", element);
                           var button = $('span.glyphicon', cardNode);
                        	cardNode.toggleClass("zoom-out");
                        	cardNode.toggleClass("zoom-in");
                        	button.toggleClass("glyphicon-zoom-out");
                        	button.toggleClass("glyphicon-zoom-in");
                        }
                        else if (jnode.hasClass("hide"))
                        {
                           jnode.toggleClass("hide"); 	
                        }
                     } 
                  });
               var navBarPadding = $("#topNavBar").height();
               var logoOffset = $(".gc-card-logo", this).offset().top;
               var sectionOffset = $("#" + id).offset().top;
               var containerPadding = parseInt($(this).parent().css("padding-top"));
               var scrollPadding = sectionOffset - logoOffset + containerPadding + navBarPadding; 
               if (sectionOffset > 0)
               { 
                  mobileApp.scrollTo(id, scrollPadding, false);
               }
            });
      }
      ExpandCard();
    
}());
