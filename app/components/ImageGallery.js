'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ImageGallery({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <div className="flex justify-center">
                <Image
                    src={images[currentIndex]}
                    alt={`Recipe image ${currentIndex + 1}`}
                    width={600}
                    height={400}
                    className="object-cover rounded-md"
                />
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2  text-[#edd282] p-2 rounded-full hover:bg-[#ffebe5] transition-colors"
                        aria-label="Previous image"
                    >
                        <FaChevronLeft size={24} />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2  text-[#edd282] p-2 rounded-full hover:bg-[#ffebe5] transition-colors"
                        aria-label="Next image"
                    >
                        <FaChevronRight size={24} />
                    </button>
                </>
            )}

            <div className="flex justify-center mt-4 space-x-4">
                {images.map((image, index) => (
                    <div 
                    key={index} 
                    className={`relative w-32 h-28 cursor-pointer rounded-lg ${currentIndex === index ? 'shadow-lg shadow-[#ffebe5]' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                >
                    <Image
                        src={image}
                        alt={`Recipe image ${index + 1}`}
                        className={`rounded-lg `}
                        fill
                        sizes="100%"
                        style={{ objectFit: 'fill' }}
                    />
                </div>
                ))}
            </div>
        </div>
    );
}