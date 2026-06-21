"use client";

import {useEffect, useRef, useState} from "react";
import {
    AlertTriangle,
    Camera,
    CheckCircle,
    CreditCard,
    Loader2,
    Lock,
    LogOut,
    Mail,
    Phone,
    Save,
    Shield,
    Star,
    Trash2,
    User,
    X,
    XCircle,
} from "lucide-react";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import UserSidebar from "@/components/sidebar/userSidebar";
import UserService from "@/services/UserService";
import CardsService from "@/services/CardsService";
import {logOut} from "@/store/auth/authSlice";
import {showSuccess} from "@/utils/functions";
import dynamic from "next/dynamic";

const AddCardModal = dynamic(() => import("@/components/payment/AddCardModal"), {ssr: false});

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    type: "ADMIN" | "REGULAR" | "GUEST";
    isBanned: boolean;
    createdAt: string;
    profileImageUrl: string | null;
    gender: "MALE" | "FEMALE";
}

interface Card {
    id: string;
    pokCardId: string;
    hiddenNumber: string;
    isDefault: boolean;
    createdAt: string;
}

type PasswordStep = "idle" | "request" | "confirm";

function getCardNetwork(hiddenNumber: string): "visa" | "mastercard" | "maestro" | "unknown" {
    const first = hiddenNumber.replace(/\D/g, "")[0];
    const firstTwo = hiddenNumber.replace(/\D/g, "").slice(0, 2);
    if (first === "4") return "visa";
    if (["51", "52", "53", "54", "55"].includes(firstTwo) || (parseInt(firstTwo) >= 22 && parseInt(firstTwo) <= 27)) return "mastercard";
    if (["63", "67"].includes(firstTwo)) return "maestro";
    return "unknown";
}

function CardNetworkLogo({network, size = 32}: { network: string; size?: number }) {
    if (network === "visa") return (
        <svg width={size} height={size * 0.6} viewBox="0 0 48 16" fill="none">
            <text x="0" y="13" fontFamily="Arial" fontWeight="900" fontSize="16" fill="#1A1F71">VISA</text>
        </svg>
    );
    if (network === "mastercard") return (
        <svg width={size} height={size * 0.7} viewBox="0 0 38 24">
            <circle cx="14" cy="12" r="12" fill="#EB001B"/>
            <circle cx="24" cy="12" r="12" fill="#F79E1B"/>
            <path d="M19 5.3a12 12 0 0 1 0 13.4A12 12 0 0 1 19 5.3z" fill="#FF5F00"/>
        </svg>
    );
    if (network === "maestro") return (
        <svg width={size} height={size * 0.7} viewBox="0 0 38 24">
            <circle cx="14" cy="12" r="12" fill="#009BE0"/>
            <circle cx="24" cy="12" r="12" fill="#ED1C2E"/>
            <path d="M19 5.3a12 12 0 0 1 0 13.4A12 12 0 0 1 19 5.3z" fill="#7673C0"/>
        </svg>
    );
    return <CreditCard size={size * 0.7} className="text-gray-400"/>;
}

