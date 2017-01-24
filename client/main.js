import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

//TODO: Escape spaces and parenthases in file names - Messes with remove function

//Array which contains current folder contents (Folders and files)
Session.set("contentArr", []);

//Current path which is being viewed
Session.set("pathArr", []);

//Name of element, which is currently selected
var selected = '';

//Requests server to send folder contents. Populates contentArr with folder contents 
function listCall(path){

	Meteor.call("listContents", path, function(error, result){
	  if(error){
	    console.log(error.reason);
	    return;
	  }
	  Session.set("contentArr", result.split('\n'));

	});

}

//Requests server to delete selected element
function removeCall(path, elementName){

	Meteor.call("removeElement", path, elementName, function(error){
		if(error){
			console.log(error.reason);
			return;
		}
		listCall(path);
	});

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
	listCall(arrayToPath(Session.get("pathArr")));

});

Template.body.helpers({
	getPath:function(){
		return Session.get("pathArr");
	}
});

Template.body.events({
	'click #navItem': function(event) {
		var newArr = Session.get("pathArr");
		if(event.target.innerHTML == 'uploads'){
			Session.set("pathArr", []);
		}
		else{
			while(newArr[newArr.length - 1] != event.target.innerHTML){
				newArr.pop();
			}
			Session.set("pathArr", newArr);
		}
		listCall(arrayToPath(Session.get("pathArr")));
	},
	'click #rmBtn': function() {
		removeCall(arrayToPath(Session.get("pathArr")), selected);
	}
});


//Logging out
Template.TopNav.events ({

	'click .logout': function() {
		Meteor.logout();
	}

});

//Main view helpers (Folders)
Template.Info.helpers ({

	files: function () {
		return Session.get("contentArr");
	}
});

//TODO Exclude files somehow
Template.Info.events ({
	//Updates selected element
	'click #elementName': function(event){
		selected = event.target.innerHTML;
		$(event.target.parentElement).addClass("active");
		$(event.target.parentElement).siblings().removeClass("active");
	},
	//Updates pathArr and contentArr when user clicks folder name and
	'dblclick #elementName': function(event){
		if(Session.get("contentArr").some(function(name){return name === event.target.innerHTML && name !== "";})){
			console.log(Session.get("contentArr"));
			var newArr = Session.get("pathArr");
			newArr.push(event.target.innerHTML);
			Session.set("pathArr", newArr);
			listCall(arrayToPath(Session.get("pathArr")));
		}
	},
	'click #rmBtn': function(event){
		console.log(event.target.parentElement);
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
        	listCall(arrayToPath(Session.get("pathArr")));
        }
    };
  }

});

