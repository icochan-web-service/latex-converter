export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "かんたんTeX",
    "url": "https://latex.viztechlab.com",
    "description": "画像・PDF・WordをLaTeXコードに変換。日本語・数式混在対応のオンラインツール。月10枚まで無料。",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "inLanguage": "ja",
    "offers": [
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "JPY",
        "description": "Freeプラン：月10枚まで無料"
      },
      {
        "@type": "Offer",
        "price": "500",
        "priceCurrency": "JPY",
        "description": "Basicプラン：月500枚・月額¥500"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
