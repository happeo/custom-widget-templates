# Jira widget

Jira integration widget. Implements jql list functionality.

## Environment variables

Add your backend url to .env file.

## Backend
To run backend service 
`cd server && npm install`
`npm start`
The service should then be running on localhost port 8081.

#### create .env file and add following environment variables

### Deploying

The app is designed to run in CloudRun. To deploy this to CloudRun you should be familiar with that. To deploy a new version of this to the container registry, you can run `npm run deploy`. But before doing that, check the `package.json` script `deploy` and fill in your GCP project and CloudRun app name. Remember to add secrets and environment variables to your cloud run instance.


## Running the app

The app runs in localhost:8080 and is designed to be developed inside Happeo.

## Build the app

`npm run build` - the build will be created in the /dist -folder

## Run the app

`npm start` - This will start the webserver and serve the js file from localhost:8080/bundle.js
