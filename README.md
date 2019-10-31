# Openframe Processing JavaScript extension

This extension runs interactive Processing sketches with JavaScript flavour on a [Raspberry Pi](https://www.raspberrypi.org/) within [Openframe](http://openframe.io) – "an open source platform for artists, curators and art enthusiasts to share, discover and display digital art". 

This extension works with [p5.js](https://p5js.org/) and [Processing.js](http://processingjs.org/) sketches which are a JavaScript-based interpretation and port of [Processing](http://processing.org) running in a browser. When JavaScript flavoured Processing artwork is selected in the Openframe web app, the artwork gets loaded in Chromium browser on the Raspberry Pi.

This extension was built to support sketches on [OpenProcessing](http://openprocessing.org). Support is given for any JavaScript based Processing sketch on the platform. You can simply use the Openframe URL to load the artwork. For archived sketches of OpenProcessing (based on Java, not JavaScript) please have a look at https://github.com/jvolker/Openframe-Processing which might add support for those in the furture.

## Installation

### Prerequisites

Follow this guide: http://docs.openframe.io/frame-setup-guide/#4-extensions

### Instructions

Then, enter via the command line: `openframe -i openframe-processing-javascript`

## Artwork

### How to upload artwork?

First, follow the Openframe guide on how to set up an Openframe and to display artwork: http://docs.openframe.io/frame-setup-guide/

Then, in the [web app](https://openframe.io/stream)  
1. Click `Add Artwork`
2. Make sure you give your artwork a title 
3. Use `openframe-processing-javascript` as artwork format
4. Enter the URL to your artwork into the field `URL where the artwork is hosted`. So far it supports URLs to JavaScript based sketches of the Openprocessing platform.
5. Optionally enter a URL to a preview image of the sketch which is especially useful if you like to publish your artwork.
6. Select the artwork by clicking the `push to frame` button.


### Fullscreen

The extension loads all sketches in fullscreen by default. For some sketches this might not be useful. To disable fullscreen, add the following to the `options` property of the artwork in the database: 

```
{
  "fullscreen": false
}
```

The Openframe web app currently doesn't support this. But it's possible with the [API explorer](https://api.openframe.io/explorer/).

### Where to host artwork?

Currently, you have to upload your artwork to a publicly reachable webspace. If you don't have a webspace/server you could, as one out of many options, try Dropbox. Once it's uploaded to Dropbox, use the `Copy Dropbox Link`. You will end up with a URL like this `https://www.dropbox.com/s/vb17ehsdfqp2bjd/290317.jpg?dl=0`. Change the 0 at the end to 1 like this `https://www.dropbox.com/s/vb17ehsdfqp2bjd/290317.jpg?dl=1`, and you will be able to use the URL for Openframe.

## Todo

- support for p5.js and processing.js sketches not hosted on openprocessing.org 
- fullscreen
- hide cursor at all times (even when the mouse is moved)
- add unit tests

## Thanks

Thanks to Jonathan Wohl and Isaac Bertran for this amazing project

*Author*
[Jeremias Volker](http://www.jeremiasvolker.com)  
Twitter (@jeremiasvolker)(http://twitter.com/jeremiasvolker)