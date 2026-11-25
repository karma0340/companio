export interface ProcessedImageResult {
  dataUrl: string;
  fileName: string;
}

const MAX_RAW_IMAGE_BYTES = 12 * 1024 * 1024; // 12 MB raw upload cap before client resize

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string" && result.startsWith("data:")) {
        resolve(result);
      } else {
        reject(new Error("Unsupported image format."));
      }
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Validates and resizes/compresses an uploaded image file to JPEG data URL.
 */
export async function processAvatarUploadFile(
  file: File,
  maxDim: number = 800,
  quality: number = 0.85
): Promise<ProcessedImageResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file (JPG, PNG, or WebP).");
  }
  if (file.size > MAX_RAW_IMAGE_BYTES) {
    throw new Error("Image is too large (max 12 MB). Please choose a smaller photo.");
  }

  const rawDataUrl = await readFileAsDataUrl(file);

  const compressedDataUrl = await new Promise<string>((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(rawDataUrl);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = rawDataUrl;
  });

  return {
    dataUrl: compressedDataUrl,
    fileName: file.name || "profile-photo.jpg",
  };
}
