"use client";

import { useEffect, useRef, useState } from "react";
import {
    AlertTriangle, Camera, CheckCircle, Loader2, Lock,
    LogOut, Mail, Save, Shield, X, XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import UserSidebar from "@/components/sidebar/userSidebar";
import UserService from "@/services/UserService";
import { logOut } from "@/store/auth/authSlice";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    type: "ADMIN" | "REGULAR" | "GUEST";
    isBanned: boolean;
    createdAt: string;
}

type PasswordStep = "idle" | "request" | "confirm";

export default function ProfilePage() {
    const router   = useRouter();
    const dispatch = useDispatch();

    const [user, setUser]               = useState<UserProfile | null>(null);
    const [loading, setLoading]         = useState(true);
    const [fetchError, setFetchError]   = useState("");

    const [isEditingIdentity, setIsEditingIdentity] = useState(false);
    const [editForm, setEditForm]   = useState({ name: "", email: "" });
    const [savingIdentity, setSavingIdentity] = useState(false);
    const [identityError, setIdentityError]   = useState("");
    const [identitySuccess, setIdentitySuccess] = useState("");

    const [passwordStep, setPasswordStep] = useState<PasswordStep>("idle");
    const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
    const [verificationCode, setVerificationCode] = useState("");
    const [passwordError, setPasswordError]   = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    const fileInputRef          = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [deletingAccount, setDeletingAccount] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await UserService.getMe();
                setUser(res.data);
                setEditForm({ name: res.data.name, email: res.data.email });
            } catch {
                setFetchError("Failed to load profile. Please refresh.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSaveIdentity = async () => {
        if (!user) return;
        setIdentityError("");
        setIdentitySuccess("");

        const payload: { name?: string; email?: string } = {};
        if (editForm.name.trim() && editForm.name !== user.name)   payload.name  = editForm.name.trim();
        if (editForm.email.trim() && editForm.email !== user.email) payload.email = editForm.email.trim();

        // Nothing changed – just close
        if (Object.keys(payload).length === 0) {
            setIsEditingIdentity(false);
            return;
        }

        setSavingIdentity(true);
        try {
            const res = await UserService.partialUpdateMe(payload);
            setUser(res.data);
            setEditForm({ name: res.data.name, email: res.data.email });
            setIsEditingIdentity(false);
            setIdentitySuccess("Profile updated successfully.");
            setTimeout(() => setIdentitySuccess(""), 3000);
        } catch (err: any) {
            setIdentityError(err?.response?.data?.message ?? "Failed to save changes.");
        } finally {
            setSavingIdentity(false);
        }
    };

    const handleRequestPasswordCode = async () => {
        setPasswordError("");

        if (!passwordData.current) {
            setPasswordError("Please enter your current password.");
            return;
        }
        if (passwordData.new.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setSavingPassword(true);
        try {
            await UserService.requestPassword({ currentPassword: passwordData.current });
            // Move to the code-entry step
            setPasswordStep("confirm");
            setVerificationCode("");
        } catch (err: any) {
            setPasswordError(err?.response?.data?.message ?? "Failed to send verification code.");
        } finally {
            setSavingPassword(false);
        }
    };

    const handleConfirmPassword = async () => {
        setPasswordError("");

        if (!verificationCode.trim()) {
            setPasswordError("Please enter the verification code.");
            return;
        }

        setSavingPassword(true);
        try {
            await UserService.confirmPassword({ code: verificationCode.trim(), newPassword: passwordData.new });
            // Log out everywhere after password change
            dispatch(logOut());
            router.push("/login");
        } catch (err: any) {
            setPasswordError(err?.response?.data?.message ?? "Invalid or expired code.");
        } finally {
            setSavingPassword(false);
        }
    };

    const resetPasswordForm = () => {
        setPasswordStep("idle");
        setPasswordData({ current: "", new: "", confirm: "" });
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
            alert("Failed to delete account. Please try again.");
        } finally {
            setDeletingAccount(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatarUrl(URL.createObjectURL(file));
    };

    if (loading) return (
        <UserSidebar>
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={36} className="animate-spin text-blue-500" />
            </div>
        </UserSidebar>
    );

    if (fetchError || !user) return (
        <UserSidebar>
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {fetchError}
            </div>
        </UserSidebar>
    );

    const emailChanged = editForm.email !== user.email;

    return (
        <UserSidebar>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                        <p className="text-gray-500 mt-1">Manage your personal information and account settings.</p>
                    </div>

                    {/* ── IDENTITY ─────────────────────────────────────────── */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-inner overflow-hidden">
                                    {avatarUrl
                                        ? <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        : user.name.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <Camera size={16} />
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                            </div>

                            {/* Name + email */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    {isEditingIdentity ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="text-2xl font-bold bg-gray-50 border border-gray-300 rounded-lg px-2 py-1"
                                            autoFocus
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                                    )}
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                        user.type === "ADMIN"
                                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                                            : "bg-blue-100 text-blue-800 border border-blue-200"
                                    }`}>
                                        <Shield size={12} /> {user.type}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-2 text-gray-600">
                                    <Mail size={16} className="text-gray-400" />
                                    {isEditingIdentity ? (
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-2 py-0.5 text-sm"
                                        />
                                    ) : (
                                        <span>{user.email}</span>
                                    )}
                                </div>

                                <div className="mt-2">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                        user.isBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                    }`}>
                                        {user.isBanned
                                            ? <><XCircle size={12} /> Banned</>
                                            : <><CheckCircle size={12} /> Active</>}
                                    </span>
                                </div>

                                {identityError && <p className="mt-2 text-xs text-red-600">{identityError}</p>}
                                {identitySuccess && <p className="mt-2 text-xs text-green-600">{identitySuccess}</p>}
                            </div>

                            {/* Edit / Save controls */}
                            <div className="sm:ml-auto flex gap-2">
                                {!isEditingIdentity ? (
                                    <button
                                        onClick={() => {
                                            setEditForm({ name: user.name, email: user.email });
                                            setIsEditingIdentity(true);
                                            setIdentityError("");
                                            setIdentitySuccess("");
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveIdentity}
                                            disabled={savingIdentity}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-1 disabled:opacity-60"
                                        >
                                            {savingIdentity
                                                ? <Loader2 size={16} className="animate-spin" />
                                                : <Save size={16} />}
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingIdentity(false);
                                                setIdentityError("");
                                            }}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email change warning */}
                        {isEditingIdentity && emailChanged && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-start gap-2">
                                <AlertTriangle size={16} className="mt-0.5" />
                                <div>
                                    <p className="font-medium">Email change requires verification</p>
                                    <p className="text-amber-700">You will need to verify the new email before it becomes active.</p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* ── SETTINGS ─────────────────────────────────────────── */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Lock size={20} className="text-blue-600" />
                                <h3 className="font-medium text-gray-800">Security</h3>
                            </div>

                            <div className="space-y-4 ml-9">

                                {/* ── Step: idle ── */}
                                {passwordStep === "idle" && (
                                    <button
                                        onClick={() => setPasswordStep("request")}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Change Password
                                    </button>
                                )}

                                {/* ── Step: request – fill passwords, receive code ── */}
                                {passwordStep === "request" && (
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-3 max-w-md">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                            Step 1 of 2 — Enter passwords
                                        </p>
                                        <div className="grid gap-3">
                                            <input
                                                type="password"
                                                placeholder="Current password"
                                                value={passwordData.current}
                                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New password (min. 8 chars)"
                                                value={passwordData.new}
                                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={passwordData.confirm}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                        </div>
                                        {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleRequestPasswordCode}
                                                disabled={savingPassword}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-60"
                                            >
                                                {savingPassword && <Loader2 size={14} className="animate-spin" />}
                                                Send Verification Code
                                            </button>
                                            <button
                                                onClick={resetPasswordForm}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── Step: confirm – enter emailed code ── */}
                                {passwordStep === "confirm" && (
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-3 max-w-md">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                            Step 2 of 2 — Enter verification code
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            A 6-digit code was sent to <span className="font-medium">{user.email}</span>.
                                            Enter it below to confirm your new password.
                                        </p>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="6-digit code"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm tracking-widest font-mono"
                                            autoFocus
                                        />
                                        {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleConfirmPassword}
                                                disabled={savingPassword || verificationCode.length < 6}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-60"
                                            >
                                                {savingPassword && <Loader2 size={14} className="animate-spin" />}
                                                Confirm & Update Password
                                            </button>
                                            <button
                                                onClick={resetPasswordForm}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleRequestPasswordCode}
                                            disabled={savingPassword}
                                            className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                                        >
                                            Resend code
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => { dispatch(logOut()); router.push("/login"); }}
                                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium"
                                >
                                    <LogOut size={14} />
                                    Log out of all devices
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ── DANGER ZONE ───────────────────────────────────────── */}
                    <div className="mt-6 bg-white rounded-2xl border border-red-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle size={20} className="text-red-600" />
                            <h3 className="font-semibold text-red-800">Danger Zone</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Permanently delete your account and all associated data. This cannot be undone.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-60"
                        >
                            {deletingAccount && <Loader2 size={14} className="animate-spin" />}
                            Delete Account
                        </button>
                    </div>
                </main>
            </div>
        </UserSidebar>
    );
}