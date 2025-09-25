import React, { useState } from "react";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";
import { useTranslation } from "react-i18next";

interface AccordeonProps {
    event?: string;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const Accordeon: React.FC<AccordeonProps> = ({
    title,
    subtitle,
    children,
    event,
    defaultOpen = false,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const { t } = useTranslation()
    const i18nOrderDirectory = (key: string): string =>
        t(`orders-directory.${key}`);
    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                    <div
                        className="py-4 bg-background-light-gray cursor-pointer flex justify-between pr-4 rounded-xl transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="flex items-center">
                            <div className="flex items-center">
                                {isOpen ? (
                                    <IconMaterial
                                        filled
                                        icon="expand_less"
                                        className="cursor-pointer ml-4 text-primeblue"
                                        size={20}
                                    />
                                ) : (
                                    <IconMaterial
                                        filled
                                        icon="expand_more"
                                        className="cursor-pointer ml-4 text-primeblue"
                                        size={20}
                                    />
                                )}
                            </div>
                            <div className="gap-4 items-center flex-1 px-4">
                                <div className="w-full flex justify-between">
                                    <span className="w-full flex text-primary-dark items-center gap-2 text-sm">
                                        {title}
                                    </span>
                                    {subtitle && (
                                        <span className="text-secondary-extralight text-xs">
                                            {subtitle}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {
                            event &&
                            <div className="flex gap-1 font-medium items-center text-sm text-primary-light">
                                <IconMaterial
                                    filled
                                    icon="history"
                                    className="cursor-pointer text-primary-light"
                                    size={20}
                                />
                                <span className='text-secondary-extralight font-normal'>{i18nOrderDirectory('event-type')}</span>: {event}
                            </div>
                        }
                    </div>

                    {isOpen && (
                        <div className="p-4 text-sm text-gray-700 bg-white">{children}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Accordeon;
