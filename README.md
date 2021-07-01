# Happeo Custom Widget templates

Templates to start building custom widgets in Happeo.

This repository contains starting code for pure web component -widget and React widget. You can also find example implementations under the examples folder.

More details on how to run the code can be found in the folders of the different widget types.

## Getting started

### Creating your own Custom Widget

1. You first need to sign in to Happeo as an administrator and create new custom widget.
2. From the custom widget, select Web Component, give it a name and copy the generated `slug`.
3. Then you can save the widget and it will be created and is by default in **DEVELOPMENT** -mode.
4. Check the instructions below: "Running locally", "Running inside Happeo" && "Testing built code"

### Running locally

Start by cloning this Repository and using the technology you want to use. We currently offer 2 templates, VanillaJS and React.

#### VanillaJS

TODO: Finalise this

#### React

The react template for the widget sits very nicely inside Happeo. Since we use React in our frontend, it also shares bunch of libraries with our main app, but you can of course `npm install` whatever libraries you want to your widget.

Start by opening the React -folder, opening the `index.js` -file and replace the `"my-widget-slug"` with the `slug` you got from step 2.

Running `npm install && npm start`. That will start the dev server and serve the bundle.js -file from localhost:8080/bundle.js.

Note that this will only serve the JS -file and no html is being served. So next we need to run this inside Happeo.

### Running inside Happeo

Now that you have your custom widget created and it is in **DEVELOPMENT** -mode, you can add it to Pages. Note that the widget is only visible to administrators when in **DEVELOPMENT** and **TESTING** -modes.

1. Create a new page (or edit a new one)
2. Click to add new widget
3. Select your widget on the list (it has "IN DEVELOPMENT" -tag next to it)
4. That's it. You are now seeing your local widget inside Happeo.

### Testing build code

Once you have your custom widget created in the admin panel and you have your code, you can analyse the code in the admin panel. To do that:

1. build the code bundle `npm run build`
2. Open admin panel, custom widgets and your custom widget
3. Upload your code in the "Upload code" -section
4. Scroll down to analysis to see if the widget runs successfully

### Using Widget SDK

For advanced usage of widgets, please refer to [@happeo/widget-sdk](https://github.com/happeo/widgets-sdk).

## Props received by the Web Component

When the web component is rendered inside Happeo, we inject the following properties to it. You can access more data through our [@happeo/widget-sdk](https://github.com/happeo/widgets-sdk), and you can check what's available from the readme.

| Prop       |                                                                                           Description                                                                                            |
| ---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `widgetId` |                                                                                 This is the widget's unique id.                                                                                  |
| `uniqueId` |                                                     This is the widget **instance's** unique id. Use this to initiate the @happeo/widget-sdk                                                     |
| `editMode` | This indicates if the widget is displayed in edit or view -mode. Consider this when developing widgets for pages, since you most likely don't want page viewers to see all the editing controls. |
