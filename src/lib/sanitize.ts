import xss from "xss";

export function sanitizeValue(value: any): any {
  if (typeof value === "string") {
    return xss(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    const cleanObj: any = {};
    for (const key of Object.keys(value)) {
      cleanObj[key] = sanitizeValue(value[key]);
    }
    return cleanObj;
  }

  return value;
}
