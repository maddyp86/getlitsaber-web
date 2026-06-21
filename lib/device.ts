export function detectDeviceType(): string {
  const ua = navigator.userAgent.toLowerCase();
  // Tablet first: iPad (legacy UA) and Android tablets (android without "mobile")
  if (/ipad/.test(ua) || (/android/.test(ua) && !/mobile/.test(ua))) return "Tablet";
  if (/android|iphone|ipod/.test(ua)) return "Mobile";
  return "Desktop";
}