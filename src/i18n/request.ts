
// import { cookies } from "next/headers";
// import { getRequestConfig } from "next-intl/server";

// export default getRequestConfig(async () => {
//     const cookieStore = cookies();
//     const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

//     return {
//         locale,
//         messages: (await import(`../messages/${locale}.json`)).default,
//     };
// });

import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
    const cookieStore = await cookies(); // ✅ FIX: await is required in Next 16
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
