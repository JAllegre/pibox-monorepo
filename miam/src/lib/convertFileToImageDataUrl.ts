import { MAX_RECIPE_IMAGE_HEIGHT, MAX_RECIPE_IMAGE_WIDTH } from "./constants";

export default async function convertFileToImageDataUrl(
  file?: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(
        new Error(
          "convertFileToImageDataUrl/convertFileToImageDataUrl | Provided file is null"
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onload = function () {
      const img = document.createElement("img");
      img.onerror = function (error) {
        reject(error);
      };
      img.onload = function () {
        try {
          const canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error(
              "convertFileToImageDataUrl/convertFileToImageDataUrl | ctx is null"
            );
          }
          ctx.drawImage(img, 0, 0);

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_RECIPE_IMAGE_WIDTH) {
              height *= MAX_RECIPE_IMAGE_WIDTH / width;
              width = MAX_RECIPE_IMAGE_WIDTH;
            }
          } else {
            if (height > MAX_RECIPE_IMAGE_HEIGHT) {
              width *= MAX_RECIPE_IMAGE_HEIGHT / height;
              height = MAX_RECIPE_IMAGE_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error(
              "convertFileToImageDataUrl/convertFileToImageDataUrl | ctx is null"
            );
          }
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/png"));
          img.remove();
        } catch (error) {
          reject(error);
        }
      };
      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
