'use client'; 

import { useEffect } from 'react';

export default function DynamicManifest() {
  useEffect(() => {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/api/manifest'; 
    document.head.appendChild(manifestLink);
  }, []);

  return null; 
}
