'use client';
import { FiCreditCard, FiX } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';

export interface Card {
    id: string;
    hiddenNumber?: string;
    isDefault: boolean;
    pokCardId?: string;
}

interface CardSelectionSectionProps {
    userCards: Card[];
    defaultCard: Card | null;
    showCardSelection: boolean;
    setShowAddCardForm: (show: boolean) => void;
    handleSetAsDefault: (cardId: string) => void;
    setShowCardSelection: (show: boolean) => void;
}

export default function CardSelectionSection({
                                                 userCards,
                                                 defaultCard,
                                                 showCardSelection,
                                                 setShowAddCardForm,
                                                 handleSetAsDefault,
                                                 setShowCardSelection
                                             }: CardSelectionSectionProps) {

    if (!showCardSelection) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Select Payment Method</h4>
                    <button
                        onClick={() => setShowCardSelection(false)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Cancel">
                        <FiX className="text-lg" />
                    </button>
                </div>

                {userCards.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-500 mb-4">No saved payment methods.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {userCards.map((card) => (
                            <div
                                key={card.id}
                                className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                                    defaultCard?.id === card.id
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => !card.isDefault && handleSetAsDefault(card.id)}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-purple-500`}>
                                        <FiCreditCard className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Card ending in {card.hiddenNumber?.slice(-4) || '****'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {card.isDefault ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Default</span>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSetAsDefault(card.id); }}
                                            className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={() => setShowAddCardForm(true)}
                    className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-purple-600 font-medium">
                    <FaPlus className="text-sm" />
                    {userCards.length === 0 ? "Add your first card" : "Add Another Card"}
                </button>
            </div>
        </div>
    );
}