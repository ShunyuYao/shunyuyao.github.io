export default function AnimatedSignature({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <video
      src="/videos/signature.webm"
      autoPlay
      loop
      muted
      playsInline
      className={className}
      style={{ mixBlendMode: "screen" }}
    />
  );
}
