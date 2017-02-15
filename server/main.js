import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	exec = Npm.require('child_process').exec;
	Future = Npm.require('fibers/future');
	UploadServer.init({
	    tmpDir: process.env.PWD + '/uploads/tmp',
	    uploadDir: process.env.PWD + '/uploads', //Root upload directory
	    getDirectory: function(fileInfo, formData) { return formData.path;}, //Function which controlls subdirectory
	    checkCreateDirectories: true //create the directories for you
	});
});



Meteor.methods({
	
	//Lists all the files in a directory
	listContents: function (path, type) {
		//Create new future object
		var future = new Future();	
		//Asynchronously execute ls command
		exec('cd ' + "'" + process.env.PWD + '/uploads' + path + '/' + "'; find * -maxdepth 0 -type " + type, function(error, stdout, stderr) {
		  console.log('stdout: ' + stdout);
		  if(error !== null) {
		    console.log('exec error: ' + error);
		  }
		  //Promise future value
		  future["return"](stdout);
		});
		//Wait for promised future value and return
		var result = future.wait();
		return result.toString().trim();
	},

	removeElement: function (path, elementName){
		exec('rm -rf ' + "'" + process.env.PWD + '/uploads' + path + '/' + elementName + "'", function(error, stdout, stderr) {
		  console.log('stdout: ' + stdout);
		  if(error !== null) {
		    console.log('exec error: ' + error);
		  }
		});
	},

	createDirectory: function (path, directoryName){
		exec('mkdir ' + "'" + process.env.PWD + '/uploads' + path + '/' + directoryName + "'", function(error, stdout, stderr) {
		  console.log('stdout: ' + stdout);
		  if(error !== null) {
		    console.log('exec error: ' + error);
		  }
		});
	},

	sendRoute: function(path, fileName){
		//See if the route already exists
	    try {
	    	//set the route
	    	Router.route(encodeURI(path + '/' + fileName), function () {
	    		var user = null;
	    		try {
	    			//try to find login token from request
	    			var hashedToken = Accounts._hashLoginToken(this.request.cookies.meteor_login_token);
			    	user = Meteor.users.findOne({"services.resume.loginTokens.hashedToken": hashedToken});
	    		} catch(e) {
	    			//if no login token can be found respond with a 404
	    			this.response.writeHead(404);
	    			this.response.end( "Access denied!" );
	    		}
				if (user){
					fileSystem = require('fs');
					var res = this.response;
					var filePath = process.env.PWD + '/uploads' + path + '/' + fileName;
				    var readStream = fileSystem.createReadStream(filePath);
				    readStream.pipe(res);
				}
				else{
					this.response.writeHead(404);
	    			this.response.end( "Access denied!" );
				}
				
			}, {where: 'server'});
	    } catch(e) {
	    	return;
	    }
		
	}

	
});
