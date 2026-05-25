import Footer from '@/components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Map and Dropdown is rendered where {children} is */}
        <main>{children}</main> 
        
        <Footer />
      </body>
    </html>
  );
}