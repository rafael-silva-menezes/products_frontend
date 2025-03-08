import './globals.css';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'CSV Upload',
  description: 'Upload and view product data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}