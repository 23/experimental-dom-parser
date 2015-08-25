// /Users/steffentchr/node_modules/phantomjs/bin/phantomjs get-html-with-phantomjs.js "http://www.apple.com" "#ibm-masthead, nav, #header, header, .header" ../before.png ../after.png 1

var system = require('system');
var args = system.args;
var url = args[1]||'http://www.ibm.com/en-us/homepage-a.html';
var selector = args[2]||'header';  //'#ibm-masthead, nav, #header, header, .header'
var beforeImage = args[3]||'';
var afterImage = args[4]||'';
var debug = args[5]||false;

var page = require('webpage').create();
page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36";
page.viewportSize = {
  width: 1000,
  height: 1000
};
page.onConsoleMessage = function(a, b, c) {
  if(debug) console.log(a, b, c);
};
page.open(url, function(status) {
  if(beforeImage) page.render(beforeImage);
  page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js', function() {
    var contents = page.evaluate(function(selector) {
      var $ = jQuery;

      // Helper methods to resolve urls and prune the dom tree
      function resolveUrl() {
        var numUrls = arguments.length
        var base = document.createElement("base")
        base.href = arguments[0]
        if (numUrls === 1) return base.href
        var head = document.getElementsByTagName("head")[0]
        head.insertBefore(base, head.firstChild)
        var a = document.createElement("a")
        var resolved
        for (var index = 1; index < numUrls; index++) {
          a.href = arguments[index]
          resolved = a.href
          base.href = resolved
        }
        head.removeChild(base)
        return resolved
      }
      function removeSiblings(el,selector) {
        $(el).siblings().each(function(i,sibling){
          if(!$(sibling).is(selector) && !$(sibling).find(selector).length>0 && !$(sibling).parents(selector).length>0) {
            $(sibling).remove();
          }
        });
      }

      // Clear script tags
      $('script').remove();
      // Make all relevant urls absolute
      $('link').each(function() {
        $(this).attr('href', resolveUrl($(this).attr('href')));
      });
      $('img').each(function() {
        $(this).attr('src', resolveUrl($(this).attr('src')));
      });
      $('a').each(function() {
        $(this).attr('href', resolveUrl($(this).attr('href')));
      });
      $('form').each(function() {
        $(this).attr('action', resolveUrl($(this).attr('action')));
      });
      
      // Prune and normalize <head>
      var head = '';
      $('head link[rel=stylesheet], head style').each(function(i,el){
        if(el.tagName='LINK' && /print/.test(jQuery(el).attr('media'))) return;
        head += el.outerHTML;
      });

      // Prune and normalize <body>
      // Pick out all nodes matching, but only at the same level/depth,
      // and with the lowest possible depth.
      var depth = 99999;
      var nodes = [];
      $(selector).each(function(i,node){
        var nodeDepth = $(node).parents().length;
        if(nodeDepth<depth) {
          $(nodes).remove();
          nodes = [node]
          depth = nodeDepth;
        } else if(nodeDepth==depth) {
          nodes.push(node);
        } else {
          if(!$(node).parents(selector).length) {
            $(node).remove();
          }
        }
      });
      // Strip all unneccesary nodes
      $.each(nodes, function(i,el){
        removeSiblings(el, selector);
        $(el).parents().each(function(i,parent){
          if(parent.tagName=='BODY') return false;
          removeSiblings(parent, selector);
        });
      });
      var body = document.body.innerHTML;

      return "<html><head>"+head+"</head><body>"+body+"</body></html>";
    }, selector);
    if(afterImage) page.render(afterImage);
    console.log(contents);

    // Work-around to avoid "Unsafe JavaScript attempt to access frame" warning in PhantomJS 1.9.8.
    // See: https://github.com/ariya/phantomjs/issues/12697
    page.close();
    setTimeout(function(){phantom.exit(0)}, 0);
  });
});

