const MAX_SIGNED_SHORT = 32767;

module.exports = (pSVG, pCallback) => {
  const lImg = document.createElement("img");

  lImg.src =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent('<!DOCTYPE svg [<!ENTITY nbsp "&#160;">]>'.concat(pSVG));
  lImg.addEventListener("load", function(pEvent) {
    const lCanvas = document.createElement("canvas");
    const lCanvasContext = lCanvas.getContext("2d");
    const lImage = pEvent.target;

    /*
     * When the passed image is too big for the browser to handle
     * return an error string
     *
     * See https://github.com/sverweij/mscgen_js/issues/248 for
     * an overview of the practical limits in various browsers and
     * pointers for further research.
     */
    if (lImage.width > MAX_SIGNED_SHORT || lImage.height > MAX_SIGNED_SHORT) {
      pCallback(null, "image-too-big");
    } else {
      lCanvas.width = lImage.width;
      lCanvas.height = lImage.height;

      lCanvasContext.drawImage(lImage, 0, 0);
      pCallback(lCanvas.toDataURL("image/png", 0.8));
    }
  });
};
