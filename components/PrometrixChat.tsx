'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatComponent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleMySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput('');
        setIsLoading(true);

        // Add user message to UI
        const newUserMsg = { id: crypto.randomUUID(), role: 'user' as const, content: userText };
        setMessages(prev => [...prev, newUserMsg]);

        try {
            const response = await fetch('http://localhost:3001/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userText }),
            });

            const data = await response.json();

            // Add AI response to UI
            setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: data.response }]);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(m => (
                    <div key={m.id} className={`p-3 rounded-xl max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-white text-black border mr-auto'}`}>
                        {m.content}
                    </div>
                ))}
                {isLoading && <div className="text-sm italic text-gray-400">Thinking...</div>}
            </div>

            <form onSubmit={handleMySubmit} className="p-3 bg-white border-t flex gap-2">
                <input
                    className="flex-1 border rounded px-3 py-2 text-black"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded" disabled={isLoading}>
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}