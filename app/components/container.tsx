export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl p-8 sm:p-20">
      {children}
    </div>
  );
}
