export const parseStringJSON = (string = "", defaultVal) => {
  if (!string || string?.length === 0) {
    return defaultVal;
  }
  try {
    return JSON.parse(string);
  } catch (_e) {
    return defaultVal;
  }
};

export const calculateAspectRatioFit = (
  srcWidth,
  srcHeight,
  maxWidth,
  maxHeight
) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
};

export const getImageSize = async (file, maxWidth, maxHeight) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      resolve(calculateAspectRatioFit(this.width, this.height, maxWidth, maxHeight));
      resolve(true);
    };
    img.onerror = function () {
      resolve(false);
    };
    img.src = file.uri;
  });
};
