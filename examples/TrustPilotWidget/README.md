# React Custom Widget in Typescript for TrustPilot widget

## Running the app

Run locally

```
npm i
npm run local
```

Run locally inside of happeo

```
npm i
npm run start
```

This will start the webserver and serve the js file from localhost:8080/bundle.js

## Build the app

`npm run build` - the build will be created in the /dist -folder

## Example businessUnitId and templateId
In the example the businessUnitId is the one from Happeo in Trustpilot.
The templateId is for Micro Review Count. Which is included in the free tier.

## Troubleshoot

### TemplateId 
Template id from TrustPilot are tied to your subscription. 
If you only have access to the free tier and try to use a templateId from a paid
tier you will just have a dummy page.

### Adblocker
Be careful of what your browser is blocking as it might prevent the widget from
loading properly.

