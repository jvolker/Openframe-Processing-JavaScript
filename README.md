
# Openframe Processing JavaScript extension

This extension runs Processing JavaScript sketches on a [Raspberry Pi](https://www.raspberrypi.org/) within [Openframe](http://openframe.io)
> an open source platform for artists, curators and art enthusiasts to share, discover and display digital art. 

When artwork of Processing Javascript format is selected in the Openframe web app, this extension takes care of downloading the artwork and loading it in the Chromium browser on the Raspberry Pi.

It's mainly intended to work with [OpenProcessing.org](http://openprocessing.org). OpenProcessing.org hosts sketches based on [p5.js](https://p5js.org/) and [Processing.js](http://processingjs.org/). They are a JavaScript-based interpretation and port of [Processing](http://processing.org) running in a browser. Support for self-hosted [p5.js](https://p5js.org/) code/sketches might be added in the future.

## Installation

### Prerequisites

Follow the official guide https://docs.openframe.io/#getting-started to install Openframe. 

This extension requires Openframe `v0.4.12` or higher.

### Instructions

Then, enter via the command line: `openframe -i openframe-processing-javascript`

## Artwork

### How to upload artwork?

Follow the [adding artwork section](https://docs.openframe.io/#adding-artwork) of the Openframe docs and use `openframe-processing-javascript` as artwork format.

Enter the URL to the sketch on OpenProcessing.org into the field `URL where the artwork is hosted`.

### Fullscreen

The extension loads all sketches in fullscreen by default. For some sketches, this might not be useful. To disable fullscreen, add the following to the `options` property of the artwork in the database: 

```
{
  "fullscreen": false
}
```

The Openframe web app currently doesn't support this. Alternative ways to do this are [described in the Openframe docs](https://docs.openframe.io/#per-artwork-settings).

### Sketches not hosted on Openprocessing.org

Openprocessing.org provides an excellent environment to develop, test and host sketches using different versions of [p5.js](https://p5js.org/) (and [Processing.js](http://processingjs.org/), which itself has been archived in Dec 2018).

That said, it is possible to run sketches from other sources with a little effort. If for some reason you like to run browser-based Processing sketches not hosted on [OpenProcessing](http://openprocessing.org) this might help you:
1. Have a look at the [HTML template of this extension](https://github.com/jvolker/Openframe-Processing-JavaScript/blob/master/scripts/index.html.tpl) is using to run sketches.
2. Copy and modify it to your needs.
3. Run it using the Openframe-Website extension which is installed by default.

### Archived sketches

Openprocessing.org has been around since 2008. In those early days of Processing, there were no JavaScript-based flavours of Processing available. That’s why these older sketches are based on the original version of Processing written in Java. As the underlying technology is already provided by the [Openframe-Processing extension](https://github.com/jvolker/Openframe-Processing), it might receive proper support for these archived sketches in the future.

## Todo

- cover/fit, force fullscreen, scale 
- notice for archived sketches
- support for p5.js sketches not hosted on openprocessing.org 
- add support for emojis: https://www.openprocessing.org/sketch/771734
- hide cursor at all times (even when the mouse is moved)
- add unit tests

## Thanks

Thanks to Jonathan Wohl and Isaac Bertran for initiating Openframe.
Thanks to Sinan of [OpenProcessing.org](http://openprocessing.org) for support during the development of this extension and updates on the Openprocessing API.

*Author*
[Jeremias Volker](http://www.jeremiasvolker.com) | Twitter:  [@jeremiasvolker](http://twitter.com/jeremiasvolker)