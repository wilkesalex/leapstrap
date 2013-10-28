# [Leapstrap](http://wilkesalex.github.io/leapstrap/)
##Leap Motion HTML5 CSS web frontend framework. Based on Twitter Bootstrap, LeapJS and more.
###Leapstrap brings the power of touch to your website in an extensive yet easy to use HTML5 framework, eliminating the need for installing Leap apps (through Airspace). 

--

Get a Leap Motion Controller, get Leapstrap and put your fingers to work. Leapstrap provides complete HTML5 front-end interactivity for Leap Motion® devices and controllers. If you want to use a Leap® with your website, Leapstrap is for you. Created and maintained by [Alex Wilkes](http://www.alex-wilkes.com). Based on Twitter Leapstrap, LeapJS and Leap Cursor Library. Touch the web today!

To get started, check out <http://wilkesalex.github.io/leapstrap> !



## Quick start

These quick start options are available:

* **[Clone the repo](https://github.com/wilkesalex/leapstrap)**.
* [Download the latest release](https://github.com/wilkesalex/leapstrap/archive/master.zip).
* [Test drive with CDN](http://wilkesalex.github.io/leapstrap/getting-started/#download-cdn).

Then:

* Attach the Leapstrap CSS, JS and initalising script to your page
* Give elements a class of `leap-interactive`
* Use Leap to browse and interact!




Read the [Getting Started page](http://getLeapstrap.com/getting-started/) for more information.


## Bugs and feature requests

Have a bug or a feature request? [Please open a new issue](https://github.com/wilkesalex/leapstrap/issues).


## Documentation

Leapstrap's documentation, included in this repo in the root directory, is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at <http://wilkesalex.github.io/leapstrap/>. The docs may also be run locally.

### Running documentation locally

1. If necessary, [install Jekyll](http://jekyllrb.com/docs/installation) (requires v1.x).
2. From the root `/leapstrap` directory, run `jekyll serve` in the command line.
  - **Windows users:** run `chcp 65001` first to change the command prompt's character encoding ([code page](http://en.wikipedia.org/wiki/Windows_code_page)) to UTF-8 so Jekyll runs without errors.
3. Open <http://localhost:9001> in your browser, and voilà.

Learn more about using Jekyll by reading its [documentation](http://jekyllrb.com/docs/home/).



## Compiling CSS and JavaScript

Leapstrap uses [Grunt](http://gruntjs.com/) with convenient methods for working with the framework. It's how we compile our code, run tests, and more. To use it, install the required dependencies as directed and then run some Grunt commands.

### Install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Navigate to the root `/leapstrap` directory, then run `npm install`. npm will look at [package.json](package.json) and automatically install the necessary local dependencies listed there.

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with `npm`? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Available Grunt commands

#### Build - `grunt`
Run `grunt` to run tests locally and compile the CSS and JavaScript into `/dist`. **Uses [recess](http://twitter.github.io/recess/) and [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Only compile CSS and JavaScript - `grunt dist`
`grunt dist` creates the `/dist` directory with compiled files. **Uses [recess](http://twitter.github.io/recess/) and [UglifyJS](http://lisperator.net/uglifyjs/).**

#### Tests - `grunt test`
Runs [JSHint](http://jshint.com) and [QUnit](http://qunitjs.com/) tests headlessly in [PhantomJS](http://phantomjs.org/) (used for CI).

#### Watch - `grunt watch`
This is a convenience method for watching just Less files and automatically building them whenever you save.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.



## Community

Keep track of development and community news.

* Follow [@leapstrap on Twitter](https://twitter.com/leapstrap).



## With Thanks

**Twitter Leapstrap**
+ <http://getLeapstrap.com/>

**Leap JS**
+ <http://js.leapmotion.com/>

**leap-cursor-library**
+ <https://github.com/aphex/leap-cursor-library.js>



## Copyright and license

Copyright 2013 Alex Wilkes. Further License Information TBC.
