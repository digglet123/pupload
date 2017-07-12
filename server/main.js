import { Meteor } from 'meteor/meteor';

var upPath = Meteor.settings.upPath;
var tmpPath = Meteor.settings.tmpPath;

Meteor.startup(() => {
	console.log(upPath);
	console.log(tmpPath);
	exec = Npm.require('child_process').exec;
	Future = Npm.require('fibers/future');
	UploadServer.init({
	    tmpDir: tmpPath,
	    uploadDir: upPath, //Root upload directory
	    getDirectory: function(fileInfo, formData) { return formData.path;}, //Function which controlls subdirectory
	    getFileName: function(fileInfo, formData) { return fileInfo.name;},
	    checkCreateDirectories: true //create the directories for you
	});
});



Meteor.methods({

	//Lists all the files in a directory
	listContents: function (path, type) {

		//Modify command depending on element type (folder/file)
		var cmd = type === "folder" ? "/o:n /ad": "/a-d";

		//Create new future object
		var future = new Future();
		exec = Npm.require('child_process').exec;
		//Asynchronously execute ls command
		exec('chcp 65001 | dir /b ' + cmd + ' "' + upPath + path + '"',{shell: 'cmd.exe'}, function(error, stdout, stderr) {
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

	removeElement: function (path, elementName, type){
		var cmd = type === "folder" ? "rmdir /S /Q": "del";
		exec(cmd + ' "' + upPath + path + '\\' + elementName + '"',{shell: 'cmd.exe'}, function(error, stdout, stderr) {
		  console.log('stdout: ' + stdout);
		  if(error !== null) {
		    console.log('exec error: ' + error);
		  }
		});
	},

	createDirectory: function (path, directoryName){
		exec('mkdir ' + '"' + upPath + path + '\\' + directoryName + '"', function(error, stdout, stderr) {
		  console.log('stdout: ' + stdout);
		  if(error !== null) {
		    console.log('exec error: ' + error);
		  }
		});
	},


	sendRoute: function(path, fileName){
		//TODO See if the route already exists
		//set the route
		Router.route(escape(path + '/' + fileName), function () {
			//Check the values in the cookies
			var cookies = new Cookies( this.request ),
					userId = cookies.get("meteor_user_id") || "",
					token = cookies.get("meteor_token") || "";

			//Check a valid user with this token exists
			var user = Meteor.users.findOne({
					_id: userId,
					'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(token)
			});
			//if a user is logged in respond with data
			if (user){
				fileSystem = require('fs');
				var res = this.response;
				var filePath = upPath + path.replace("/","\\") + '\\' + fileName;
		    var readStream = fileSystem.createReadStream(filePath);
		    readStream.pipe(res);
			}
			//if a user is not logged in respond with an error message
			else{
				this.response.writeHead(404);
  			this.response.end( "Access denied!" );
			}
	}, {where: 'server'});
}


});
