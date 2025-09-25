import React, { ReactNode } from 'react';
import AppLogo from '../components/applogo/AppLogo';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-shared relative flex justify-end">
            <AppLogo />
            {children}
            <div className="text-center absolute left-8 bottom-5 justify-start text-white text-xs leading-none">by Medical Technologies</div>
        </div>
    );
}
