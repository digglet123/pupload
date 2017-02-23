import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	Future = Npm.require('fibers/future');
	UploadServer.init({
<<<<<<< Updated upstream
	    tmpDir: 'C:\\Users\\mikko\\programming_projects\\pupload\\uploads\\tmp',
	    uploadDir: 'C:\\Users\\mikko\\programming_projects\\pupload\\uploads', //Root upload directory
=======
	    tmpDir: 'y:\\tmp',
	    uploadDir: 'y:\\mikko', //Root upload directory
>>>>>>> Stashed changes
	    getDirectory: function(fileInfo, formData) { return formData.path;}, //Function which controlls subdirectory
	    checkCreateDirectories: true //create the directories for you
	});
});

Meteor.methods({
	
	//Lists all the files in a directory
<<<<<<< Updated upstream
	listContents: function (path) {
=======
	listContents: function (path, type) {
		
		//Modify command depending on element type (folder/file)
		var cmd = type === "folder" ? "/o:n /ad": "/a-d"; 
		
>>>>>>> Stashed changes
		//Create new future object
		var future = new Future();	
		exec = Npm.require('child_process').exec;
		//Asynchronously execute ls command
<<<<<<< Updated upstream
		exec('dir /b C:\\Users\\mikko\\programming_projects\\pupload\\uploads' + path,{shell: 'cmd.exe'}, function(error, stdout, stderr) {
=======
		exec('chcp 65001 | dir /b ' + cmd + ' "y:\\mikko' + path + '"',{shell: 'cmd.exe'}, function(error, stdout, stderr) {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
	},

	removeElement: function (path, elementName, type){
		var cmd = type === "folder" ? "rmdir /S /Q": "del";
		exec(cmd + ' "y:\\mikko' + path + '\\' + elementName + '"',{shell: 'cmd.exe'}, function(error, stdout, stderr) {
		  console.log('stdout: ' + stdout);
		  if(error !== null) {
		    console.log('exec error: ' + error);
		  }
		});
	},

	createDirectory: function (path, directoryName){
		exec('mkdir ' + '"' + 'y:\\mikko' + path + '\\' + directoryName + '"', function(error, stdout, stderr) {
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
					var filePath = 'y:\\mikko' + path.replace("/","\\") + '\\' + fileName;
				    var readStream = fileSystem.createReadStream(filePath);
				    readStream.pipe(res);
				}
				else{
					this.response.writeHead(404);
	    			this.response.end( "Access denied!" );
				}
			}, {where: 'server'});
	    } catch(e) {
	    	console.log(e);
	    }
		
>>>>>>> Stashed changes
	}
});
