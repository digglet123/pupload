import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html'

//Array which contains current folders
Session.set( "contentArr", []);

//Current path which is being viewed
Session.set( "path", ''); //TODO implement structure to represent modular path

//Calls server-side to send desired folder (path) content as a string. 
function listCall(path){

	Meteor.call("listContents", path, function(error, result){
	  if(error){
	    console.log(error.reason);
	    return;
	  }
	  Session.set("contentArr", result.split('\n'));
	});

}

//Client start-up methods
Meteor.startup(function() {
	
	//Get index of folder designated by path
	listCall(Session.get("path"));

});

//Logging out
Template.TopNav.events ({

	'click .logout': ()=> {
		Meteor.logout();
	}

});

//Main view helpers (Folders)
Template.Info.helpers ({

	files: function () {
		return Session.get("contentArr");
	}

});


//Upload helpers
Template.upzone.helpers({

  myCallbacks: function() {
    return {
        finished: function(index, fileInfo, context) {
        	listCall(Session.get("path"));
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

