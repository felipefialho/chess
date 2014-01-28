"use strict";

module.exports = function( grunt ) {

// Load all tasks
require('load-grunt-tasks')(grunt);

// Paths
var PathConfig = {
  dev: 'dev/',
  dist: 'dist/'
};

// Set scripts
var scripts = [
  '<%= config.dev %>**/_jquery-2.0.3.min.js', // JQuery
  '<%= config.dev %>**/jquery.placeholder.highlight.js', // Placeholder
  '<%= config.dev %>**/jquery.icontains.js', // IContains

  //'<%= config.dev %>**/howler.js', // Howler for HTML5 Audio
  '<%= config.dev %>**/moment.min.js', // Moment
 
  '<%= config.dev %>**/transition.js', // Boostrap - Transition
  '<%= config.dev %>**/collapse.js', // Boostrap - Collapse
  '<%= config.dev %>**/modal.js', // Boostrap - Modal
  '<%= config.dev %>**/tooltip.js', // Tooltips
  '<%= config.dev %>**/popover.js', // Popovers (requires Tooltips)

  '<%= config.dev %>**/_general.js' // General settings
 
];

// Grunt config
grunt.initConfig({

  // Config path
  config: PathConfig,

  // Clean files
  clean: {
    dist: {
      src: ["<%= config.dist %>"]
    }
  },

  // Copy files
  copy: {
      dist: {
        files: [
            {
              expand: true,
              dot: true,
              cwd: '<%= config.dev %>',
              src: [
                '**',
                '*.{md,txt,htaccess}',
                '!assets/css/less/**',
                '!assets/js/_scripts/**',
              ],
              dest: '<%= config.dist %>'
            } // makes all src relative to cwd
        ]
      }
  },

  // Less
  less: {
    dist: {
      options: {
        paths: ["<%= config.dev %>assets/css/less"],
        compress: true
      },
      files: {
        "<%= config.dist %>assets/css/style.css": "<%= config.dev %>assets/css/less/style.less"
      }
    },
    dev: {
      options: {
        paths: ["<%= config.dev %>assets/css/less"]
      },
      files: {
        "<%= config.dev %>assets/css/style.css": "<%= config.dev %>assets/css/less/style.less"
      }
    }
  },

  // Uglify
  uglify: {
    options: {
      mangle : false
    },
      dist: {
      files : {
        '<%= config.dist %>assets/js/scripts.min.js': scripts,
        '<%= config.dist %>assets/js/game.min.js': '<%= config.dev %>assets/js/_scripts/game.js',
        '<%= config.dist %>assets/js/home.min.js': '<%= config.dev %>assets/js/_scripts/home.js'
      }
    },
      dev: {
      options: {
        beautify : true
      },
      files : {
        '<%= config.dev %>assets/js/scripts.min.js': scripts,
        '<%= config.dev %>assets/js/game.min.js': '<%= config.dev %>assets/js/_scripts/game.js',
        '<%= config.dev %>assets/js/home.min.js': '<%= config.dev %>assets/js/_scripts/home.js'
      }
    }
    },

  // JShint
  jshint: {
    files: [
      '<%= config.dev %>assets/js/**/_general.js'
    ]
  },

  // HTMLmin
  htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
            expand: true,
            cwd: '<%= config.dist %>',
            src: ['*.html','**/*.html'],
            dest: '<%= config.dist %>',
        }],
      }
  },

  // Server
  connect: {
    server: {
      options: {
          port: 3000,
          base: "<%= config.dev %>",
          hostname: "http://dev.trendi.com.br/", 
          open: true,
          livereload: true
      }
    }  
  },

  // Watch
  watch: {
    options: {
      debounceDelay: 500,
      livereload: true
    },
    less: {
      files : [
        '<%= config.dev %>assets/css/less/**'
      ],
      tasks : ['less:dev']
    },
    js: {
      files: [
        '<%= config.dev %>assets/js/_scripts/**',
        'Gruntfile.js'
      ],
      tasks: ['uglify:dev']
    },
    html: {
      files: '<%= config.dev %>*.html'
    }
  }

});

// JsLint
grunt.registerTask( 'test', ['jshint'] );

// Build
grunt.registerTask( 'build', ['clean', 'copy:dist', 'less:dist', 'uglify:dist', 'htmlmin:dist'] );
 
// Dev
grunt.registerTask( 'dev', ['less:dev', 'uglify:dev'] );

// Watch
grunt.registerTask( 'w', ['watch'] );
 
// Server
grunt.registerTask( 'server', ['connect:server:keepalive'] );

};