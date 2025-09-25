import React, { useEffect, useRef } from 'react';
import { IconMaterial } from '../shared/iconMaterial/IconMaterial';
import Alert, { AlertType } from '../alert/Alert';
import { useDashboard } from '../../context/DashboardProvider';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    headerClass?:string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    headerClass='',
    className = '',
    size = 'md'
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { alertMsgs, closeUpdateModal, setCloseUpdateModal } = useDashboard();

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        if (closeUpdateModal) {
            setCloseUpdateModal(false)
            onClose()
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, closeUpdateModal]);



    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'max-w-sm';
            case 'lg':
                return 'max-w-2xl';
            case 'xl':
                return 'max-w-5xl h-full ';
            case 'md':
            default:
                return 'max-w-[600px] ';
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 py-8 flex  items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
            <div
                ref={modalRef}
                className={`w-full ${getSizeClasses()} mx-4 overflow-hidden bg-white rounded-2xl shadow-xl transform transition-all ${className}`}
            >
                <div className={`flex items-center w-full  justify-between px-6  ${headerClass} pt-4`}>
                    <h2 className={` font-semibold text-primary-dark font-montserrat `}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                    >
                        <IconMaterial
                            filled
                            icon='close'
                            className="cursor-pointer"
                            size={20}
                            iconColor="var(--tokens-text-secondary-text)"
                            onClick={() => onClose()}
                        />
                    </button>
                </div>
                {Object.keys(alertMsgs).length > 0 && (
                    <Alert type={AlertType.ERROR}>
                        <ul>
                            {Object.entries(alertMsgs).map(([field, messages]) =>
                                messages?.map((msg, i) => (
                                    <li key={`${field}-${i}`}>
                                        <strong>{field}:</strong> {msg}
                                    </li>
                                ))
                            )}
                        </ul>
                    </Alert>
                )}

                {children}
            </div>
        </div>
    );
};


export default Modal;