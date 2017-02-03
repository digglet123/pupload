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
		fileSystem = require('fs');
		Router.route(path + '/' + fileName, function () {
			var filePath = process.env.PWD + '/uploads' + path + '/' + fileName;
		    var readStream = fileSystem.createReadStream(filePath);
		    readStream.pipe(this.response);
		}, {where: 'server'});
	}

	
});
