
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";

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

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Recipe website</title>
        <link rel="icon" href="restaurant.png" />

        {/* Main Meta Tags */}
    

        <meta name="description" content="This is a recipe website" />
        <meta
          name="keywords"
          content="Food, recipe, dinner, lunch, snack, breakfast, vegan, ingredients "
        />
        <meta name="author" content="Codespace" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Recipe Website" />
        <meta property="og:description" content="This is a recipe website" />
        <meta property="og:image" content="/knifefork.png" />
        <meta property="og:url" content="To be added" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Recipe Website" />
        <meta name="twitter:description" content="This is a recipe website" />
        <meta name="twitter:image" content="/knifefork.png" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
