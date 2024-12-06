import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import { Suspense } from "react";
import Loading from "./loading";
import { ThemeProvider } from "next-themes";
import Providers from "./providers";
import { Montserrat } from "next/font/google";
import DynamicManifest from "./components/DynamicLink";
import RegisterServiceWorker from "./components/RegisterServiceWorker";
import { ShoppingListProvider } from "./context/shoppingListContext";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {

  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <title>KwaMai Eatery</title>
        <link rel="icon" href="/0.png" />
        <DynamicManifest />
        {/* Main Meta Tags */}

        <meta
          name="description"
          content="This is the official recipe website of KwaMai Eatery"
        />
        <meta
          name="keywords"
          content="Food, recipe, dinner, lunch, snack, ingredients, kwamai, eatery "
        />
        <meta name="author" content="Codespace" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="KwaMai Eatery" />
        <meta
          property="og:description"
          content="This is the official recipe website of KwaMai Eatery"
        />
        <meta property="og:image" content="/0.png" />
        <meta property="og:url" content="To be added when app is launched" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KwaMai Eatery" />
        <meta
          name="twitter:description"
          content="This is the official recipe website of KwaMai Eatery"
        />
        <meta name="twitter:image" content="/0.png" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Applying custom fonts and antialiasing for better text rendering
      >
        <Providers>
          <ThemeProvider attribute="class">
            <Header /> {/* Rendering the Header component */}
            <Suspense fallback={<Loading />}>
              {children} {/* Rendering the child components or pages */}
            </Suspense >
          </ThemeProvider >
        </Providers >
        {/* <RegisterServiceWorker /> Register the service worker */}
      </body >
    </html >
  );
}
