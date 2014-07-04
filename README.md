Binary-Static
=============

This repository contains the static Javascript and CSS content of the [Binary.com](http://www.binary.com) website.

How to work with this project
=============================

As you can see by doing *View Source* on www.binary.com, the site's Javascript is served from https://binary-com.github.io/binary-static/js/binary_[VERSION].min.js and the CSS is served from https://binary-com.github.io/binary-static/css/binary_[VERSION].min.css

Note that the files are served using Github's [pages.github.io](https://pages.github.com/) facilities.

In order to work on your own version of the Binary.com Javascript and CSS, please **fork this project**.

You will also need to install the following on your development machine:

- Ruby, RubyGems
- Node.js and NPM

After you have made your code edits, you can run the Javascript and CSS minification by doing:

- Go to project root
- `gem install compass`
- `npm install`
- `npm install -g grunt-cli`
- `grunt`

This will also automatically update the *gh-pages* branch containing the new minified deliverables. Your code will now be served by github at the URLs https://[your username].github.io/binary-static/js/binary_[VERSION].min.js and https://[your username].github.io/binary-static/css/binary_[VERSION].min.css

To view your work in action on the live [www.binary.com](http://www.binary.com) website, you will need to find a way to have binary-com.github.io resolve to [your username].github.io, e.g. by setting up your own lightweight DNS resolver on your development machine.

