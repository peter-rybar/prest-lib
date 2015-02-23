module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		//typescript: {
		//	base: {
		//		src: ['src/**/*.ts'],
		//		dest: 'dist/js',
		//		options: {
		//			module: 'amd', // amd or commonjs
		//			target: 'es3', // es3 or es5
		//			basePath: 'src',
		//			sourceMap: true,
		//			declaration: true
		//			//watch: {
		//			//	path: 'src',
		//			//	before: ['beforetasks'],   // Set before tasks. eg: clean task
		//			//	after: ['aftertasks']      // Set after tasks.  eg: minify task
		//			//	atBegin: true              // Run tasks when watcher starts. default false
		//			//}
		//			//references: [
		//			//	"core",       //lib.core.d.ts
		//			//	"dom",        //lib.dom.d.ts
		//			//	"scriptHost", //lib.scriptHost.d.ts
		//			//	"webworker",  //lib.webworker.d.ts
		//			//	"path/to/reference/files/**/*.d.ts"
		//			//]
		//		}
		//	}
		//},

		ts: {
			default: {
				html: ["src/**/*.html"],
				src: ["src/**/*.ts"],
				out: "dist/<%= pkg.name %>.js",
				//target: "es3",
				verbose: true,
				//watch: "src",
				options: {
					declaration: true
				}
			},
			dev: {
				html: ["src/**/*.html"],
				src: ["src/**/*.ts"],
				//target: "es3",
				verbose: true,
				watch: "./"
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				//expand: false,
				//cwd: 'src',
				//src: 'src/**/*.js',
				src: 'dist/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},

		//bower: {
		//	dev: {
		//		dest: 'dist/',
		//		js_dest: 'dist/js/',
		//		css_dest: 'dist/css',
		//		options: {
		//			expand: true,
		//			packageSpecific: {
		//				bootstrap: {
		//					dest: 'dist/fonts',
		//					css_dest: 'dist/css/bootstrap'
		//				}
		//			}
		//		}
		//	}
		//},

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

		clean: [
			"src/**/*.js",
			"src/**/*.js.map",
			"test/**/*.js",
			"test/**/*.js.map",
			"dist/**/*",
			"docs/html"
			//"node_modules"
		]

	});

	//grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks("grunt-ts");

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	//grunt.loadNpmTasks('grunt-bower');

	grunt.loadNpmTasks('grunt-markdown');

	grunt.loadNpmTasks('grunt-contrib-clean');

	// Default task(s).
	grunt.registerTask('default', [
		'ts:default',
		//'typescript',
		//'bower',
		'uglify',
		'markdown'
	]);

};
