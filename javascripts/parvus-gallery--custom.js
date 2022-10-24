'use strict';

/**
 * Setting up the Parvus gallery:
 * https://github.com/deoostfrees/Parvus
*/

/* global Parvus */

const prvs = new Parvus({
  selector: '.js-parvus-lightbox',
  fileTypes: /.*/i // NOTE: Required for URLs that don't end in an image file type extension.
});
