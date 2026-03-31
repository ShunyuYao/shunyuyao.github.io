import Image from "next/image";

export default function AnimatedSignature({
  className = "w-full h-auto",
  lang = "zh",
}: {
  className?: string;
  lang?: "zh" | "en";
}) {
  const src = lang === "en" ? "/images/signature_v2_eng.png" : "/images/signature_v2_chn.png";

  return (
    <Image
      src={src}
      alt="Shunyu Yao signature"
      width={400}
      height={400}
      className={`${className} ${lang === "en" ? "translate-x-5" : ""}`}
      priority
    />
  );
}
