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
	listContents: function (path) {
		//Create new future object
		var future = new Future();	
		//Asynchronously execute ls command
		exec('ls ' + process.env.PWD + '/uploads' + path + '/', function(error, stdout, stderr) {
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
		exec('rm -rf ' + process.env.PWD + '/uploads' + path + '/' + elementName, function(error, stdout, stderr) {
		  console.log('stdout: ' + stdout);
		  if(error !== null) {
		    console.log('exec error: ' + error);
		  }
		});
	}
	
});
