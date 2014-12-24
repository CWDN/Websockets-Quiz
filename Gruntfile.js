module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          paths: ["assets/less"],
          compress: false
        },
        files: {
          "public/css/styles.css": "assets/less/styles.less",
        }
      },
      production: {
        options: {
          paths: ["assets/less"],
          cleancss: true,
          compress: true
        },
        files: {
          "public/css/styles.css": "assets/less/styles.less",
        }
      }
    },
    watch: {
      options: {
        livereload : true,
      },
      less: {
        files: ['assets/less/*'],
        tasks: ['less:development'],
      },
      scripts: {
        files: ['<%= jshint.files %>'],
        tasks: ['concat', 'uglify'],
      }
    },
    concat: {
      options: {
        separator: '\n',
      },
      dist: {
        src: [
          'assets/components/jquery/dist/jquery.min.js',
          'assets/components/bootstrap/dist/js/bootstrap.min.js',
          'assets/components/flowtype/flowtype.js',
          'assets/js/*.js'
        ],
        dest: 'public/js/<%= pkg.name %>.js',
      },
    },
    uglify: {
      dist: {
        files: [{
          'public/js/<%= pkg.name %>.min.js': ['public/js/<%= pkg.name %>.js']
        }]
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'assets/js/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    autoprefixer: {
      single_file: {
        options: {
          // Target-specific options go here.
        },
        src: 'public/css/styles.css',
        dest: 'public/css/styles.css'
      },
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['assets/components/bootstrap/dist/fonts/*'], dest: 'public/fonts/', flatten: true, filter: 'isFile' },
          {expand: true, src: ['assets/components/font-awesome/fonts/*'], dest: 'public/fonts/', flatten: true, filter: 'isFile' }

        ]
      },
    },


  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less:development', 'autoprefixer', 'copy']);
  grunt.registerTask('production', ['concat', 'uglify', 'less:production', 'autoprefixer', 'copy']);

};

