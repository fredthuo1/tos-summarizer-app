'use client';

import { useEffect } from 'react';

export default function AdUnit({ slot }: { slot: string }) {
    useEffect(() => {
        try {
            // Initialize the ad slot
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error', err);
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="pub-8588865009381819"
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
    );
}
