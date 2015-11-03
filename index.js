function processImage (img) {
  // img.height, .width, .data [r,g,b,a,r,g,b,a...]
  copy(img)
}

function copy (img) {
  return img;
}

function transparent (img) {
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var index = (img.width * y + x) * 4;
      img.data[index+3] = img.data[index+3] / 2;
    }
  }
  return img;
}

function tintRed (img) {
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var index = (img.width * y + x) * 4;
      img.data[index+0] = img.data[index+0];
      img.data[index+1] = 0;
      img.data[index+2] = 0;
    }
  }
  return img;
}

function greyscale (img) {
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var index = (img.width * y + x) * 4;
      var average = (img.data[index+0] + img.data[index+1] + img.data[index+2]) / 3;
      img.data[index+0] = average;
      img.data[index+1] = average;
      img.data[index+2] = average;
    }
  }
  return img;
}

function invertColors (img) {
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var index = (img.width * y + x) * 4;
      img.data[index+0] = 255 - img.data[index+0];
      img.data[index+1] = 255 - img.data[index+1];
      img.data[index+2] = 255 - img.data[index+2];
    }
  }
  return img;
}

function flipVertical (img) {
  for (var y = 0; y < img.height/2; y++) {
    for (var x = 0; x < img.width; x++) {
      var fromIndex = (img.width * y + x) * 4;
      var toIndex = (img.width * (img.width - y) + x) * 4;
      var tmpR = img.data[fromIndex+0];
      var tmpG = img.data[fromIndex+1];
      var tmpB = img.data[fromIndex+2];
      var tmpA = img.data[fromIndex+3];

      img.data[fromIndex+0] = img.data[toIndex+0];
      img.data[fromIndex+1] = img.data[toIndex+1];
      img.data[fromIndex+2] = img.data[toIndex+2];
      img.data[fromIndex+3] = img.data[toIndex+3];

      img.data[toIndex+0] = tmpR;
      img.data[toIndex+1] = tmpG;
      img.data[toIndex+2] = tmpB;
      img.data[toIndex+3] = tmpA;
    }
  }
  return img;
}

function flipHorizontal (img) {
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width/2; x++) {
      var fromIndex = (img.width * y + x) * 4;
      var toIndex = (img.width * y + (img.width - x)) * 4;
      var tmpR = img.data[fromIndex+0];
      var tmpG = img.data[fromIndex+1];
      var tmpB = img.data[fromIndex+2];
      var tmpA = img.data[fromIndex+3];

      img.data[fromIndex+0] = img.data[toIndex+0];
      img.data[fromIndex+1] = img.data[toIndex+1];
      img.data[fromIndex+2] = img.data[toIndex+2];
      img.data[fromIndex+3] = img.data[toIndex+3];

      img.data[toIndex+0] = tmpR;
      img.data[toIndex+1] = tmpG;
      img.data[toIndex+2] = tmpB;
      img.data[toIndex+3] = tmpA;
    }
  }
  return img;
}

function rotate90 (img) {
  var tempData = {}
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      for (var i = 0; i < 4; i++) {
        tempData[(img.width*y+x)*4+i] = img.data[(img.width*y+x)*4+i];
      }
    }
  }

  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var pixelIndex = (img.width * y + x)
      var rotatedIndex = (img.height * x + (img.width - 1 - y))

      var fromIndex = pixelIndex * 4;
      var toIndex = rotatedIndex * 4;

      img.data[toIndex+0] = tempData[fromIndex+0]
      img.data[toIndex+1] = tempData[fromIndex+1]
      img.data[toIndex+2] = tempData[fromIndex+2]
      img.data[toIndex+3] = tempData[fromIndex+3]
    }
  }
  return img;
}

function blur (img, blurFactor) {
  rotate90(rotate90(rotate90(
    blurHorizontal(
      rotate90(
        blurHorizontal(img, blurFactor)
      ), blurFactor
    )
  )))

  function add (sum, val) {
    return sum + val;
  }
  function red (pixel) {
    return pixel.r
  }
  function green (pixel) {
    return pixel.g
  }
  function blue (pixel) {
    return pixel.b
  }
  function alpha (pixel) {
    return pixel.a
  }
  function average (pixels, getr) {
    console.log({pixels, mapd: pixels.map(getr), reduced: pixels.map(getr).reduce(add), reduced2: pixels.map(getr).reduce(add, 0)})
    return Math.floor(pixels.map(getr).reduce(add, 0)/blurFactor)
  }

  function blurHorizontal (img, blurFactor) {
    for (var y = 0; y < img.height; y++) {
      for (var x = 0; x < img.width; x = x + blurFactor) {
        var i = (img.width * y + x)*4 // pixelIndex
        var pixels = [];
        for (var j = 0; j < blurFactor; j++) {
          pixels.push({
            r: img.data[i+j+0],
            g: img.data[i+j+1],
            b: img.data[i+j+2],
            a: img.data[i+j+3]
          })
        }
        var averageR = average(pixels, red);
        var averageG = average(pixels, green);
        var averageB = average(pixels, blue);
        var averageA = average(pixels, alpha);

        for (var k = 0; k < blurFactor; k++) {
          console.log('pixelGroup',i+k,'r',img.data[i+k+0],'g',img.data[i+k+1],'b',img.data[i+k+2],'a',img.data[i+k+3], '->', 'r',averageR,'g',averageG,'b',averageB,'a',averageA);
          img.data[i+k+0] = averageR;
          img.data[i+k+1] = averageG;
          img.data[i+k+2] = averageB;
          img.data[i+k+3] = averageA;
        }
      }
    }
    return img;
  }
  return img;
}




// DON'T MESS WITH WHAT'S BELOW

var fs = require('fs')
var path = require('path')
Png = require('node-png').PNG;

var inputFilePath = path.join(__dirname,'images','rainbowSheep.png')
var outputFilePath = path.join(__dirname,'images','out',Date.now()+'.png')

fs.createReadStream(inputFilePath)
.pipe(new Png({
  filterType: 4
}))
.on('parsed', function() {
  processImage(this)
  this.pack().pipe(fs.createWriteStream(outputFilePath));
});
