"use client";
import "../styles/globals.css"
import Head from 'next/head'
import Header from './layouts/header'
import Footer from './layouts/footer'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { fetchUser } from '../redux/session/sessionSlice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import localFont from "next/font/local";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

store.dispatch(fetchUser())
toast.configure({
  autoClose: 8000,
  draggable: false,
  position: toast.POSITION.TOP_CENTER,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <div className="App">
            <Head>
              <title>Create Next App</title>
              <meta name="description" content="Generated by create next app" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <div className="container">
              { children }

              <Footer />
            </div>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js"></Script>
            <Script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></Script>
          </div>
        </body>
      </html>
    </Provider>
  );
}
