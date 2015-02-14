module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    typescript: {
      base: {
        src: ['src/**/*.ts'],
        dest: 'dist/js',
        options: {
          module: 'amd', // amd or commonjs
          target: 'es3', // es3 or es3
          basePath: 'src',
          sourceMap: true,
          declaration: true
//          watch: {
//            path: 'src',
//            before: ['beforetasks'],   // Set before tasks. eg: clean task
//            after: ['aftertasks']      // Set after tasks.  eg: minify task
//            atBegin: true              // Run tasks when watcher starts. default false
//          }
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        //expand: false,
        //cwd: 'src',
        src: 'src/**/*.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    bower: {
      dev: {
        dest: 'dist/',
        js_dest: 'dist/js/',
        css_dest: 'dist/css',
        options: {
          expand: true,
          packageSpecific: {
            bootstrap: {
              dest: 'dist/fonts',
              css_dest: 'dist/css/bootstrap'
            }
          }
        }
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

  grunt.loadNpmTasks('grunt-typescript');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-bower');

  grunt.loadNpmTasks('grunt-markdown');

  // Default task(s).
  grunt.registerTask('default', [
    //'typescript',
    'bower',
    'uglify',
    'markdown'
  ]);

};

