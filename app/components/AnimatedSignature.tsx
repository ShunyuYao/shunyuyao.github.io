import Image from "next/image";

export default function AnimatedSignature({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <Image
      src="/images/signature_v1.png"
      alt="Shunyu Yao signature"
      width={200}
      height={200}
      className={className}
      priority
    />
  );
}
