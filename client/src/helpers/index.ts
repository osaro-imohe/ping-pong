// eslint-disable-next-line max-len
export const selectRandomElementInArray = (array: any[]) => array[Math.floor(Math.random() * array.length)];
// eslint-disable-next-line no-promise-executor-return
export const delay = (numSecs: number) => new Promise((res) => setTimeout(res, numSecs * 1000));
