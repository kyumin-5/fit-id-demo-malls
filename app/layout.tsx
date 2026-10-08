import type {Metadata} from 'next';
import './globals.css';

export const metadata:Metadata={
  title:'FIT ID Demo Commerce',
  description:'One FIT ID across multiple fictional shopping malls.'
};

export default function RootLayout({
  children
}:Readonly<{children:React.ReactNode}>){
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
