import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html'

//Array which contains current folders
Session.set( "contentArr", []);

//Current path which is being viewed
Session.set( "path", ''); //TODO implement structure to represent modular path

<<<<<<< Updated upstream
//Calls server-side to send desired folder (path) content as a string. 
function listCall(path){

	Meteor.call("listContents", path, function(error, result){
=======
//Requests server to send folder contents. Populates folderArr with folder contents. refreshCallback is a function which can be called after asynchronous server call is completed.
function listCall(path, refreshCallback){
	Session.set("folderArr", []);
	Session.set("fileArr", []);
	Meteor.call("listContents", path, "folder", function(error, result){
>>>>>>> Stashed changes
	  if(error){
	    console.log(error.reason);
	    return;
	  }
<<<<<<< Updated upstream
	  Session.set("contentArr", result.split('\n'));
=======
	  Session.set("folderArr", result.split('\n'));
	  Meteor.call("listContents", path, "file", function(error, result){
	  if(error){
	    console.log(error.reason);
	    return;
	  }
	  Session.set("fileArr", result.split('\n'));
	  refreshCallback();
	  });
>>>>>>> Stashed changes
	});

<<<<<<< Updated upstream
=======
//Requests server to delete selected element
function removeCall(path, elementName, type){

	Meteor.call("removeElement", path, elementName, type, function(error, result){
		if(error){
			console.log(error.reason);
			return;
		}
		listCall(path, function(){return null;});
	});

}
//Requests server ro create a directory
function createDirCall(path, name){
	Meteor.call("createDirectory", path, name, function(error, result){
		if(error){
			console.log(error.reason);
			return;
		}
		listCall(path, function(){return null;});
	});
}

/*
function pathToArray(path){
	if(path !== ''){
		var arr = path.split('\\');
		arr.shift();
		return arr;
	}
}
*/

//Converts array to a path string
function arrayToPath(array, type){
	var separator = type==="fileUrl"?'\\':'/';
	var pathString = '';
	if(array.length > 0){
		array.forEach( function(element, index) {
			pathString += separator + element;
		});
	}
	
	return pathString.trim();
>>>>>>> Stashed changes
}

//Client start-up methods
Meteor.startup(function() {
<<<<<<< Updated upstream
	
	//Get index of folder designated by path
	listCall(Session.get("path"));
=======

	//Get index of folder designated by path
	listCall(arrayToPath(Session.get("pathArr"), "fileUrl"), function(){return null;});

});
>>>>>>> Stashed changes

});

<<<<<<< Updated upstream
//Logging out
=======
Template.Home.events({

	//Navigation bar logic
	'click #navItem': function(event) {
		console.log(Session.get("folderArr").toString());
		console.log(Session.get("fileArr").toString());
		console.log(selected);
		var newArr = Session.get("pathArr");
		if(event.target.innerHTML == 'Uploads'){
			Session.set("pathArr", []);
		}
		else{
			while(newArr[newArr.length - 1] != event.target.innerHTML){
				newArr.pop();
			}
			Session.set("pathArr", newArr);
		}
		listCall(arrayToPath(Session.get("pathArr"), "fileUrl"), function(){return null;});
	},
	'click #rmBtn': function() {
		if(Session.get("folderArr").some(function(name){return name === selected && name !== "";})){
			removeCall(arrayToPath(Session.get("pathArr"), "fileUrl"), selected, "folder");
			selected=null;
		}
		else {
			removeCall(arrayToPath(Session.get("pathArr"), "fileUrl"), selected, "file");
			selected=null;
		}
	}
});


>>>>>>> Stashed changes
Template.TopNav.events ({

	'click .logout': ()=> {
		Meteor.logout();
	}

});

//Main view helpers (Folders)
Template.Info.helpers ({

	files: function () {
<<<<<<< Updated upstream
		return Session.get("contentArr");
=======
		//Concatenate folder and file Arrays and exclude empty elements.
		var arr = Session.get("folderArr").concat(Session.get("fileArr")).filter(function(value){return value !== '';});
		//Trim the element name strings
		arr.forEach(function(part, index, theArray) {
		  theArray[index] = theArray[index].trim();
		});
		return arr;
	},
	//Get correct image icon for folder contents
	getImage: function(element) {
		if(Session.get("folderArr").some(function(name){return name.trim() === element;})){
			return "folder.png";
		}
		else{
		//regular expressions for common file endings
			switch (true) {
				case /.txt$/i.test(element):
					return "text.png";
				case /(.docx$|.doc$)/i.test(element):
					return "word.png";
				case /(.pptx$|.ppt$)/i.test(element):
					return "powerpoint.png";
				case /(.xlsx$|.csv$|.xls$)/i.test(element):
					return "excel.png";
				case /.pdf$/i.test(element):
					return "reader.png";
				case /(.html$|.xml$)/i.test(element):
					return "markup.png";
				case /(.js$|.jsx$|.java$|.scala$|.json$)/i.test(element):
					return "code.png";
				case /(.rar$|.zip$|.gz$)/i.test(element):
					return "archive.png";
				case /(.mp3$|.wma$|.wav$)/i.test(element):
					return "music.png";
				case /(.mp4$|.mov$|.mkv$)/i.test(element):
					return "video.png";
				case /.pre$/i.test(element):
					return "premiere.png";
				case /.psd$/i.test(element):
					return "photoshop.png";
				default:
					return "file.png";
			}
		}
>>>>>>> Stashed changes
	}

<<<<<<< Updated upstream
=======
Template.Info.events ({
	//Updates selected element
	'click .elementRow': function(event){
		selected = $(event.currentTarget).find('.elementName').html();
		$(event.currentTarget).addClass("active");
		$(event.currentTarget).siblings().removeClass("active");
	},
	//Updates pathArr and folderArr when user clicks folder name and
	'dblclick .elementRow': function(event){
		//If clicked element is a folder...
		if(Session.get("folderArr").some(function(name){return name.trim() === selected && name !== "";})){
			selected = null;
			var newArr = Session.get("pathArr");
			newArr.push($(event.currentTarget).find('.elementName').html());
			//List contents of new path and then set the new path as pathArr 	
			listCall(arrayToPath(newArr, "fileUrl"),function(){Session.set("pathArr", newArr);});
		}
		//If clicked element is a file...
		//TODO SOME ROUTES ARE NOT CREATED!
		else{
			var fileName = $(event.currentTarget).find('.elementName').html(); 
			Meteor.call("sendRoute", arrayToPath(Session.get("pathArr"), "routeUrl"), fileName, function(error, response){
					Router.go(encodeURI(arrayToPath(Session.get("pathArr"), "routeUrl") + '/' + fileName));
			});
		}
	}
});

Template.DirectoryModal.events({
	'submit .newFolder':function(event){
		var name = $('#dirName').val();
		createDirCall(arrayToPath(Session.get("pathArr"), "fileUrl"), name);
		$('#dirName').val("");

		//Prevents reload of page 
		return false;
	}
>>>>>>> Stashed changes
});
	

//Upload helpers
Template.upzone.helpers({

  myCallbacks: function() {
  	
    return {
<<<<<<< Updated upstream
        finished: function(index, fileInfo, context) {
        	listCall(Session.get("path"));
=======
    	formData: function() {
    		return {

    			id: this._id,
      			path: (arrayToPath(Session.get("pathArr"), "routeUrl") + '/')
    		}; 
    	},
        finished: function(index, fileInfo, context) {
        	listCall(arrayToPath(Session.get("pathArr"), "fileUrl"), function(){return null;});
>>>>>>> Stashed changes
        }
    };
  },

  specificFormData: function() {
    return {
      id: this._id,
      path: Session.get("path")
    };
  }

});

