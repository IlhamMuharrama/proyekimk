
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { UserType, UnsriFaculty } from '../types';
import { UNSRI_FACULTIES } from '../constants';

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState<UserType>(UserType.MAHASISWA);
    
    // Mahasiswa fields
    const [nim, setNim] = useState('');
    const [faculty, setFaculty] = useState<UnsriFaculty>(UNSRI_FACULTIES[0]);
    
    // Umum fields
    const [nik, setNik] = useState('');
    const [occupation, setOccupation] = useState('');

    const [error, setError] = useState('');
    const { register } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const commonDetails = { name, email, password, userType };
        let registrationData;

        if (userType === UserType.MAHASISWA) {
            if (!nim || !faculty) {
                setError("NIM dan Fakultas wajib diisi untuk mahasiswa.");
                return;
            }
            if (nim.length < 8 || !/^\d+$/.test(nim)) {
                setError("NIM harus berupa angka dan minimal 8 digit.");
                return;
            }
            registrationData = { ...commonDetails, nim, faculty };
        } else { // Umum
            if (!nik || !occupation) {
                setError("NIK dan Pekerjaan wajib diisi untuk umum.");
                return;
            }
             if (nik.length !== 16 || !/^\d+$/.test(nik)) {
                setError("NIK harus berupa 16 digit angka.");
                return;
            }
            registrationData = { ...commonDetails, nik, occupation };
        }

        const result = register(registrationData);
        if (result.success) {
            addToast('Pendaftaran berhasil! Silakan login.', 'success');
            onSwitchToLogin();
        } else {
            setError(result.message);
        }
    };
    
    const UserTypeSelector = () => (
        <div>
            <label className="block text-sm font-medium text-slate-300">Saya adalah</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setUserType(UserType.MAHASISWA)} className={`px-4 py-2 text-sm rounded-md border ${userType === UserType.MAHASISWA ? 'bg-primary border-primary text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
                    Mahasiswa
                </button>
                <button type="button" onClick={() => setUserType(UserType.UMUM)} className={`px-4 py-2 text-sm rounded-md border ${userType === UserType.UMUM ? 'bg-primary border-primary text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
                    Umum
                </button>
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {error && <p className="text-red-400 text-sm bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}

            <UserTypeSelector />

            <div>
                <label className="block text-sm font-medium text-slate-300">Nama Lengkap</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
            </div>
            
            {userType === UserType.MAHASISWA ? (
                <>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">NIM (Nomor Induk Mahasiswa)</label>
                        <input type="text" value={nim} onChange={(e) => setNim(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300">Fakultas (Universitas Sriwijaya)</label>
                         <select value={faculty} onChange={e => setFaculty(e.target.value as UnsriFaculty)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary">
                            {UNSRI_FACULTIES.map(fac => <option key={fac} value={fac}>{fac}</option>)}
                        </select>
                    </div>
                </>
            ) : (
                 <>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">NIK (Nomor Induk Kependudukan)</label>
                        <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300">Pekerjaan</label>
                        <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
                    </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-primary" />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-secondary">
                Daftar
            </button>
            <p className="text-sm text-center text-slate-400">
                Sudah punya akun?{' '}
                <button type="button" onClick={onSwitchToLogin} className="font-medium text-primary hover:text-sky-400">
                    Login di sini
                </button>
            </p>
        </form>
    );
};

export default RegisterForm;
