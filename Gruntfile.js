module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        //expand: false,
        //cwd: 'src',
        src: 'src/**/*.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    markdown: {
      all: {
        files: [
          {
            expand: true,
            cwd: 'docs/markdown',
            src: '*.md',
            dest: 'docs/html/',
            ext: '.html'
          }
        ]
      }
    }
  });


  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-markdown');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'markdown']);

};

