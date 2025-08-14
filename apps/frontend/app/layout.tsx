import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body className="min-h-screen bg-emerald-50 text-zinc-900">{children}</body></html>
  );
}


