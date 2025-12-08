import {cookies} from "next/headers";
import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async () => {
  const localeCookie = (await cookies()).get("locale");
  const locale = localeCookie?.value || "en"; // default language is English

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
