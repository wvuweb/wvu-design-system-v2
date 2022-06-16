// Set custom fonts we're loading as variables for FontFaceObserver:
// https://github.com/bramstein/fontfaceobserver
var helveticaBlack = new FontFaceObserver('HelveticaNeueW01-97Blac', {
  'family': 'HelveticaNeueW01-97Blac',
  'weight': 'normal'
});

var helveticaLight = new FontFaceObserver('HelveticaNeueW01-45Ligh', {
  'family': 'HelveticaNeueW01-45Ligh',
  'weight': 'normal'
});

var helveticaRoman = new FontFaceObserver('HelveticaNeueW01-55Roma', {
  'family': 'HelveticaNeueW01-55Roma',
  'weight': 'normal'
});

var helveticaBold = new FontFaceObserver('Helvetica Neue LT W01_75 Bold', {
  'family': 'Helvetica Neue LT W01_75 Bold',
  'weight': 'normal'
});

var iowanRoman = new FontFaceObserver('IowanOldStyleW01-Roman', {
  'family': 'IowanOldStyleW01-Roman',
  'weight': 'normal'
});

var iowanItalic = new FontFaceObserver('IowanOldStyleW01-Italic1120392', {
  'family': 'IowanOldStyleW01-Italic1120392',
  'weight': 'normal'
});

var iowanBlack = new FontFaceObserver('IowanOldStyleW01-Black', {
  'family': 'IowanOldStyleW01-Black',
  'weight': 'normal'
});

var iowanBlackItalic = new FontFaceObserver('IowanOldStyleW01-BlackI', {
  'family': 'IowanOldStyleW01-BlackI',
  'weight': 'normal'
});

// Set a waiting period for FontFaceObserver to wait for the fonts to load before erroring out:
var ffoTimeout = 6000;

// This is the "base" font package. Just Helvetica Condensed Black & Light
Promise.all([
  helveticaBlack.load(null, ffoTimeout),
  helveticaLight.load(null, ffoTimeout)
]).then(function () {
  console.info('Helvetica Condensed Black & Light successfully loaded.');
  document.documentElement.className += ' base-fonts-loaded';
}).catch(function (err) {
  console.warn('Did not load Helvetica Condensed Black & Light:');
  console.info('FontFaceObserver font loading', err);
  document.documentElement.className += ' base-fonts-unavailable';
});

// This is the "expanded" font set.
// It checks for other weights of Helvetica & Iowan.
Promise.all([
  helveticaRoman.load(null, ffoTimeout),
  helveticaBold.load(null, ffoTimeout),
  iowanRoman.load(null, ffoTimeout),
  iowanItalic.load(null, ffoTimeout),
  iowanBlack.load(null, ffoTimeout),
  iowanBlackItalic.load(null, ffoTimeout)
]).then(function () {
  console.log('Expanded font package (Iowan, Helvetica Roman and Bold) successfully loaded.');
  document.documentElement.className += ' expanded-fonts-loaded';
}).catch(function (err) {
  console.log(''); // Insert blank space to separate messages visually.
  console.info('Did not load Iowan, Helvetica Roman and Bold. NOTE: This could be intentional.');
  console.info('FontFaceObserver font loading', err);
  document.documentElement.className += ' expanded-fonts-unavailable';
});
