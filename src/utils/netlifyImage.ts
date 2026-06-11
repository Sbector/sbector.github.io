export function netlifyImage(
  src: string,
  width: number,
  height?: number,
  options: { fit?: "cover" | "contain"; format?: "avif" | "webp" | "jpg" } = {}
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

  return `/.netlify/images?${params.toString()}`;
}
