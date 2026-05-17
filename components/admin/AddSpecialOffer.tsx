"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Tag, X } from "lucide-react";

interface AddOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: any) => Promise<void>;
    categories: any[];
}

export default function AddOfferModal({ isOpen, onClose, onSave, categories }: AddOfferModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        adjustmentType: "DISCOUNT",
        value: 20,
        dayOfWeek: new Date().getDay(),
        startHour: 0,
        endHour: 23,
        spotCategoryId: "",
    });

    // Auto-select the first category ID when the modal opens
    useEffect(() => {
        if (isOpen && categories && categories.length > 0) {
            setFormData(prev => ({ ...prev, spotCategoryId: categories[0].id }));
        }
    }, [isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!formData.name || !formData.spotCategoryId) return;
        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Tag size={18}/> Add Price Rule Modifier
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20}/></button>
                </div>

                <div className="p-6 space-y-4 text-gray-700 text-sm">
                    {/* Rule Title */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rule Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Weekend Car Promo"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Linked Target Category */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Vehicle Category</label>
                        <select
                            value={formData.spotCategoryId}
                            onChange={(e) => setFormData({...formData, spotCategoryId: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.type || cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Adjustment Types and Values */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
                            <select
                                value={formData.adjustmentType}
                                onChange={(e) => setFormData({...formData, adjustmentType: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="DISCOUNT">Discount (%)</option>
                                <option value="SURCHARGE">Surcharge (%)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Value Percentage</label>
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={formData.value}
                                onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Operational Time Windows */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Active Day of Week</label>
                        <select
                            value={formData.dayOfWeek}
                            onChange={(e) => setFormData({...formData, dayOfWeek: parseInt(e.target.value)})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                        >
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, idx) => (
                                <option key={idx} value={idx}>{day}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Hour (0-23)</label>
                            <input
                                type="number"
                                min={0} max={23}
                                value={formData.startHour}
                                onChange={(e) => setFormData({...formData, startHour: parseInt(e.target.value) || 0})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Hour (0-23)</label>
                            <input
                                type="number"
                                min={0} max={23}
                                value={formData.endHour}
                                onChange={(e) => setFormData({...formData, endHour: parseInt(e.target.value) || 0})}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-100">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.name}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center gap-1.5 transition shadow-sm"
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>}
                        Add Rule
                    </button>
                </div>
            </div>
        </div>
    );
}