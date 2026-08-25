// Client-side file helpers: reading uploads and rasterizing SVG logos so they
// can be sent to the vision model as a real image, exactly like a PNG/JPG.

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/** Rasterizes an SVG data URL onto a white-backed canvas and returns a PNG data URL. */
export function rasterizeSvgDataUrlToPng(svgDataUrl: string, size = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      const scale = Math.min(size / (img.width || size), size / (img.height || size));
      const w = (img.width || size) * scale;
      const h = (img.height || size) * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Could not render SVG"));
    img.src = svgDataUrl;
  });
}

export function isValidHex(value: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(value.trim());
}

export function normalizeHex(value: string): string {
  const v = value.trim();
  return v.startsWith("#") ? v.toUpperCase() : `#${v.toUpperCase()}`;
}
