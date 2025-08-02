export function getDeviceInfo() {
  const ua = navigator.userAgent;

  let device = "Unknown";
  let os = "Unknown";
  let browser = "Unknown";

  if (/windows phone/i.test(ua)) os = "Windows Phone";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/macintosh/i.test(ua)) os = "Mac";
  else if (/windows nt/i.test(ua)) os = "Windows";
  else if (/linux/i.test(ua)) os = "Linux";

  if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opr\//i.test(ua)) browser = "Opera";

  if (/mobi/i.test(ua)) device = "Mobile";
  else if (/tablet|ipad/i.test(ua)) device = "Tablet";
  else device = "Desktop";

  return { device, os, browser };
}