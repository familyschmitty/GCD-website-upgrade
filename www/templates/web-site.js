/**
 * Application data for the web-site.html view.
 * "url" defines a path to its resource in respect to the web-site root directory
 * "path" and "data" fields define a path to its resource in respect to the sub site root directory
 * "path" and "url" are the same for the root web site, thus "path" can be omitted
 */
 
{
   "pages" :
      [
         { "id" : 1,   "hash" : "#Home",           "url"  : "home-fwd.html", "loaded" : true, "active" : true,
            "site-map-menu" : { "name" : "Home",            "class" : "col1"}},
            
         { "id" : 2,   "hash" : "#What",           "url"  : "what-fwd.html",
            "menu"          : { "name" : "What?"},
            "site-map-menu" : { "name" : "What?",           "class" : "col1" }},
            
         { "id" : 3,   "hash" : "#Why",            "url"  : "why-fwd.html",
            "menu"          : { "name" : "Why?"},
            "site-map-menu" : { "name" : "Why?",            "class" : "col1" }},
            
         { "id" : 4,   "hash" : "#How" ,           "url"  : "how-fwd.html",
            "menu"          : { "name" : "How?"},
            "site-map-menu" : { "name" : "How?",            "class" : "col1"}},
            
         { "id" : 5,   "hash" : "#Demo",           "url"  : "demo-fwd.html",
            "menu"          : { "name" : "Demo"},
            "site-map-menu" : { "name" : "Demo",            "class" : "col1" }},
            
         { "id" : 6,   "hash" : "#Features",       "url"  : "features-fwd.html",
            "menu"          : { "name" : "Features"},
            "site-map-menu" : { "name" : "Features",        "class" : "col1" }},
            
         { "id" : 7,   "hash" : "#Benefits",       "url"  : "benefits-fwd.html",
            "menu"          : { "name" : "Benefits"},
            "site-map-menu" : { "name" : "Benefits",        "class" : "col1" }},
            
         {  "id": 8,  "hash"  : "#Develop",        "url"  : "develop-fwd.html",
            "menu"          : { "name" : "Develop",         "class" : "hidden-sm hidden-md view-more", "dropdown" : true},
            "site-map-menu" : { "name" : "Develop",         "class" : "col2 top4"} },
            
         {  "id": 9,  "hash"  : "#License",        "url"  : "license-fwd.html",
            "menu"          : { "name" : "License",         "class" : "hidden-sm hidden-md view-more", "dropdown" : true},
            "site-map-menu" : { "name" : "License",         "class" : "col2"} },
            
         {  "id": 10,  "hash" : "#Start",          "url"  : "start-fwd.html",
            "menu"          : { "name" : "Start",           "class" : "hidden-sm hidden-md view-more", "dropdown" : true},
            "site-map-menu" : { "name" : "Start",           "class" : "col2"} },
            
         {  "id": 11,  "hash" : "#FAQ",            "url"  : "https://proj.goldencode.com/projects/p2j/wiki/Frequently_Asked_Questions", "data-link" : false,
            "menu"          : { "name" : "FAQ",             "class" : "hidden-sm hidden-md view-more", "dropdown" : true},
            "site-map-menu" : { "name" : "FAQ",             "class" : "col2"} },
            
         {  "id": 12,  "hash" : "#Help",           "url"  : "https://www.goldencode.com", "data-link" : false,
            "menu"          : { "name" : "Help",            "class" : "hidden-sm hidden-md view-more", "dropdown" : true},
            "site-map-menu" : { "name" : "Help",            "class" : "col2"} },
            
         {  "id": 13,  "hash" : "#Download",       "url"  : "https://proj.goldencode.com/projects/p2j/wiki/Downloads", "data-link" : false,
            "site-map-menu" : { "name" : "Download",        "class" : "col2"} },
            
         {  "id": 14,  "hash" : "#Documentation",  "url"  : "https://proj.goldencode.com/projects/p2j/wiki/Documentation", "data-link" : false,
            "site-map-menu" : { "name" : "Documentation",   "class" : "col2"} },
         { "id":20, "hash":"#Privacy", "url":"privacy-fwd.html" },
         { "id":21, "hash":"#Legal",   "url":"legal-fwd.html" },
         { "id":22, "hash":"#PUG2024",   "url":"pug-challenge-2024.html" },

         { "id" : 100, "hash" : "#SiteMapContact",  "url" : "site-map-fwd.html", "data"  : "site-map-fwd.json",
            "footer" : true, "fixed" : true, "loaded" : true}
      ],
   "section" : "section-template",
   "footer"  : "footer-template",
   "home-page" : {
                     "url"     : "#Home", 
                     "logo"    : "images/fwd_logo.png",
                     "class"   : "img-responsive logo animate fadeIn0 one",
                     "caption" : "FWD Project"
                 }
}
