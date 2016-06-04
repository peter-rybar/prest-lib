module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        ts: {
            default: {
                //html: ["src/**/*.html"],
                src: ["src/**/*.ts"],
                out: "dist/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>.js",
                //target: "es3",
                verbose: true,
                //watch: "src",
                options: {
                    declaration: true
                }
            },
            test: {
                src: ["test/**/*.ts"]
            },
            dev: {
                html: ["src/**/*.html"],
                src:  ["src/**/*.ts", "test/**/*.ts"],
                //target: "es3",
                verbose: true
                //watch: "./"
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>-<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd HH:MM") %> - <%= pkg.author %> */\n'
            },
            dist: {
                //expand: false,
                //cwd: 'src',
                //src: 'src/**/*.js',
                src:  'dist/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>.min.js'
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
        },

        markdownpdf: {
            options: {
                //concat: true
            },
            files: {
                src:  "docs/markdown/*.md",
                dest: "docs/pdf"
            }
        },

        clean: [
            "src/**/*.js",
            "src/**/*.js.map",
            "test/**/*.js",
            "test/**/*.js.map",
            "dist/*",
            "docs/html",
            "docs/pdf",
            "node_modules",
            "typings/**",
            ".tscache/"
        ],

        'string-replace': {
            version: {
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>.js':
                        "dist/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>.js"
                },
                options: {
                    replacements: [{
                        pattern: /PKG_VERSION/g,
                        replacement: '<%= pkg.version %>'
                    }]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-markdown-pdf');

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-string-replace');

    // Default task(s).
    grunt.registerTask('default', [
        'ts:default',
        'ts:dev',
        'ts:test',
        'string-replace:version',
        'uglify',
        'markdown',
        'markdownpdf'
    ]);

};
