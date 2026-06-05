"use client";

import dynamic from "next/dynamic";
import {Loader2} from "lucide-react";
import CardsService from "@/services/CardsService";
import {AddCardData, PaymentErrorResponse} from "@nebula-ltd/pok-payments-js";

const AddCardForm = dynamic(
    () => import("@nebula-ltd/pok-payments-js/react").then((mod) => mod.AddCardForm),
    {
        ssr: false,
        loading: () => <div className="p-4 text-center"><Loader2 className="animate-spin mx-auto"/></div>
    }
);

interface AddCardModalProps {
    onClose: () => void;
    onComplete: () => void;
}

export default function AddCardModal({onClose, onComplete}: AddCardModalProps) {

    const handleSuccess = async (cardPayload: AddCardData) => {
        try {
            // Respecting your service layer pattern
            await CardsService.saveCard(cardPayload);
            onComplete();
        } catch (error) {
            console.error("Failed to save card via CardsService:", error);
            // Optional: Handle error via your existing function
            // handleRequestErrors(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                <AddCardForm
                    onSuccess={handleSuccess}
                    onError={(err: PaymentErrorResponse) => console.error("POK SDK Error:", err)}
                    buttonTitle="Save Card"
                    options={{env: "staging", locale: "al"}}
                />
                <button
                    onClick={onClose}
                    className="mt-4 w-full text-sm text-gray-500 hover:text-gray-800 underline"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}