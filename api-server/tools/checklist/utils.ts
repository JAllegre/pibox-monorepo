export function handleResult(successMessage: string, resolve?: () => void) {
  return function (err: Error | null) {
    if (err) {
      throw err;
    }
    if (resolve) {
      resolve();
    }
    console.log(successMessage);
  };
}
