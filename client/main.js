import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

//TODO: Wait for server callback before entering a directory

//Array which contains current subfolders
Session.set("folderArr", []);

//Array which contains files in current folder
Session.set("fileArr", []);

//Current path which is being viewed
Session.set("pathArr", []);

//Name of element, which is currently selected
var selected = null;

//Requests server to send folder contents. Populates folderArr with folder contents. refreshCallback is a function which can be called after asynchronous server call is completed.
function listCall(path, refreshCallback){

	Meteor.call("listContents", path, "d", function(error, result){
	  if(error){
	    console.log(error.reason);
	    return;
	  }
	  Session.set("folderArr", result.split('\n'));
	  Meteor.call("listContents", path, "f", function(error, result){
	  if(error){
	    console.log(error.reason);
	    return;
	  }
	  Session.set("fileArr", result.split('\n'));
	  refreshCallback();
	  });
	});
}

//Requests server to delete selected element
function removeCall(path, elementName){

	Meteor.call("removeElement", path, elementName, function(error, result){
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

function pathToArray(path){
	if(path !== ''){
		var arr = path.split('/');
		arr.shift();
		return arr;
	}
}

//Converts array to a path string
function arrayToPath(array){
	var pathString = '';
	if(array.length > 0){
		array.forEach( function(element, index) {
			pathString += '/' + element;
		});
	}
	
	return pathString;
}

//Client start-up methods
Meteor.startup(function() {
	//Get index of folder designated by path
	listCall(arrayToPath(Session.get("pathArr")), function(){return null;});

});

Template.body.helpers({
	getPath:function(){
		return Session.get("pathArr");
	}
});

Template.body.events({

	//Navigation bar logic
	'click #navItem': function(event) {
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
		listCall(arrayToPath(Session.get("pathArr")), function(){return null;});
	},
	'click #rmBtn': function() {
		removeCall(arrayToPath(Session.get("pathArr")), selected);
		selected=null;
	}
});


Template.TopNav.events ({
	//Logging out
	'click .logout': function() {
		Meteor.logout();
	}

});


Template.Info.helpers ({

	files: function () {
		//Concatenate folder and file Arrays and exclude empty elements.
		return Session.get("folderArr").concat(Session.get("fileArr")).filter(function(value){return value !== '';});
	},
	//Get correct image icon for folder contents
	getImage: function(element) {
		if(Session.get("folderArr").some(function(name){return name === element;})){
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
	}
});

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
		if(Session.get("folderArr").some(function(name){return name === $(event.currentTarget).find('.elementName').html() && name !== "";})){
			selected = null;
			var newArr = Session.get("pathArr");
			newArr.push($(event.currentTarget).find('.elementName').html());
			//List contents of new path and then set the new path as pathArr 	
			listCall(arrayToPath(newArr),function(){Session.set("pathArr", newArr);});
		}
		//If clicked element is a file...
		else{
			//call server to move requested file from upload location to public download staging folder
		}
	}
});

Template.DirectoryModal.events({
	'submit .newFolder':function(event){
		var name = $('#dirName').val();
		createDirCall(arrayToPath(Session.get("pathArr")), name);
		$('#dirName').val("");

		//Does not cause a reroute
		return false;
	}
});


//Upload helpers
Template.Upzone.helpers({

  myCallbacks: function() {
    return {
    	formData: function() {
    		return {
    			id: this._id,
      			path: arrayToPath(Session.get("pathArr"))+ '/'
    		}; 
    	},

        finished: function(index, fileInfo, context) {
        	listCall(arrayToPath(Session.get("pathArr")), function(){return null;});
        }
    };
  }
});

