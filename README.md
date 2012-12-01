# Simple Pie Chart

This is a helper function that utilises [d3.js](http://d3js.org/) to create pie charts ([demonstration](https://dev.anuary.com/858b33b7-bd66-507b-a9f1-533e4de79ba3/)).

![screenshot](https://raw.github.com/gajus/pie-chart/master/screenshot.png)

## Browser Support

FireFox cannot read the `clientWidth` of the SVG and the SVG itself does not expand to fill the container. Therefore, every Pie Chart SVG must be wrapped in a `div` container. The SVG element must have 100% width and height.

## Roadmap

* No known bugs.

## License & Notes

The BSD License - Copyright (c) 2012 [Gajus Kuizinas](http://anuary.com/gajus).