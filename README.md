Binary-Static [![Build Status](https://travis-ci.org/borisyankov/binary-static.png?branch=master)](https://travis-ci.org/borisyankov/binary-static)
=============

This repository contains the static Javascript and CSS content of the [Binary.com](http://www.binary.com) website.

How to work with this project
=============================

As you can see by doing *View Source* on www.binary.com, the site's Javascript is served from https://static.binary.com/binary-static/js/binary_[VERSION].min.js and the CSS is served from https://static.binary.com/binary-static/css/binary_[VERSION].min.css (static.binary.com is a CNAME to binary-com.github.io).

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
- On separate terminal run `grunt connect` as root

This will also automatically update the *gh-pages* branch containing the new minified deliverables.

Note: grunt is set up to serve the files on https://localhost using *grunt-contrib-connect*.

To view your work in action on the live [www.binary.com](http://www.binary.com) website, add the following line to your */etc/hosts*:

127.0.0.1 localhost static.binary.com


