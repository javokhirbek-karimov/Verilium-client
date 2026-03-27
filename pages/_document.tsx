import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="index,follow" />
        <link rel="icon" type="image/png" href="/img/logo/logo.jpeg" />

        {/* SEO */}
        <meta
          name="keyword"
          content={
            "verilium, verilium.com, verilium perfume, verilium men perfume"
          }
        />
        <meta
          name={"description"}
          content={
            "Explore the world of perfumes, learn about authentic fragrances, and shop premium scents anytime in South Korea — only on Verilium. " +
            "Откройте для себя мир парфюмерии, изучайте оригинальные ароматы и покупайте премиальные духи в любое время в Южной Корее — только на Verilium. " +
            "향수의 세계를 탐험하고, 정품 향수에 대해 배우며, 대한민국 어디서나 언제든지 프리미엄 향수를 만나보세요 — Verilium에서만 가능합니다."
          }
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
