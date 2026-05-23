    "use client";

import React, {useState} from 'react';
import {MessageSquare, X} from 'lucide-react';
import ChatComponent from '@/components/PrometrixChat';
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";

export default function GlobalChat() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <>
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                aria-label="Toggle chat helper"
                className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center border border-blue-500"
            >
                {isChatOpen ? <X size={24}/> : <MessageSquare size={24}/>}
            </button>

            {isChatOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">

                    <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3.5 flex items-center justify-between font-semibold text-sm shadow-sm shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                            <span>Prometrix Support AI</span>
                        </div>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <X size={16}/>
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden bg-gray-50/50">
                        <ChatComponent userId={user?.id}/>
                    </div>
                </div>
            )}
        </>
    );
}