var selector = prompt('Select', '#ibm-masthead, nav, #header, header, .header');

function loadScript(filename){
  var s=document.createElement('script')
  s.setAttribute("type","text/javascript")
  s.setAttribute("src", filename)
  document.body.appendChild(s);
}
loadScript('//code.jquery.com/jquery-1.11.3.js');

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

setTimeout(function(){
  (function($){
    $('script').remove();
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

    // Normalize <head>
    var head = '';
    $('head link[rel=stylesheet], head style').each(function(i,el){
      if(el.tagName='LINK' && /print/.test(jQuery(el).attr('media'))) return;
      head += el.outerHTML;
    });

    // Normalize <body>
    // Pick out all nodes matching, but only at the same level/depth,
    // and with the lowest possible depth.
    var depth = 99999;
    var nodes = [];
    $(selector).each(function(i,node){
      var nodeDepth = $(node).parents().length;
      console.debug(node, nodeDepth, depth);
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


    // Post back
    var form = $(document.createElement('form')).attr({
      action:'http://prototypes.labs.23company.com/import/target',
      method:'post'
    });
    form.append($(document.createElement('input')).attr({
      type:'hidden',
      name:'head',
      value:head
    }));
    form.append($(document.createElement('input')).attr({
      type:'hidden',
      name:'body',
      value:body
    }));
    $('body').append(form);
    form.submit();

  })(jQuery);
}, 500);