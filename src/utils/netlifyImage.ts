export type NetlifyImageFit = "cover" | "contain";

export function netlifyImage(
  src: string,
  width: number,
  height?: number,
  options: {
    fit?: NetlifyImageFit;
    format?: "avif" | "webp" | "jpg";
    preserveAspectRatio?: boolean;
  } = {}
): string {
  if (!import.meta.env.NETLIFY) {
    return src;
  }

  const params = new URLSearchParams({
    url: src,
    w: String(width),
    fit: options.fit ?? "cover",
    fm: options.format ?? "avif",
  });

  if (height) {
    params.set("h", String(height));
  }

  if (options.preserveAspectRatio === false) {
    params.set("fit", "cover");
  }

  return `/.netlify/images?${params.toString()}`;
}
