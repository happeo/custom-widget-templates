# Happeo Youtube Channel App

## Youtube App

This repository contains example implementation on the channel app. The app enables to insert Youtube
App as an attachment to Post.

## Usage flows

### App select

1. User selects Youtube App from the Apps menu
2. Youtube Widget opens in Edit Mode
3. User inputs Youtube URL
4. Preview of the video is shown
5. User clicks Add to Post button

Result:
Attachment is created

## Trigger by Youtube URL

Prerequisite:
User has set Regex pattern to match Youtube Url to App entry in Happeo Admin

1. User inserts Youtube URL to post
2. Widget is triggered into the background for calculation

Result success:
Attachment is created successfully in to post edit.

Result failed scenario:
Attachment is created without configuration.
The user is able to edit and finish configuration in modal.

## Trigger attribute

In case the app is triggered by matched Regexp. Matched input is forwarded to Custom Widget.
Custom Widget can react accordingly to the triggered input.

```
// index.tsx

const trigger = this.getAttribute("trigger") || "";

<YoutubeWidget
  id={uniqueId}
  editMode={mode === "edit"}
  location={location}
  trigger={trigger}
/>
```

## Required properties for creating Post attachment

Post attachment requires following properties to be in place.

Example of Youtube attachment.

```
const settings = {
  title: data?.data?.title || "",
  description: data?.data?.description || "",
  url: `https://www.youtube.com/watch?v=${videoId}`,
  thumbnail: {
    url: data.data.image,
  },
}

// Widget Edit modal is closed and Post Attachment is created
widgetApi.setSettings(settings);
```
