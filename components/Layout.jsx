import { AppProps } from 'next/app';

export default function Layout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}