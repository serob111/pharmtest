import React, { useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import Button from '../shared/ui/Button/baseBtn';
import Input from '../shared/ui/input/Input';
import { useTranslation } from 'react-i18next';


export interface UpdateNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFirstName: string;
    currentLastName: string;
    onSave: (firstName: string, lastName: string) => void;
}

const UpdateNameModal: React.FC<UpdateNameModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {


    const handleSave = async () => {
    };

    const handleCancel = () => {

        onClose();
    };

   
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={''}
            size="xl"
        >
            <div className="px-6 py-4 space-y-6">
                <p className="text-sm text-secondary-extralight font-montserrat">
                </p>
            </div>
            <div className="flex bg-gray-100 justify-end gap-3 p-4">
                <Button
                    size='sm'
                    variant="outline"
                    onClick={handleCancel}
                // disabled={isLoading}
                >
                    cancel
                </Button>
                <Button
                    size='sm'
                    onClick={handleSave}
                >
                    save
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateNameModal;