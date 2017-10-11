
module.exports = function(grunt) {
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        jshint : {
            myFiles : ['./<strong>/*.js']
        },
	forever: {
      		server1:{
        		options: {
          			index: 'index.js'
       			}
      		}
    	}
    });

	grunt.loadNpmTasks('grunt-forever');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.registerTask('serve', function (target) {
      if (target === 'dist') {
    	return grunt.task.run(['build', 'env:all', 'forever:server1:start', 'express:prod', 'wait', 'open', 'express-keepalive']);
      }
    });
};