function CreditCardTile({card, onSetDefault}: { card: Card; onSetDefault: (id: string) => void }) {
    const network = getCardNetwork(card.hiddenNumber);
    const last4 = card.hiddenNumber.slice(-4);

    return (
        <div className={`relative rounded-2xl p-5 min-w-[200px] flex-shrink-0 border transition-all ${
            card.isDefault
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-800"
        }`}>
            {card.isDefault && (
                <div
                    className="absolute top-3 right-3 flex items-center gap-1 bg-amber-400 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    <Star size={8}/> DEFAULT
                </div>
            )}

            <div className="mb-6">
                <CardNetworkLogo network={network} size={36}/>
            </div>

            <p className={`font-mono text-sm tracking-widest mb-4 ${card.isDefault ? "text-slate-300" : "text-gray-500"}`}>
                •••• •••• •••• {last4}
            </p>

            <div className="flex items-center justify-between">
                <p className={`text-[10px] uppercase tracking-wider ${card.isDefault ? "text-slate-400" : "text-gray-400"}`}>
                    {network !== "unknown" ? network : "Card"}
                </p>
                {!card.isDefault && (
                    <button
                        onClick={() => onSetDefault(card.id)}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold border border-blue-200 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition"
                    >
                        Set default
                    </button>
                )}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [user, setUser] = useState<UserProfile | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);

    const [isEditingIdentity, setIsEditingIdentity] = useState(false);
    const [editForm, setEditForm] = useState({name: "", email: ""});
    const [savingIdentity, setSavingIdentity] = useState(false);
    const [identityError, setIdentityError] = useState("");
    const [identitySuccess, setIdentitySuccess] = useState("");

    const [passwordStep, setPasswordStep] = useState<PasswordStep>("idle");
    const [passwordData, setPasswordData] = useState({current: "", new: "", confirm: ""});
    const [verificationCode, setVerificationCode] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [deletingAccount, setDeletingAccount] = useState(false);

    const defaultAvatar = user?.gender === "MALE"
        ? "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960498/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806_mcwkod.jpg"
        : "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960555/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866_li4tqs.jpg";

    const imageSrc = avatarPreview
        ? avatarPreview
        : (user?.profileImageUrl && user.profileImageUrl !== "null"
            ? user.profileImageUrl
            : defaultAvatar);

    const refreshCards = async () => {
        const data = await CardsService.listUserCards();
        setCards(data || []);
    };

    useEffect(() => {
        (async () => {
            try {
                const [res] = await Promise.all([UserService.getMe()]);
                setUser(res.data);
                setEditForm({name: res.data.name, email: res.data.email});
                if (res.data.profileImageUrl && res.data.profileImageUrl !== "null") {
                    setAvatarPreview(res.data.profileImageUrl);
                } else {
                    setAvatarPreview(null);
                }
                await refreshCards();
            } catch {
                setFetchError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSetDefault = async (cardId: string) => {
        try {
            await CardsService.setDefaultCard(cardId);
            await refreshCards();
            showSuccess("Default card updated.");
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveIdentity = async () => {
        if (!user) return;
        setIdentityError("");
        const payload: { name?: string; email?: string } = {};
        if (editForm.name.trim() && editForm.name !== user.name) payload.name = editForm.name.trim();
        if (editForm.email.trim() && editForm.email !== user.email) payload.email = editForm.email.trim();
        if (Object.keys(payload).length === 0) {
            setIsEditingIdentity(false);
            return;
        }
        setSavingIdentity(true);
        try {
            const res = await UserService.partialUpdateMe(payload);
            setUser(res.data);
            setEditForm({name: res.data.name, email: res.data.email});
            setIsEditingIdentity(false);
            setIdentitySuccess("Profile updated.");
            setTimeout(() => setIdentitySuccess(""), 3000);
        } catch (err: any) {
            setIdentityError(err?.response?.data?.message ?? "Failed to save.");
        } finally {
            setSavingIdentity(false);
        }
    };

    const handleRequestPasswordCode = async () => {
        setPasswordError("");
        if (!passwordData.current) {
            setPasswordError("Enter your current password.");
            return;
        }
        if (passwordData.new.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            setPasswordError("Passwords don't match.");
            return;
        }
        setSavingPassword(true);
        try {
            await UserService.requestPassword({currentPassword: passwordData.current});
            setPasswordStep("confirm");
            setVerificationCode("");
        } catch (err: any) {
            setPasswordError(err?.response?.data?.message ?? "Failed to send code.");
        } finally {
            setSavingPassword(false);
        }
    };

    const handleConfirmPassword = async () => {
        setPasswordError("");
        if (!verificationCode.trim()) {
            setPasswordError("Enter the verification code.");
            return;
        }
        setSavingPassword(true);
        try {
            await UserService.confirmPassword({code: verificationCode.trim(), newPassword: passwordData.new});
            showSuccess("Password updated! Please log in again.");
            resetPasswordForm();
            setTimeout(() => {
                dispatch(logOut());
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            setPasswordError(err?.response?.data?.message ?? "Invalid or expired code.");
        } finally {
            setSavingPassword(false);
        }
    };

    const resetPasswordForm = () => {
        setPasswordStep("idle");
        setPasswordData({current: "", new: "", confirm: ""});
        setVerificationCode("");
        setPasswordError("");
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Permanently delete your account? This cannot be undone.")) return;
        setDeletingAccount(true);
        try {
            await UserService.deleteMe();
            dispatch(logOut());
            router.push("/");
        } catch {
            alert("Failed to delete account.");
        } finally {
            setDeletingAccount(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await UserService.uploadAvatar(formData);
            setUser(res.data);
        } catch (err) {
            console.error("Avatar upload failed", err);
        }
    };

    if (loading) return (
        <UserSidebar>
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-blue-500"/>
            </div>
        </UserSidebar>
    );

    if (fetchError || !user) return (
        <UserSidebar>
            <div className="min-h-screen flex items-center justify-center text-red-500 text-sm">{fetchError}</div>
        </UserSidebar>
    );

    const emailChanged = editForm.email !== user.email;
    const initials = user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <UserSidebar>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-5">

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"/>

                        <div className="px-6 pb-6">
                            <div className="flex items-end justify-between -mt-12 mb-4">
                                <div className="relative group">
                                    <div
                                        className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
                                        <img src={imageSrc} className="w-full h-full object-cover" alt="avatar"/>
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition"
                                        aria-label="Change avatar"
                                    >
                                        <Camera size={13} className="text-gray-500"/>
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*"
                                           className="hidden"/>
                                </div>

                                <span
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                                        user.type === "ADMIN"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}>
                                    <Shield size={12}/> {user.type}
                                </span>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {isEditingIdentity ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                                className="text-xl font-bold w-full border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                            />
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={e => setEditForm({...editForm, email: e.target.value})}
                                                className="w-full border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {emailChanged && (
                                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                                    <AlertTriangle size={11}/> Email change requires verification
                                                </p>
                                            )}
                                            {identityError && <p className="text-xs text-red-600">{identityError}</p>}
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Mail size={13} className="text-gray-400"/> {user.email}
                                                </span>
                                                {user.phoneNumber && (
                                                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                                        <Phone size={13} className="text-gray-400"/> {user.phoneNumber}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span
                                                    className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                                                        user.isBanned ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                                                    }`}>
                                                    {user.isBanned ? <><XCircle size={11}/> Banned</> : <><CheckCircle
                                                        size={11}/> Active</>}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    Member since {new Date(user.createdAt).toLocaleDateString([], {
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                                </span>
                                            </div>
                                            {identitySuccess &&
                                                <p className="text-xs text-emerald-600 mt-1">{identitySuccess}</p>}
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    {isEditingIdentity ? (
                                        <>
                                            <button
                                                onClick={handleSaveIdentity}
                                                disabled={savingIdentity}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60"
                                            >
                                                {savingIdentity ? <Loader2 size={13} className="animate-spin"/> :
                                                    <Save size={13}/>}
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditingIdentity(false);
                                                    setIdentityError("");
                                                }}
                                                className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl transition"
                                            >
                                                <X size={15} className="text-gray-500"/>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditForm({name: user.name, email: user.email});
                                                setIsEditingIdentity(true);
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-medium transition"
                                        >
                                            <User size={13}/> Edit profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <CreditCard size={15} className="text-blue-500"/> Payment Methods
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {cards.length} card{cards.length !== 1 ? "s" : ""} saved
                                </p>
                            </div>
                            <button
                                onClick={() => setIsAddCardOpen(true)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold border border-blue-100 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
                            >
                                + Add card
                            </button>
                        </div>

                        {cards.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-8 text-center">
                                <CreditCard size={24} className="text-gray-300 mx-auto mb-2"/>
                                <p className="text-sm text-gray-400">No payment methods saved</p>
                                <button
                                    onClick={() => setIsAddCardOpen(true)}
                                    className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
                                >
                                    Add your first card →
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3 overflow-x-auto pb-2" style={{scrollbarWidth: "thin"}}>
                                {cards.map(card => (
                                    <CreditCardTile key={card.id} card={card} onSetDefault={handleSetDefault}/>
                                ))}
                                {/* Add another */}
                                <button
                                    onClick={() => setIsAddCardOpen(true)}
                                    className="min-w-[160px] flex-shrink-0 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 p-5"
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl border-2 border-current flex items-center justify-center">
                                        <span className="text-lg font-light">+</span>
                                    </div>
                                    <span className="text-xs font-medium">Add card</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Lock size={15} className="text-blue-500"/> Security
                        </h2>

                        {passwordStep === "idle" && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Password</p>
                                    <p className="text-xs text-gray-400">Last
                                        changed: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</p>
                                </div>
                                <button
                                    onClick={() => setPasswordStep("request")}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold border border-blue-100 bg-blue-50 px-3 py-1.5 rounded-xl transition"
                                >
                                    Change
                                </button>
                            </div>
                        )}

                        {passwordStep === "request" && (
                            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Step 1 of 2
                                    — New password</p>
                                <input type="password" placeholder="Current password" value={passwordData.current}
                                       onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                                       className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                <input type="password" placeholder="New password (min. 8 chars)"
                                       value={passwordData.new}
                                       onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                                       className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                <input type="password" placeholder="Confirm new password" value={passwordData.confirm}
                                       onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                                       className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
                                <div className="flex gap-2">
                                    <button onClick={handleRequestPasswordCode} disabled={savingPassword}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60">
                                        {savingPassword && <Loader2 size={13} className="animate-spin"/>} Send Code
                                    </button>
                                    <button onClick={resetPasswordForm}
                                            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm transition">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {passwordStep === "confirm" && (
                            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Step 2 of 2
                                    — Verify code</p>
                                <p className="text-xs text-gray-500">Enter the 6-digit code sent
                                    to <strong>{user.email}</strong></p>
                                <input type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                                       value={verificationCode}
                                       onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                                       className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-mono tracking-[0.4em] text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       autoFocus/>
                                {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
                                <div className="flex gap-2">
                                    <button onClick={handleConfirmPassword}
                                            disabled={savingPassword || verificationCode.length < 6}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60">
                                        {savingPassword && <Loader2 size={13} className="animate-spin"/>} Confirm
                                    </button>
                                    <button onClick={resetPasswordForm}
                                            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm transition">Cancel
                                    </button>
                                </div>
                                <button onClick={handleRequestPasswordCode} disabled={savingPassword}
                                        className="text-xs text-blue-500 hover:underline">Resend code
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                dispatch(logOut());
                                router.push("/login");
                            }}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 font-medium transition"
                        >
                            <LogOut size={14}/> Sign out
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-5">
                        <h2 className="text-sm font-bold text-red-700 flex items-center gap-2 mb-3">
                            <AlertTriangle size={15}/> Danger zone
                        </h2>
                        <p className="text-xs text-gray-500 mb-4">Permanently delete your account and all associated
                            data. This cannot be undone.</p>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-sm font-semibold transition disabled:opacity-60"
                        >
                            {deletingAccount ? <Loader2 size={13} className="animate-spin"/> : <Trash2 size={13}/>}
                            Delete account
                        </button>
                    </div>
                </div>
            </div>

            {isAddCardOpen && (
                <AddCardModal
                    onClose={() => setIsAddCardOpen(false)}
                    onComplete={async () => {
                        setIsAddCardOpen(false);
                        await refreshCards();
                    }}
                />
            )}
        </UserSidebar>
    );
}