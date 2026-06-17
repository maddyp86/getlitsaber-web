export function detectDeviceType(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (/android|iphone|ipod/.test(ua)) return "Mobile";
  if (/ipad|android(?!.*?mobile)/.test(ua)) return "Tablet";
  return "Desktop";
}
