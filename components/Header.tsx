
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import PostServiceForm from './PostServiceForm';

interface HeaderProps {
    setCurrentPage: (page: 'home' | 'profile' | 'admin') => void;
    currentPage: string;
}

const NavLink: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    isMobile?: boolean;
}> = ({ onClick, isActive, children, isMobile = false }) => (
    <button
        onClick={onClick}
        className={`font-medium transition-colors duration-200 ${
            isMobile
                ? `block w-full text-left px-4 py-3 text-lg ${isActive ? 'bg-sky-500/20 text-sky-400' : 'text-slate-300 hover:bg-slate-700'}`
                : `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-sky-500/20 text-sky-400' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`
        }`}
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ setCurrentPage, currentPage }) => {
    const { user, logout } = useAuth();
    const [showPostServiceModal, setShowPostServiceModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = (page: 'home' | 'profile' | 'admin') => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false);
    };

    if (!user) return null; // Should not happen if App logic is correct, but as a safeguard.

    return (
        <>
            <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div
                                className="flex-shrink-0 text-white text-xl font-bold cursor-pointer"
                                onClick={() => navigate('home')}
                            >
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    KampusSkill
                                </span>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <NavLink onClick={() => navigate('home')} isActive={currentPage === 'home'}>
                                        Home
                                    </NavLink>
                                    <NavLink onClick={() => navigate('profile')} isActive={currentPage === 'profile'}>
                                        Profil Saya
                                    </NavLink>
                                    {user.role === 'admin' && (
                                        <NavLink onClick={() => navigate('admin')} isActive={currentPage === 'admin'}>
                                            Panel Admin
                                        </NavLink>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                             <button
                                onClick={() => setShowPostServiceModal(true)}
                                className="mr-4 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg shadow-md hover:scale-105 transform transition-transform duration-200"
                            >
                                + Posting Jasa
                            </button>
                            <div className="hidden md:block">
                                <div className="flex items-center">
                                    <span className="text-slate-300 mr-4 hidden sm:block">Hai, {user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="px-3 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            <div className="md:hidden">
                                <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-300 hover:text-white p-2" aria-label="Buka menu">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-50 transform transition-transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)}></div>
                <div className="relative bg-slate-800 w-72 h-full ml-auto p-4 flex flex-col">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="self-end p-2 text-slate-400 hover:text-white" aria-label="Tutup menu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <nav className="mt-8 flex-grow">
                        <NavLink onClick={() => navigate('home')} isActive={currentPage === 'home'} isMobile>Home</NavLink>
                        <NavLink onClick={() => navigate('profile')} isActive={currentPage === 'profile'} isMobile>Profil Saya</NavLink>
                        {user.role === 'admin' && (
                             <NavLink onClick={() => navigate('admin')} isActive={currentPage === 'admin'} isMobile>Panel Admin</NavLink>
                        )}
                    </nav>
                    <div className="py-4 border-t border-slate-700">
                        <div>
                            <p className="px-4 text-slate-400">Login sebagai</p>
                            <p className="px-4 font-semibold text-white mb-4">{user.name}</p>
                            <button
                                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                className="w-full text-left px-4 py-3 text-lg font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={showPostServiceModal} onClose={() => setShowPostServiceModal(false)} title="Posting Jasa Baru">
                <PostServiceForm onSuccess={() => setShowPostServiceModal(false)} />
            </Modal>
        </>
    );
};

export default Header;
