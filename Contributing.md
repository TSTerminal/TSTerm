# Contribution Guidelines and Notes

## Basic Architecture

There are a few things that are unlikely to change about the implementation:

- The Rendering of Text and Graphics is done the HTML5 Canvas
- The code is written in TypeScript.  That's the brand of this project, TSTerm.  The TS does not stand for popular term for unchewable excreta. 
- The Communication Protocol is WebSockets with a very simple and complete containment of the underlying TCPIP protocol.  In the case of 3270 this is the TN3270E protocol.
- There are no dependencies, and there will never be many  Maybe this will include or rely upon a nice terminal font or two, but this project renders a terminal.  Hooks may be provided for customization points, for example allowing a user to put custom context menus on top of the terminal rendering, but such menus would come from a particular web toolkit and design library.  TSTerm is neutral about how Web UI is done aside from communicating with the server, rendering the screen, and handling keyboard and mouse events.
- There will be ro reliance on complex web UI build configurations in order to test the terminal itself.

## Extensions

Many features that are desired in terminals are often things like font configuration, colors, languages, character sets, etc.  These features are not implemented completely within the terminal.   More specifically the rendering is handled in the terminal, but the means of configuring the feature and storing the configuration is done in a component that uses TSTerm.  One example can be found at:

  https://github.com/JoeNemo/tsterm4zowe/
  
This project already includes some configuration features, but could use a lot more.  
