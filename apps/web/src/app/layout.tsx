import { Header } from '../lib/components';
import './global.css';
import { StoreProvider } from './store-provider';

export const metadata = {
  title: 'Fretboard Scholar',
  description: 'Master fretboard notes',
  icons: {
    shortcut: 'favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <>
            <Header />
            {children}
          </>
        </StoreProvider>
      </body>
    </html>
  );
}
