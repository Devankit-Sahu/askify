export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center relative py-12">
      {children}
    </div>
  );
}
