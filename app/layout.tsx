import './globals.css';


export const metadata = {
  title: 'Flatirons Products',
  description: 'Upload and view product data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}