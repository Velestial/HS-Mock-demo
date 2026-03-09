import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingBag,
    MapPin,
    User,
    Download,
    LogOut,
    ChevronRight,
    Package,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { AuthUser } from '../../context/AuthContext';

interface AccountPageProps {
    onBack: () => void;
}

type Tab = 'dashboard' | 'orders' | 'addresses' | 'details' | 'downloads';

const AccountPage: React.FC<AccountPageProps> = ({ onBack }) => {
    const { user, sessionLoading, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    const handleLogout = async () => {
        await logout();
        onBack();
    };

    if (sessionLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-xs uppercase text-neutral-500 tracking-widest">Restoring session...</span>
                </div>
            </div>
        );
    }

    if (!user) return null;

    // Helper: Display Name (First Name or email prefix)
    const displayName = user.first_name || user.email.split('@')[0];

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-6">
            <div className="max-w-[1920px] mx-auto">

                {/* Header */}
                <div className="mb-12 border-b border-black pb-8 flex justify-between items-end">
                    <div>
                        <span className="font-mono text-xs uppercase text-neutral-500 block mb-2">/// CAPTAIN'S LOG</span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Hello, {displayName}
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs font-mono uppercase text-red-600 hover:bg-red-50 px-4 py-2 border border-transparent hover:border-red-100 transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Disembark (Logout)
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <nav className="flex flex-col border-l border-black">
                            <TabButton
                                active={activeTab === 'dashboard'}
                                icon={LayoutDashboard}
                                label="Dashboard"
                                onClick={() => setActiveTab('dashboard')}
                            />
                            <TabButton
                                active={activeTab === 'orders'}
                                icon={ShoppingBag}
                                label="Order History"
                                onClick={() => setActiveTab('orders')}
                            />
                            <TabButton
                                active={activeTab === 'addresses'}
                                icon={MapPin}
                                label="Addresses"
                                onClick={() => setActiveTab('addresses')}
                            />
                            <TabButton
                                active={activeTab === 'details'}
                                icon={User}
                                label="Account Details"
                                onClick={() => setActiveTab('details')}
                            />
                            <TabButton
                                active={activeTab === 'downloads'}
                                icon={Download}
                                label="Downloads"
                                onClick={() => setActiveTab('downloads')}
                            />
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'dashboard' && <DashboardTab user={user} onViewOrders={() => setActiveTab('orders')} />}
                                {activeTab === 'orders' && <OrdersTab />}
                                {activeTab === 'addresses' && <AddressesTab />}
                                {activeTab === 'details' && <DetailsTab user={user} />}
                                {activeTab === 'downloads' && <DownloadsTab />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-Components

const TabButton: React.FC<{ active: boolean; icon: any; label: string; onClick: () => void }> = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-y border-r border-black/5 hover:bg-neutral-50 ${active ? 'bg-black text-white border-black' : 'text-neutral-500'}`}
    >
        <Icon className="w-4 h-4" />
        {label}
        {active && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
);

const DashboardTab: React.FC<{ user: AuthUser, onViewOrders: () => void }> = ({ user, onViewOrders }) => (
    <div className="space-y-8">
        <div className="bg-neutral-100 p-8 border border-black relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Package className="w-32 h-32" />
            </div>
            <p className="font-mono text-sm text-neutral-600 mb-2">Current Status</p>
            <p className="text-xl font-bold uppercase max-w-lg mb-6">
                Welcome back, Captain. Your account is active.
            </p>
            <button onClick={onViewOrders} className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-neutral-600">
                View Recent Activity
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-black p-6 flex flex-col justify-between h-32 hover:bg-neutral-50 transition-colors cursor-pointer">
                <ShoppingBag className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Recent Orders</span>
            </div>
            <div className="border border-black p-6 flex flex-col justify-between h-32 hover:bg-neutral-50 transition-colors cursor-pointer">
                <MapPin className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Manage Addresses</span>
            </div>
            <div className="border border-black p-6 flex flex-col justify-between h-32 hover:bg-neutral-50 transition-colors cursor-pointer">
                <User className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Update Profile</span>
            </div>
        </div>
    </div>
);

const OrdersTab: React.FC = () => (
    <div>
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Order History</h3>
        <div className="text-center py-12 border border-dashed border-black/20">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500 font-mono text-sm uppercase">No orders found.</p>
        </div>
    </div>
);

const AddressesTab: React.FC = () => (
    <div>
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Addresses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-black p-8 relative">
                <h4 className="font-mono text-xs uppercase text-neutral-500 mb-4">Billing Address</h4>
                <p className="text-sm text-neutral-400 italic">Address management coming soon.</p>
            </div>
            <div className="border border-black p-8 relative">
                <h4 className="font-mono text-xs uppercase text-neutral-500 mb-4">Shipping Address</h4>
                <p className="text-sm text-neutral-400 italic">Address management coming soon.</p>
            </div>
        </div>
    </div>
);

const DetailsTab: React.FC<{ user: AuthUser }> = ({ user }) => (
    <div className="max-w-xl">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Account Details</h3>
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">First Name</label>
                    <div className="w-full border border-black/30 h-12 px-4 font-mono text-sm flex items-center text-neutral-600 bg-neutral-50">
                        {user.first_name || '—'}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">Last Name</label>
                    <div className="w-full border border-black/30 h-12 px-4 font-mono text-sm flex items-center text-neutral-600 bg-neutral-50">
                        {user.last_name || '—'}
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
                <div className="w-full border border-black/30 h-12 px-4 font-mono text-sm flex items-center text-neutral-600 bg-neutral-50">
                    {user.email}
                </div>
            </div>
            <p className="text-xs font-mono text-neutral-400 uppercase">Profile editing available in a future update.</p>
        </div>
    </div>
);

const DownloadsTab: React.FC = () => (
    <div>
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Digital Downloads</h3>
        {/* Mocked for now as we don't have real digital products in the sandbox */}
        <div className="border border-black p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white">
                    <Download className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold uppercase text-sm">Surf Fishing Guide v2.0</h4>
                    <p className="text-xs font-mono text-neutral-500">PDF Document • 12.5 MB</p>
                </div>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest underline decoration-1 underline-offset-4">
                Download
            </button>
        </div>
    </div>
);

export default AccountPage;
