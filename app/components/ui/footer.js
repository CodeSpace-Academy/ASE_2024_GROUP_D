"use client";

import Link from 'next/link';

/**
 * Footer component that displays the footer section with links to different pages, social media icons, and contact information.
 *
 * @returns {JSX.Element} - The footer component containing the website's footer information.
 */
export default function Footer() {
  return (
    <footer className="bg-[#f9efd2] dark:bg-[#1c1d02] dark:text-[#dddcfe] text-[#020123] py-3">
      <div className="max-w-7xl mx-auto px-3 sm:px-3 lg:px-4">
        <div className="flex flex-wrap justify-between text-sm">
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <h2 className="text-lg font-bold font-serif mb-2">KwaMaiMai</h2>
            <p>Home cooked meals.</p>
            <p>Contact us: (068) 656-7890</p>
            <p>Email: info@KwaMaiMai.com</p>
          </div>
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <h2 className="text-base font-bold mb-2">Quick Links</h2>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">About Us</Link>
              </li>
              <li>
                <Link href="/products" className="hover:underline">Products</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <h2 className="text-base font-bold mb-2">Follow Us</h2>
            <div className="flex space-x-3">
              <Link href="https://www.facebook.com" target="_blank" className="hover:text-[#ff4f1a]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 5.99 4.388 10.961 10.125 11.858v-8.385H7.077v-3.473h3.048V9.356c0-3.025 1.792-4.701 4.533-4.701 1.312 0 2.686.235 2.686.235v2.959h-1.513c-1.491 0-1.955.925-1.955 1.873v2.243h3.328l-.532 3.473h-2.796v8.385C19.612 23.034 24 18.063 24 12.073z"/>
                </svg>
              facebook</Link>
              <Link href="https://www.twitter.com" target="_blank" className="hover:text-[#ff4f1a]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.828 9.828 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195 4.922 4.922 0 0 0-8.379 4.482A13.958 13.958 0 0 1 1.671 3.149a4.918 4.918 0 0 0 1.523 6.573 4.902 4.902 0 0 1-2.229-.616v.061a4.921 4.921 0 0 0 3.946 4.83 4.9 4.9 0 0 1-2.224.085 4.928 4.928 0 0 0 4.598 3.417 9.866 9.866 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.557 2.213c9.054 0 14.001-7.502 14.001-14.002 0-.213-.005-.426-.015-.637A9.978 9.978 0 0 0 24 4.557z"/>
                </svg>
              twitter</Link>
              <Link href="https://www.instagram.com" target="_blank" className="hover:text-[#ff4f1a]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.206.057 1.92.247 2.38.416a4.91 4.91 0 0 1 1.805 1.043 4.91 4.91 0 0 1 1.043 1.805c.169.46.36 1.174.416 2.38.059 1.265.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.057 1.206-.247 1.92-.416 2.38a4.91 4.91 0 0 1-1.043 1.805 4.91 4.91 0 0 1-1.805 1.043c-.46.169-1.174.36-2.38.416-1.265.059-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.206-.057-1.92-.247-2.38-.416a4.91 4.91 0 0 1-1.805-1.043 4.91 4.91 0 0 1-1.043-1.805c-.169-.46-.36-1.174-.416-2.38-.059-1.265-.07-1.645-.07-4.85s.012-3.584.07-4.85c.057-1.206.247-1.92.416-2.38a4.91 4.91 0 0 1 1.043-1.805 4.91 4.91 0 0 1 1.805-1.043c.46-.169 1.174-.36 2.38-.416 1.265-.059 1.645-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.28.058-2.157.272-2.905.58a6.741 6.741 0 0 0-2.459 1.58 6.741 6.741 0 0 0-1.58 2.459c-.308.748-.522 1.625-.58 2.905-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.28.272 2.157.58 2.905a6.741 6.741 0 0 0 1.58 2.459 6.741 6.741 0 0 0 2.459 1.58c.748.308 1.625.522 2.905.58 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.28-.058 2.157-.272 2.905-.58a6.741 6.741 0 0 0 2.459-1.58 6.741 6.741 0 0 0 1.58-2.459c.308-.748.522-1.625.58-2.905.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.28-.272-2.157-.58-2.905a6.741 6.741 0 0 0-1.58-2.459 6.741 6.741 0 0 0-2.459-1.58c-.748-.308-1.625-.522-2.905-.58-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.148a3.986 3.986 0 1 1 0-7.972 3.986 3.986 0 0 1 0 7.972zm6.406-10.845a1.44 1.44 0 1 1 0-2.882 1.44 1.44 0 0 1 0 2.882z"/>
                </svg>
              instagram</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
