/*jshint esversion: 6 */
module.exports = grunt => {
    //Variáveis
    var dev = {
      site   :'dev',
      styles :'dev/styles',
      scripts:'dev/scripts',
      fonts  :'dev/fonts',
      images :'dev/img'
    };

    var dist = {
      site   :'dist',
      styles :'dist/styles',
      scripts:'dist/scripts',
      fonts  :'dist/fonts',
      images :'dist/img'
    };

    /*
    Carrega os modulos todos os modulos do grunt que estão no devDependencies
    do package.json
    */

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    /*
    Mostra o tempo que cada tarefa leva para ser executada
    */
    require('time-grunt')(grunt);

    //Configuração das tasks
    grunt.initConfig({
        dev: dev,
        dist: dist,

        watch: {
          /*Fica atento a mudanças de arquivos e executa uma task*/
          styles: {
            files: '<%= dev.styles %>/**/*.scss',
            tasks: ['sass:dev', 'postcss']
          }
        },

        sass: {
          /*Responsável pela compilação do SASS*/
          dev: {
            options: {
              sourcemap: 'auto',
              debugInfo: false
            },

            files: {
              '<%= dev.styles %>/main.css' : '<%= dev.styles %>/main.scss'
            }
          },
          dist: {
            options: {
              sourcemap: false,
              debugInfo: false,
              outputStyle: 'compressed',
            },

            files: {
              '<%= dist.styles %>/main.css' : '<%= dev.styles %>/main.scss'
            }
          }
        },

        browserSync: {
          /*Servidor web opcional - Auto reload e sincronização entre mobile
          e desktop, além de interface do devtools pra smartphones*/
          dev: {
            bsFiles: {
              src: [
                '<%= dev.styles %>/*.css',
                '<%= dev.site%>/*.html',
                '<%= dev.scripts %>/*.js',
                //'<%= dev.fonts%>/**/*.*'
              ]
            },
            options: {
              watchTask: true,
              server: '<%= dev.site %>',
              notify: false,
              tunnel: "criticalart",

              ghostMode:{
                links: false,
              },


            }
          }
        },

        postcss: {
          dev: {
            options: {
              map: {
                  inline: false, // save all sourcemaps as separate files...
                  annotation: '<%= dev.styles %>' // ...to the specified directory
              },

              processors: [
                require('autoprefixer')({browsers: '> 5%'}), // add vendor prefixes
                require('postcss-pxtorem')({propWhiteList: [], mediaQuery: true}), // convert px to rem
              ]
            },
            src: '<%= dev.styles %>/main.css'
          },
          dist: {
            options: {
              map: false,

              processors: [
                require('cssnano')({
                  discardComments: {
                    removeAll: true
                  },
                }), // minifies css
                require('autoprefixer')({browsers: '> 5%'}), // add vendor prefixes
                require('postcss-pxtorem')({propWhiteList: [], mediaQuery: true}), // convert px to rem
                require('css-mqpacker')({sort:true}), //Bundle media queries together
              ]
            },
            src: '<%= dist.styles %>/main.css'
          }
        },

        concat: {
          dist: {
            files: {
              '<%= dist.scripts %>/scripts.js':'<%= dev.scripts %>/**/*.js'
            }
          },
        },

        uglify: {
          dist: {
            files: {
              '<%= dist.scripts %>/scripts.js':'<%= dist.scripts %>/scripts.js',
            }
          }
        },

        processhtml: {
          options: {
            data: {
              message: 'Hello world!'
            }
          },
          dist: {
            expand: true,
            cwd: '<%= dev.site %>',
            src: ['*.html'],
            dest: '<%= dist.site %>',
            ext: '.html'
          }
        },

        uncss: {
          dist: {
            files: {
              '<%= dist.styles %>/main.css': ['<%= dev.site%>/**/*.html']
            }
          }
        },

        imagemin: {
          dist: {
            files: [{
              expand: true,
              cwd: '<%= dev.images %>',
              src: ['**/*.{png,jpg,gif}'],
              dest: '<%= dist.images %>'
            }]
          }
        },

        copy: {
          fonts: {

            files: [{
              expand: true,
              cwd: '<%= dev.fonts %>',
              src: ['**/*.{woff,woff2,eot,svg,ttf,otf}'],
              dest: '<%= dist.fonts %>'
            }]
          },
        },
    });

    //Registro de tasks
    grunt.registerTask('default',   ['watch']);
    grunt.registerTask('bsync' ,    ['browserSync', 'watch']);

    //Dist tasks

    //Concatena e minifica js
    grunt.registerTask('dist-scripts', ['concat:dist','uglify:dist']);

    //Compila sass, processa usando post-css, passa grunt-uncss pra remover css inútil
    grunt.registerTask('dist-styles', ['sass:dist','postcss:dist', 'uncss:dist']);

    //Coloca os htmls com caminhos certos
    grunt.registerTask('dist-docs', ['processhtml:dist']);

    //Minifica as imagens
    grunt.registerTask('dist-imgs', ['imagemin:dist']);

    //Task de deploy
    grunt.registerTask('deploy', [
      'dist-scripts',
      'dist-styles',
      'dist-docs',
      'dist-imgs'
    ]);


};
