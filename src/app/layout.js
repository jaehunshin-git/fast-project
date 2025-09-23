import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: {
    default: "Fast Project",
    template: "%s | Fast Project",
  },
  description: "Automatically assemble Notion dashboards from a single project brief.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-bg-primary">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-bg-primary text-fg-primary antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-bg-primary text-fg-primary">
          <header className="border-b border-border-subtle">
            <div className="mx-auto flex w-full max-w-shell items-center justify-between px-6 py-5">
              <div className="flex flex-col">
                <span className="font-display text-lg font-semibold tracking-tight">Fast Project</span>
                <span className="text-sm text-fg-muted">Instant Notion workspace generator</span>
              </div>
              <nav className="flex items-center gap-4 text-sm text-fg-muted">
                <span>Docs</span>
                <span>Status</span>
              </nav>
            </div>
          </header>

          <main className="flex-1 bg-bg-primary">
            <div className="mx-auto w-full max-w-shell px-6 py-12">{children}</div>
          </main>

          <footer className="border-t border-border-subtle">
            <div className="mx-auto flex w-full max-w-shell items-center justify-between px-6 py-6 text-sm text-fg-muted">
              <span>Copyright {new Date().getFullYear()} Fast Project</span>
              <span>Designed for collaborative teams</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
