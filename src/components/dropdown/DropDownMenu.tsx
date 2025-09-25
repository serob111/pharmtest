import React, { useState, useRef, useEffect } from 'react';
import { IconMaterial } from '../shared/iconMaterial/IconMaterial';


export interface DropdownMenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
}

export interface DropdownMenuProps {
    items?: DropdownMenuItem[];
    onDetailView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
    buttonClassName?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    items,
    onDetailView,
    onEdit,
    onDelete,
    className = '',
    buttonClassName = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const defaultItems: DropdownMenuItem[] = [
        {
            id: 'detail',
            label: 'Detail View',
            icon:
                <IconMaterial
                    icon="loupe"
                    className="cursor-pointer "
                    size={20}
                />,
            onClick: () => {
                onDetailView?.();
                setIsOpen(false);
            },
        },
        {
            id: 'edit',
            label: 'Edit',
            icon:
                <IconMaterial
                    icon="edit"
                    className="cursor-pointer "
                    size={20}
                />,
            onClick: () => {
                onEdit?.();
                setIsOpen(false);
            }
        },
    ];

    const menuItems = items || defaultItems;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div
        className={`relative ${className}`}
        ref={dropdownRef}
      >
            <button
                onClick={handleToggle}
                className={`w-8 h-8 p-2 bg-white rounded-lg border border-gray-300 flex justify-center items-center hover:bg-gray-50 transition-colors ${buttonClassName}`}
            >
                <IconMaterial
                    filled
                    icon='more_vert'
                    className="cursor-pointer"
                    size={20}
                    iconColor="text-black"
                />
            </button>

            {isOpen && (
                <div style={{zIndex:1000}}  className="absolute right-9  w-48 bg-white w-48 bg-white rounded-lg shadow-lg border border-gray-200  py-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={item.onClick}
                            className={`w-full   text-secondary-dark hover:text-primeblue px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${item.className || ''}`}

                        >
                            <div className="flex-shrink-0  ">
                                {item.icon}
                            </div>
                            <span className="font-medium font-montserrat   text-sm">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;