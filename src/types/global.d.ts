// src/types/global.d.ts

// This declares a global interface for the Window object
// It merges with the existing Window interface provided by TypeScript
// to add the 'adsbygoogle' property.
interface Window {
    adsbygoogle: unknown[]; // Google AdSense pushes objects into this array
}