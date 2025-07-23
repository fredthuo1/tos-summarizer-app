'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function WhatWeDo() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const [count, setCount] = useState(0);
    const [liveUsers, setLiveUsers] = useState(321);
    const [showVideo, setShowVideo] = useState(false);

    const testimonials = [
        "⭐️⭐️⭐️⭐️⭐️ — 'Now I actually read the fine print!'",
        "⭐️⭐️⭐️⭐️⭐️ — 'Saved me from hidden fees.'",
        "⭐️⭐️⭐️⭐️⭐️ — 'Great tool for peace of mind.'",
    ];

    const [testimonialIndex, setTestimonialIndex] = useState(0);

    useEffect(() => {
        if (inView) {
            let current = 0;
            const interval = setInterval(() => {
                current += 5;
                if (current >= 100) {
                    clearInterval(interval);
                    setCount(100);
                } else {
                    setCount(current);
                }
            }, 20);
        }
    }, [inView]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveUsers((prev) => prev + Math.floor(Math.random() * 3 - 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative mt-12">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900 opacity-20 pointer-events-none rounded-md" />

            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="relative bg-white dark:bg-gray-800 rounded-md shadow-md p-6 max-w-5xl mx-auto flex flex-col lg:flex-row gap-6"
            >
                {/* Illustration */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-shrink-0"
                >
                    <img
                        src="/illustration-ai-analysis-dark.svg"
                        alt="AI analyzing"
                        className="w-48 h-48 hidden dark:block"
                    />
                    <img
                        src="/illustration-ai-analysis-light.svg"
                        alt="AI analyzing"
                        className="w-48 h-48 dark:hidden"
                    />
                </motion.div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                    <h2 className="text-xl font-semibold">🌟 What We Do</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We use advanced AI to help you understand <strong>Terms of Service</strong> and privacy policies in plain English.
                    </p>

                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                        <li>✅ Highlights hidden risks</li>
                        <li>✅ Finds hidden fees and clauses</li>
                        <li>✅ Gives actionable recommendations</li>
                        <li>✅ Saves your time & protects your privacy</li>
                    </ul>
                    <section>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setShowVideo(true)}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm"
                            >
                                🎥 Watch Demo
                            </button>
                        </div>
                    </section>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="mt-6 text-center text-gray-700 dark:text-gray-300 space-y-1">
                <p>📝 Confidence boost: <strong>{count}%</strong> of users feel safer</p>
                <p>👥 Currently analyzing for <strong>{liveUsers}</strong> users</p>
            </div>

            {/* Testimonials */}
            <div className="mt-4 text-center">
                <div className="inline-block bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md shadow-sm">
                    <motion.p
                        key={testimonialIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="text-sm text-gray-800 dark:text-gray-100"
                    >
                        {testimonials[testimonialIndex]}
                    </motion.p>
                </div>
            </div>

            {/* Video Modal */}
            {showVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 relative max-w-2xl w-full">
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
                        >
                            ✖️
                        </button>
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Demo video"
                                frameBorder="0"
                                allowFullScreen
                                className="w-full h-full rounded"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
