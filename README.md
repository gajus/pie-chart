# Simple Pie Chart

Simple function to generate Pie Charts ([demo](https://dev.anuary.com/858b33b7-bd66-507b-a9f1-533e4de79ba3/)) utilisiing [d3.js](http://d3js.org/). This function is part of the http://xhprof.io/ project. It is able to handle datasets of arbitrary size. It has several options that allow for customisation, such as the label margin, circle radius and visibility of the percentage data (refer to the source code).

![screenshot](https://raw.github.com/gajus/pie-chart/master/screenshot.png)

## Browser Support

FireFox cannot read the `clientWidth` of the SVG and the SVG itself does not expand to fill the container. Therefore, every Pie Chart SVG must be wrapped in a `div` container. The SVG element must have 100% width and height.

## License & Notes

The BSD License - Copyright (c) 2012 [Gajus Kuizinas](http://anuary.com/gajus).