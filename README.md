# Usage

    node app.js "http://www.apple.com" "nav" > apple.html


# Thoughts

* Easiest way would be to strip everything to barebones and inlude the result in an iframe; which also brings in all relevant stylesheets. Downsides for responsive and more.
* An approach would be to parse CSS; absolutize all URLs, only include expressions that match the imported nodes. And then automatically change the css selectors and html dom nodes to to something specific that is sure not to crash with out namespace. This would give us a tidy HTML (new id/classes, but still the same structure) and a targeted CSS file to host.
