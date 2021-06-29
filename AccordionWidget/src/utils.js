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

export const divideDataIntoRows = (data = []) =>
  data.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
