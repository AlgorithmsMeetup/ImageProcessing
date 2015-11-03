# ImageProcessing
Filters, transformers, etc.

Commands
- `$ npm start`: runs whatever processors you've added to index.js's `processImage` function.
- `$ npm run clean`: deletes any PNG images in the images/out directory.

PNG structure:
- img.height in pixels
- img.width in pixels
- img.data a list of values, every 4 of which describe 1 pixel.

An example of a 4-pixel all-red image would be this:
```javascript
var img = {
  height: 2,
  width: 2,
  data: [
    255, 0, 0, 255,
    255, 0, 0, 255,
    255, 0, 0, 255,
    255, 0, 0, 255
  ]  
}
```
