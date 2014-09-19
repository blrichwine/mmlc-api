// A routine that node.js can invoke to convert SVG text to a PNG data URI.

var exec = require('child_process').exec;

// The cartmanSvg variable is just a sample of SVG text.  It should be deleted.
var cartmanSvg =
"<svg viewBox='0 0 104 97' xmlns='http://www.w3.org/2000/svg'>" +
"  <path d='M14,85l3,9h72c0,0,5-9,4-10c-2-2-79,0-79,1' fill='#7C4E32'/>" +
"  <path d='M19,47c0,0-9,7-13,14c-5,6,3,7,3,7l1,14c0,0,10,8,23,8c14,0,26,1,28,0c2-1,9-2,9-4c1-1,27,1,27-9c0-10,7-20-11-29c-17-9-67-1-67-1' fill='#E30000'/>" +
"  <path d='M17,32c-3,48,80,43,71-3 l-35-15' fill='#FFE1C4'/>" +
"  <path d='M17,32c9-36,61-32,71-3c-20-9-40-9-71,3' fill='#8ED8F8'/>" +
"  <path d='M54,35a10 8 60 1 1 0,0.1zM37,38a10 8 -60 1 1 0,0.1z' fill='#FFF'/>" +
"  <path d='M41,6c1-1,4-3,8-3c3-0,9-1,14,3l-1,2h-2h-2c0,0-3,1-5,0c-2-1-1-1-1-1l-3,1l-2-1h-1c0,0-1,2-3,2c0,0-2-1-2-3M17,34l0-2c0,0,35-20,71-3v2c0,0-35-17-71,3M5,62c3-2,5-2,8,0c3,2,13,6,8,11c-2,2-6,0-8,0c-1,1-4,2-6,1c-4-3-6-8-2-12M99,59c0,0-9-2-11,4l-3,5c0,1-2,3,3,3c5,0,5,2,7,2c3,0,7-1,7-4c0-4-1-11-3-10' fill='#FFF200'/>" +
"  <path d='M56,78v1M55,69v1M55,87v1' stroke='#000' stroke-linecap='round'/>" +
"  <path d='M60,36a1 1 0 1 1 0-0.1M49,36a1 1 0 1 1 0-0.1M57,55a2 3 0 1 1 0-0.1M12,94c0,0,20-4,42,0c0,0,27-4,39,0z'/>" +
"  <path d='M50,59c0,0,4,3,10,0M56,66l2,12l-2,12M25,50c0,0,10,12,23,12c13,0,24,0,35-15' fill='none' stroke='#000' stroke-width='0.5'/>" +
"</svg>";

var svgToPngDataUri = function(svgString, callback) {
  // The path to where ImageMagick is installed.
  var magick = "/Users/chrisco/node-js-syscall/ImageMagick-6.8.9";

  // Make a system call to ImageMagick's "convert" utility, passing SVG to stdin
  // and writing PNG bytes to stdout.
  var convert = exec(
      // NOTES:
      // - It's not clear (yet) how to achieve a specific image size.
      // - It can be tricky because the SVG sometimes contains "width" and
      //   "height" parameters that control the output size.
      // - But to render most vector graphics including SVG, you probably want
      //   to set the DPI (dots-per-inch) which is specified with the
      //   "-density" flag.  E.g.,
      //      convert -density 600 svg:- png:-
      //   for 600 dpi.  Try it!
      // magick + "/bin/convert svg:- png:-",
      "convert svg:- png:-",
      {
        "env" : {
          "MAGICK_HOME": magick,
          "DYLD_LIBRARY_PATH": magick + "/lib"
        }
      },
      function (error, stdout, stderr) {
        var pngBytesBase64 = new Buffer(stdout, 'binary').toString('base64');
        var dataUri = 'data:image/png;base64,' + pngBytesBase64;
        callback(dataUri);

        // The rest of the routine is for debugging.  It can be deleted.
        console.log('<p>stderror: ' + stderr);
        if (error !== null) {
          console.log('<p>exec error: ' + error);
        } else {
          console.log('<p>it worked!');
        }
      });

  // Make sure stdout is interpreted as binary data and the SVG is treated as a
  // utf-8 string.
  convert.stdout.setEncoding('binary');
  convert.stdin.setEncoding('utf-8');

  // Pass the SVG text to the process.  It will invoke callback asynchronously.
  convert.stdin.write(svgString);
  convert.stdin.end();
}

// An example call to the routine.
svgToPngDataUri(cartmanSvg, function(dataUri) {
  console.log('<img src="' + dataUri + '">');
});