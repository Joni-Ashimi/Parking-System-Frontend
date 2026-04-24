"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";

interface CImageInputProps {
    onImageChange?: (file: File, previewUrl: string) => void;
    className?: string;
}

const CImageInput = ({ onImageChange }: CImageInputProps) => {
    const fileRef = useRef<HTMLInputElement | null>(null);

    const handlePick = () => {
        fileRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        onImageChange?.(file, url);
    };

    return (
        <>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />

            <button
                type="button"
                onClick={handlePick}
                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
            >
                <Camera size={16} />
            </button>
        </>
    );
};

export default CImageInput;