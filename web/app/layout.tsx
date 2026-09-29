import './globals.css'
export const metadata = { title: 'StormSight AI | SIH26072' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="antialiased">{children}</body></html>
}
