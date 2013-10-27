# [Leapstrap](http://getLeapstrap.com)

Leapstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development, created and maintained by [Alex Wilkes](http://twitter.com/mdo). It is based on Twitter Leapstrap, LeapJS and Leap Cursor Library.

To get started, check out <https://github.com/wilkesalex/leapstrap/>!



## Quick start

Three quick start options are available:

* [Download the latest release](https://github.com/twbs/Leapstrap/releases/tag/v3.0.0).
* Clone the repo: `git clone https://github.com/twbs/Leapstrap.git`.

Read the [Getting Started page](http://getLeapstrap.com/getting-started/) for information on the framework contents, templates and examples, and more.

### What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
Leapstrap/
├── css/
│   ├── Leapstrap.css
│   ├── Leapstrap.min.css
│   ├── Leapstrap-theme.css
│   └── Leapstrap-theme.min.css
├── js/
│   ├── Leapstrap.js
│   └── Leapstrap.min.js
└── fonts/
    ├── glyphicons-halflings-regular.eot
    ├── glyphicons-halflings-regular.svg
    ├── glyphicons-halflings-regular.ttf
    └── glyphicons-halflings-regular.woff
```

We provide compiled CSS and JS (`Leapstrap.*`), as well as compiled and minified CSS and JS (`Leapstrap.min.*`). Fonts from Glyphicons are included, as is the optional Leapstrap theme.



## Bugs and feature requests

Have a bug or a feature request? [Please open a new issue](https://github.com/twbs/Leapstrap/issues). Before opening any issue, please search for existing issues and read the [Issue Guidelines](https://github.com/necolas/issue-guidelines), written by [Nicolas Gallagher](https://github.com/necolas/).

You may use [this JS Bin](http://jsbin.com/aKiCIDO/1/edit) as a template for your bug reports.



## Documentation

Leapstrap's documentation, included in this repo in the root directory, is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at <http://getLeapstrap.com>. The docs may also be run locally.

### Running documentation locally

1. If necessary, [install Jekyll](http://jekyllrb.com/docs/installation) (requires v1.x).
2. From the root `/Leapstrap` directory, run `jekyll serve` in the command line.
  - **Windows users:** run `chcp 65001` first to change the command prompt's character encoding ([code page](http://en.wikipedia.org/wiki/Windows_code_page)) to UTF-8 so Jekyll runs without errors.
3. Open <http://localhost:9001> in your browser, and voilà.

Learn more about using Jekyll by reading its [documentation](http://jekyllrb.com/docs/home/).

### Documentation for previous releases

Documentation for v2.3.2 has been made available for the time being at <http://getLeapstrap.com/2.3.2/> while folks transition to Leapstrap 3.

[Previous releases](https://github.com/twbs/Leapstrap/releases) and their documentation are also available for download.



## Compiling CSS and JavaScript

Leapstrap uses [Grunt](http://gruntjs.com/) with convenient methods for working with the framework. It's how we compile our code, run tests, and more. To use it, install the required dependencies as directed and then run some Grunt commands.

### Install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Navigate to the root `/Leapstrap` directory, then run `npm install`. npm will look at [package.json](package.json) and automatically install the necessary local dependencies listed there.

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



## Contributing

Please read through our [contributing guidelines](https://github.com/twbs/Leapstrap/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

More over, if your pull request contains JavaScript patches or features, you must include relevant unit tests. All HTML and CSS should conform to the [Code Guide](http://github.com/mdo/code-guide), maintained by [Mark Otto](http://github.com/mdo).

Editor preferences are available in the [editor config](.editorconfig) for easy use in common text editors. Read more and download plugins at <http://editorconfig.org>.


## Community

Keep track of development and community news.

* Follow [@Leapstrap on Twitter](https://twitter.com/Leapstrap).



## Versioning

For transparency and insight into our release cycle, and for striving to maintain backward compatibility, Leapstrap will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit <http://semver.org/>.



## Contributors

**Twitter Leapstrap**
+ <http://getLeapstrap.com/>

**Leap JS**
+ <http://js.leapmotion.com/>

**leap-cursor-library**
+ <https://github.com/aphex/leap-cursor-library.js>



## Copyright and license

Copyright 2013 Alex Wilkes under [the Apache 2.0 license](LICENSE).
