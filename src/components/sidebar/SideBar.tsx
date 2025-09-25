import React, { useState } from 'react';
import Line from '../../assets/line.svg?react'
import Logo from '../../assets/logo.svg?react'
import LogoPlus from '../../assets/logoplus.svg?react'
import { useTranslation } from 'react-i18next';
import { IconMaterial } from '../shared/iconMaterial/IconMaterial';
import { useLocation, useNavigate } from 'react-router';
import { useDashboard } from '../../context/DashboardProvider';


interface SidebarItem {
    id: string;
    label: string;
    icon: string;
    active?: boolean;
    path: string
}

interface SidebarProps {
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { t } = useTranslation()
    const i18nUsersTable = (key: string): string =>
        t(`sideBar.items.${key}`);
    const navigate = useNavigate()
    const location = useLocation();
    const { setLoading } = useDashboard()
    const [activeItem, setActiveItem] = useState(() => {
        const path = location.pathname;

        if (path.includes('/orders')) return 'orders';
        if (path.includes('/prescriptions')) return 'prescriptions';
        if (path.includes('/medicationdirectory')) return 'medication';
        if (path.includes('/devices')) return 'equipment';
        if (path.includes('/users')) return 'users';
        if (path.includes('/activity-log')) return 'activity';
        if (path.includes('/settings')) return 'settings';

        return '';
    });
    const sidebarItems: SidebarItem[] = [
        {
            id: 'orders',
            label: i18nUsersTable('orders'),
            icon: 'all_inbox',
            path: '/orders'
        },
        {
            id: 'prescriptions',
            label: i18nUsersTable('prescriptions'),
            icon: 'receipt',
            path: '/prescriptions'
        },
        {
            id: 'medication',
            label: i18nUsersTable('med-directory'),
            icon: 'auto_stories',
            path: '/medicationdirectory'
        },
        {
            id: 'equipment',
            label: i18nUsersTable('equipment'),
            icon: "route",
            path: '/devices'

        },
        {
            id: 'users',
            label: i18nUsersTable('users'),
            icon: 'people_alt',
            active: true,
            path: '/users'
        },
        {
            id: 'activity',
            label: i18nUsersTable('activity-log'),
            icon: "access_time",
            path: '/activity'
        }
    ];

    const handleItemClick = (itemId: string, path: string) => {
        setActiveItem(itemId);
        navigate(path)
        setLoading(true)
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`relative fixed h-screen px-3 bg-darkblue ${isCollapsed ? 'w-16' : 'w-64'
            } ${className}`}>

            <div className='w-full flex flex-col  items-center justify-center my-[12px]'>
                <div className='w-full relative '>
                    <div className='flex  gap-2'>
                        <div className='w-full flex items-center p-2 rounded-2xl bg-white-transparent'>
                            <LogoPlus />
                            {
                                !isCollapsed &&
                                <Logo />
                            }
                        </div>
                    </div>
                    <button
                        onClick={toggleCollapse}
                        className=" absolute bottom-[0] -right-6 z-10 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center transition-colors"
                    >
                        <IconMaterial
                            filled
                            icon='keyboard_double_arrow_left'
                            className="cursor-pointer"
                            size={20}
                            iconColor="var(--tokens-text-secondary-text)"

                        />
                    </button>
                </div>
            </div>

            <Line className='my-2' />

            <nav className="">
                <ul className="space-y-2 ">
                    {sidebarItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => handleItemClick(item.id, item.path)}
                                className={`w-full flex  gap-3 px-3 py-3 rounded-lg transition-all duration-200 font-montserrat ${activeItem === item.id
                                    ? 'bg-blue-700/50 text-white'
                                    : 'text-blue-100 hover:bg-blue-700/30 hover:text-white'
                                    }`}
                            >
                                <div className="flex-shrink-0">
                                    <IconMaterial
                                        filled
                                        icon={item.icon}
                                        className="cursor-pointer"
                                        size={20}
                                        iconColor="var(--tokens-text-secondary-text)"
                                    />
                                </div>
                                {!isCollapsed && (
                                    <span className="text-sm text-start font-medium">{item.label}</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-3 absolute w-full  gap-4 bottom-0 flex flex-col">
                <Line />
                <button
                    onClick={() => handleItemClick('settings', '/path')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 font-montserrat ${activeItem === 'settings'
                        ? 'bg-blue-700/50 text-white'
                        : 'text-blue-100 hover:bg-blue-700/30 hover:text-white'
                        }`}
                >

                    <IconMaterial
                        filled
                        icon={'settings'}
                        className="cursor-pointer"
                        size={20}
                        iconColor="var(--tokens-text-secondary-text)"
                    />
                    {!isCollapsed && (
                        <span className="text-sm font-medium">Settings</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;