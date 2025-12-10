"use client";

import Head from "next/head";

export default function PWAHead() {
  return (
    <Head>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <link rel="apple-touch-icon" href="/icons/icon-192.png" />
    </Head>
  );
}
