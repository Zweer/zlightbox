/* jshint node: true */

module.exports = function (grunt) {
	'use strict';

  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
            ' * -----------------------------------------------------\n' +
            ' * zLightBox v<%= pkg.version %> by @dotzweer\n' +
            ' * -----------------------------------------------------\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
            ' */\n\n',
    filename: 'jquery.<%= pkg.name %>',

    // Task Configuration
    clean: {
      dist: ['dist']
    },

    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>'
      },

      default: {
        src: ['less/style.less'],
        dest: 'dist/css/<%= filename %>.css'
      },

      min: {
        options: {
          compress: true
        },

        src: ['less/style.less'],
        dest: 'dist/css/<%= filename %>.min.css'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      default: {
        options: {
          beautify: true
        },

        src: ['js/core.js'],
        dest: 'dist/js/<%= filename %>.js'
      },

      min: {
        options: {
          compress: true
        },
        src: ['js/core.js'],
        dest: 'dist/js/<%= filename %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('dist-css', ['recess:default', 'recess:min']);
  grunt.registerTask('dist-js', ['uglify:default', 'uglify:min']);
  grunt.registerTask('dist', ['dist-css', 'dist-js']);

  grunt.registerTask('default', ['clean', 'dist']);
};