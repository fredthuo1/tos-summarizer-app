'use client';

import { useEffect } from 'react';

interface AdSenseUnitProps {
  slot: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
}

export function AdSenseUnit({ slot, format = 'horizontal', responsive = true }: AdSenseUnitProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log('AdSense error:', err);
      }
    }
  }, []);

  const getAdDimensions = () => {
    switch (format) {
      case 'horizontal':
        return { width: '100%', height: '90px' };
      case 'vertical':
        return { width: '100%', height: '500px' };
      case 'rectangle':
        return { width: '100%', height: '250px' };
      default:
        return { width: '100%', height: '90px' };
    }
  };

  const dimensions = getAdDimensions();

  return (
    <div className="w-full flex justify-center my-4">
      <div 
        className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400"
        style={dimensions}
      >
        <div className="text-center">
          <div className="text-sm font-medium">Google AdSense</div>
          <div className="text-xs opacity-75">{format.charAt(0).toUpperCase() + format.slice(1)} Ad Unit</div>
          <div className="text-xs opacity-50 mt-1">Slot: {slot}</div>
        </div>
      </div>
    </div>
  );
}