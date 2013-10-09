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

      zlightbox: {
        src: ['less/style.less'],
        dest: 'dist/css/<%= filename %>.css'
      },

      min: {
        options: {
          compress: true
        },

        src: ['<%= recess.zlightbox.src[0] %>'],
        dest: 'dist/css/<%= filename %>.min.css'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },

      zlightbox: {
        options: {
          compress: true
        },
        src: ['<%= concat.zlightbox.dest %>'],
        dest: 'dist/js/<%= filename %>.min.js'
      }
    },

    connect: {
      zlightbox: {
        options: {
          keepalive: true,
          port: 4000
        }
      }
    },

    concurrent: {
      dist: {
        tasks: ['dist-css', 'dist-js']
      },

      watch: {
        tasks: ['watch:js', 'watch:css']
      },

      development: {
        tasks: ['watch:js', 'watch:css', 'connect:zlightbox']
      }
    },

    watch: {
      js: {
        files: ['src/**.js'],
        tasks: ['dist-js']
      },

      css: {
        files: ['less/**.less'],
        tasks: ['dist-css']
      }
    },

    concat: {
      options: {
        banner: '<%= banner %><%= grunt.file.read("src/helpers/intro.js") %>\n\n',
        footer: '\n\n<%= grunt.file.read("src/helpers/outro.js") %>'
      },

      zlightbox: {
        src: [
          'src/utils.js',
          'src/overlay.js', 
          'src/core.js', 
          'src/defaults.js', 
          'src/constants.js',
          'src/statics.js',
          'src/jquery.js'
        ],
        dest: 'dist/js/<%= filename %>.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('dist-css', ['recess:zlightbox', 'recess:min']);
  grunt.registerTask('dist-js', ['concat:zlightbox', 'uglify:zlightbox']);
  grunt.registerTask('dist', ['concurrent:dist']);

  grunt.registerTask('default', ['clean', 'dist']);

  grunt.registerTask('development', ['default', 'concurrent:watch']);
  grunt.registerTask('development:connect', ['default', 'concurrent:development']);
};