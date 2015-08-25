<html>
  <head>
    @head;noquote@
    <style type="text/css">
     body {
       background-color:#eee;
     }
     div#container {
       top:20px;
       left:20px;
       right:20px;
       width:auto;
       position:absolute;
       box-shadow:#bbb 2px 2px 7px;
       border:1px solid #bbb;
     }
     div#container>* {
       position:static;
       left:0;
       right:0;
       top:0;
       bottom:0;
       float:none;
       z-index:auto;
     }
     pre {
       position:fixed;
       bottom:5px;
       left:5px;
       font-size:9px;
       }
    </style>
  </head>
  <body>
    <div id="container">@body;noquote@</div>


    <pre>
// <b>#Import</b>
// 1. Inline style attributes
// 2. Inline images
// 3. Create CSS from inline style attribute

// <b>#Defaults</b>
// Colors
// Font
// Favicon</pre>      
  </body>
</html>
