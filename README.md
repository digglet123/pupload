# pupload

* This is a work-in-progress "dropbox-clone" meteor application for uploading files onto the server where it is deployed.

## Instructions

1. Install Meteor:
   * curl https://install.meteor.com/ | sh
2. Clone the git repository:
   * git clone https://github.com/nurmiggo/pupload.git
3. Navigate to application root folder:
   * cd pupload
4. Install dependencies
   * meteor npm install
5. Build the app:
   * meteor
6. Test the app:
   * Go to http://localhost:3000 with your browser
7. Temporary files and uploaded files go to .tmp and .uploads respectively inside the app root folder. 

## Windows specific instructions

1. After cloning switch to windows branch
   * git checkout windows
2. Manually set temp and upload paths in settings.json

3. Run the application with the command
   * meteor --settings settings.json
   
