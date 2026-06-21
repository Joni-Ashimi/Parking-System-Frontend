'use client';

import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {encryptCard} from '@nebula-ltd/pok-payments-js';
import CardsService from '@/services/CardsService';

export default function AddCardModal({
                                         onClose,
                                         onComplete,
                                     }: {
    onClose: () => void;
    onComplete: () => void;
}) {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<'card' | 'billing'>('card');

    const [cardNumber, setCardNumber] = useState('');
    const [expiration, setExpiration] = useState('');
    const [cvv, setCvv] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address1, setAddress1] = useState('');
    const [locality, setLocality] = useState('');
    const [countryCode, setCountryCode] = useState('AL');

    useEffect(() => {
        setMounted(true);
    }, []);

    const cardValid =
        cardNumber.replace(/\s/g, '').length === 16 &&
        expiration.length === 5 &&
        cvv.length >= 3;

    const billingValid = firstName && lastName && email && address1 && locality && countryCode;

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            const [expMonth, expYear] = expiration.split('/');

            const jwe = await encryptCard({
                cardNumber: cardNumber.replace(/\s/g, ''),
                expiration,
                securityCode: cvv,
                env: 'staging',
            });

            const response=  await CardsService.tokenizeGuestCard({
                csFlexCard: {
                    jwe,
                    expirationMonth: expMonth,
                    expirationYear: `20${expYear}`,
                },
                securityCode: cvv,
                billingInfo: {
                    firstName,
                    lastName,
                    name: `${firstName} ${lastName}`,
                    email,
                    address1,
                    locality,
                    countryCode,
                },
            } as any);
            console.log('response: ', response);
            onComplete();
        } catch (err) {
            console.error('Add card error:', err);
            setError('Could not save card. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Add New Card</h2>
                        <p className="text-xs text-gray-400">
                            {step === 'card' ? 'Step 1 of 2 — Card details' : 'Step 2 of 2 — Billing info'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×
                    </button>
                </div>

                {step === 'card' && (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Card Number</label>
                            <input
                                type="text"
                                placeholder="4242 4242 4242 4242"
                                maxLength={19}
                                value={cardNumber}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                                    setCardNumber(val.replace(/(.{4})/g, '$1 ').trim());
                                }}
                                className={`${inputClass} font-mono`}
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-600 block mb-1">Expiry (MM/YY)</label>
                                <input
                                    type="text"
                                    placeholder="12/28"
                                    maxLength={5}
                                    value={expiration}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        setExpiration(val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val);
                                    }}
                                    className={`${inputClass} font-mono`}
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-xs font-medium text-gray-600 block mb-1">CVV</label>
                                <input
                                    type="password"
                                    placeholder="•••"
                                    maxLength={4}
                                    value={cvv}
                                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    className={`${inputClass} font-mono`}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setStep('billing')}
                            disabled={!cardValid}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition"
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {step === 'billing' && (
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-600 block mb-1">First Name</label>
                                <input type="text" placeholder="John" value={firstName}
                                       onChange={e => setFirstName(e.target.value)} className={inputClass}/>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-600 block mb-1">Last Name</label>
                                <input type="text" placeholder="Smith" value={lastName}
                                       onChange={e => setLastName(e.target.value)} className={inputClass}/>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Email</label>
                            <input type="email" placeholder="john@example.com" value={email}
                                   onChange={e => setEmail(e.target.value)} className={inputClass}/>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Address</label>
                            <input type="text" placeholder="Rruga Myslym Shyri" value={address1}
                                   onChange={e => setAddress1(e.target.value)} className={inputClass}/>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs font-medium text-gray-600 block mb-1">City</label>
                                <input type="text" placeholder="Tirana" value={locality}
                                       onChange={e => setLocality(e.target.value)} className={inputClass}/>
                            </div>
                            <div className="w-24">
                                <label className="text-xs font-medium text-gray-600 block mb-1">Country</label>
                                <input type="text" placeholder="AL" maxLength={2} value={countryCode}
                                       onChange={e => setCountryCode(e.target.value.toUpperCase())}
                                       className={`${inputClass} font-mono`}/>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-500" role="alert">{error}</p>}

                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={() => setStep('card')}
                                className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl font-semibold text-sm transition"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !billingValid}
                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition"
                            >
                                {loading ? 'Saving...' : 'Save Card'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>,
        document.body
    );
}