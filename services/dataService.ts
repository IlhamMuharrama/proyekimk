import { User, Service, UserType } from '../types';

const DUMMY_USERS: User[] = [
    {
        id: 'admin_1',
        name: 'Admin KampusSkill',
        email: 'balakosong@admin.com',
        nim: '00000000',
        passwordHash: '000000',
        isVerified: true,
        role: 'admin',
        // FIX: Replaced string literal 'Umum' with UserType.UMUM enum member to match the User interface type.
        userType: UserType.UMUM,
        status: 'active'
    }
];

const DUMMY_SERVICES: Service[] = [];

export const getInitialData = () => {
    try {
        // --- User Data Handling ---
        const usersData = localStorage.getItem('users');
        let initialUsers = DUMMY_USERS;
        if (!usersData) {
            localStorage.setItem('users', JSON.stringify(DUMMY_USERS));
        } else {
            initialUsers = JSON.parse(usersData);
        }

        // --- Service Data Handling ---
        const servicesData = localStorage.getItem('services');
        let initialServices: Service[] = [];

        if (!servicesData) {
            localStorage.setItem('services', JSON.stringify(DUMMY_SERVICES));
            initialServices = DUMMY_SERVICES;
        } else {
            const storedServices: Service[] = JSON.parse(servicesData);
            // Ensure `visits` array exists for any data structure from previous versions
            initialServices = storedServices.map(s => ({ ...s, visits: s.visits || [] }));
        }
        
        return { users: initialUsers, services: initialServices };

    } catch (error) {
        console.error("Gagal memproses data localStorage, mereset ke default.", error);
        localStorage.setItem('users', JSON.stringify(DUMMY_USERS));
        localStorage.setItem('services', JSON.stringify(DUMMY_SERVICES));
        return { users: DUMMY_USERS, services: DUMMY_SERVICES };
    }
};


export const saveData = (key: 'users' | 'services', data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save data for key: ${key}`, error);
    }
};