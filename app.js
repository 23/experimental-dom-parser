// Load required libraries
var path = require('path'),
    childProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    binPath = phantomjs.path,
    cheerio = require('cheerio'),
    juice = require('juice'),
    wri = require('web-resource-inliner');

// Take url and selector as optional arguments
var url = process.argv[2]||'http://www.ibm.com/en-us/homepage-a.html';
var selector = process.argv[3]||'#ibm-masthead, nav, #header, header, .header';

// # 1. Use PhantomJS to load page fully; absolutize URLs and strip unwanted nodes.
var childArgs = [path.join(__dirname, 'get-html-with-phantomjs.js'), url, selector];
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  var html = stdout;

  // #2. Use Juice to inline CSS attributes into DOM node, then strip `<head>` tag with contnts and remove `<body>` wrapping.
  juice.juiceResources(html, {inlinePseudoElements:true, preserveImportant:true}, function(err,html){
    // Re-parse the newly inline html into the Cheerio document
    // This is done in order to strip `<html>`, `<head>` and `<body>` out and come away with a simple `<div>`
    $ = cheerio.load(html);
    var html = '<div>'+$('body').html()+'</div>';

    // #3. Use web-resource-inliner to inline images as data uris
    //wri.html({fileContent:html,images:40,}, function(err,html){
      console.log(html);
    //});
  });
});
