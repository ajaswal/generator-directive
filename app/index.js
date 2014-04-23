'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var DirectiveGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic Directive generator.'));

    var prompts = [{
      // type: 'confirm',
      name: 'directiveName',
      message: 'What would you like to call your directive?'
      // default: true
    }];

    this.prompt(prompts, function (props) {
      this.directiveName = props.directiveName;
      done();
    }.bind(this));
  },

  app: function () {
    var context = {
        directiveName: this.directiveName
    };
    this.mkdir('app');
    this.mkdir('app/templates');
    this.template('_directive.html', 'app/views/templates/'+this.directiveName+'-template.html', context);
    this.template('_directive.js', 'app/scripts/directives/'+this.directiveName+'directive.js', context);

  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  },

  // writeIndex: function () {
  //   this.indexFile = this.readFileAsString('app/index.html');
  //   // this.indexFile = this.engine(this.indexFile, this);
  //   this.indexFile = this.appendScripts(this.indexFile, 'app/scripts/directives/'+this.directiveName+'directive.js');
  // }

  writeIndex: function () {
  var hook   = '#===== yeoman hook =====#',
      path   = 'app/index.html',
      file   = this.readFileAsString(path),
      // slug   = this.name.toLowerCase().replace(/ /g, '_'),
      insert = "<script src='scripts/directives/"+this.directiveName+"directive.js'></script>";

    if (file.indexOf(insert) === -1) {
      this.write(path, file.replace(hook, insert+'\n'+hook));
    }
  }
});

module.exports = DirectiveGenerator;