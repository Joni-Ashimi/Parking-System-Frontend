"use client";

import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import UserSideBar from "@/components/sidebar/userSidebar";
import FeedBackService from "@/services/FeedbackService";

interface PhotoAttachment {
    file: File;
    url: string;
    name: string;
}

export default function FeedbackPage() {
    const [subject, setSubject] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const [photos, setPhotos] = useState<PhotoAttachment[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    const categories = ["Parking Issue", "Payment Problem", "App Bug", "Vehicle Issue", "Other"];

    const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const previews: PhotoAttachment[] = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name,
        }));

        setPhotos((prev) => [...prev, ...previews].slice(0, 5));
    };

    const removePhoto = (index: number) => {
        if (photos[index]) {
            URL.revokeObjectURL(photos[index].url);
        }
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!subject || !category || !message) return;
        setSubmitting(true);

        try {
            const rawFiles = photos.map(p => p.file);
            await FeedBackService.submitFeedback({
                subject,
                category,
                message,
                photos: rawFiles
            });

            setSubmitted(true);
        } catch (error) {
            console.error("Failed to submit feedback:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        // Clean up remaining blob URLs from memory
        photos.forEach(photo => URL.revokeObjectURL(photo.url));

        setSubmitted(false);
        setSubject("");
        setCategory("");
        setMessage("");
        setPhotos([]);
    };

    if (submitted) {
        return (
            <UserSideBar>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                    <div
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
                        <div
                            className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6"
                                 strokeWidth="2">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Feedback Sent!</h2>
                        <p className="text-sm text-gray-500 mb-6">Our team will review your message and get back to you
                            shortly.</p>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Send Another
                        </button>
                    </div>
                </div>
            </UserSideBar>
        );
    }

    return (
        <UserSideBar>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800">Send Feedback</h1>
                        <p className="text-sm text-gray-500 mt-1">Report a problem or share your experience with our
                            team.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setCategory(cat)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                                category === cat
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Brief description of your issue"
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe the issue in detail..."
                                    rows={5}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{message.length} / 1000</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Attach Photos <span className="text-gray-400 font-normal">(optional, max 5)</span>
                            </label>
                            <div className="flex flex-wrap gap-3 mt-3">
                                {photos.map((photo, i) => (
                                    <div key={i}
                                         className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover"/>
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(i)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                                        >
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2.5">
                                                <path d="M18 6L6 18M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                {photos.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-all"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="1.5">
                                            <path d="M12 5v14M5 12h14"/>
                                        </svg>
                                        <span className="text-[10px] mt-1">Add</span>
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handlePhotos}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !subject || !category || !message}
                            className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2">
                                        <path
                                            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth="2">
                                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                                    </svg>
                                    Send Feedback
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </UserSideBar>
    );
}