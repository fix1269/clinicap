import type { Attachment } from "./types";
import { newUid } from "./defaults";

const MAX_IMAGE_DIM = 256;
const IMAGE_QUALITY = 0.7;
const MAX_FILE_BYTES = 1_500_000;

export function fileToCompressedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("الملف ليس صورة"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("تعذر قراءة الملف"));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > MAX_IMAGE_DIM) { height = (height * MAX_IMAGE_DIM) / width; width = MAX_IMAGE_DIM; }
        } else {
          if (height > MAX_IMAGE_DIM) { width = (width * MAX_IMAGE_DIM) / height; height = MAX_IMAGE_DIM; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(src); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
      };
      img.onerror = () => reject(new Error("تعذر معالجة الصورة"));
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error("حجم الملف كبير جداً (الحد الأقصى 1.5 ميجابايت)"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("تعذر قراءة الملف"));
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}

export async function filesToAttachments(files: FileList): Promise<Attachment[]> {
  const out: Attachment[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    try {
      const dataUrl = await fileToDataUrl(f);
      out.push({ id: newUid(), name: f.name, type: f.type, dataUrl });
    } catch { /* skip */ }
  }
  return out;
}
