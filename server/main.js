import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	Future = Npm.require('fibers/future');
	UploadServer.init({
	    tmpDir: 'C:\\Users\\mikko\\programming_projects\\pupload\\uploads\\tmp',
	    uploadDir: 'C:\\Users\\mikko\\programming_projects\\pupload\\uploads', //Root upload directory
	    getDirectory: function(fileInfo, formData) { return formData.path;}, //Function which controlls subdirectory
	    checkCreateDirectories: true //create the directories for you
	});
});

Meteor.methods({
	
	//Lists all the files in a directory
	listContents: function (path) {
		//Create new future object
		var future = new Future();	
		exec = Npm.require('child_process').exec;
		//Asynchronously execute ls command
		exec('dir /b C:\\Users\\mikko\\programming_projects\\pupload\\uploads' + path,{shell: 'cmd.exe'}, function(error, stdout, stderr) {
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
	}
});
