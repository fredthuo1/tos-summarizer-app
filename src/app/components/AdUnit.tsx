// components/AdUnit.tsx
'use client'; // This directive marks the component as a Client Component in Next.js

import { useEffect } from 'react';
import React from 'react'; // Import React explicitly if your ESLint rules require it

interface AdUnitProps {
    slot: string; // The data-ad-slot ID for this specific ad unit
}

export default function AdUnit({ slot }: AdUnitProps) {
    useEffect(() => {
        // Function to push the ad configuration to AdSense
        const pushAd = () => {
            try {
                // Check if window.adsbygoogle is defined and is an array.
                // This is safer as the main script loads asynchronously.
                if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
                    window.adsbygoogle.push({});
                } else {
                    console.warn('AdSense script not loaded yet, or window.adsbygoogle is not an array.');
                }
            } catch (error) {
                console.error('AdSense push error:', error);
            }
        };

        // Attempt to load the ad when the component mounts.
        // The 'afterInteractive' strategy for the main script in layout.tsx
        // means window.adsbygoogle should generally be available by now.
        pushAd();

        // Optional: If you need to re-render ads when the slot prop changes
        // (e.g., if you have dynamic ad slots on a single page)
        // You could add a cleanup function here if needed, but AdSense often handles its own cleanup.
        // return () => {
        //   // Any cleanup if necessary, though not typically required for AdSense
        // };

    }, [slot]); // Dependency array: Re-run useEffect if the 'slot' prop changes.
    // If 'slot' never changes after initial render, an empty array `[]` is also fine.

    return (
        <div className="adsense-container" style={{ margin: '20px 0', textAlign: 'center' }}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: 'auto' }} // Added width/height for better initial layout
                data-ad-client="ca-pub-8588865009381819" // REPLACE WITH YOUR ACTUAL GOOGLE ADSENSE PUBLISHER ID
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}