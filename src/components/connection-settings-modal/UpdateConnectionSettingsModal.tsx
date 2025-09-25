import React, { useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import Button from '../shared/ui/Button/baseBtn';
import Input from '../shared/ui/input/Input';
import { IconMaterial } from '../shared/iconMaterial/IconMaterial';
import SelectInput from '../shared/ui/input/SelectInput';
import { TConnectionDetails } from '../../context/DeviceProvider';
import { useDevices } from '../../hooks/useDevices';
import { useTranslation } from 'react-i18next';
import { apiTestConnection } from '../../api/devices/devices';

export interface UpdateConnectionsSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpdateConnectionSettingsModal: React.FC<UpdateConnectionsSettingsModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { t } = useTranslation()
    const i18nDeviceDirectory = (key: string): string =>
        t(`device-directory.connection.${key}`);
    const {
        selectedDevice,
        getConnectionSettings,
        connectionDetails,
        alertMsgs,
        updateConnectionSettings,
    } = useDevices()
    const [formData, setFormData] = useState({} as TConnectionDetails);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsLoading(false);
    };

    const handleCancel = () => {
        setFormData(connectionDetails);
        onClose?.();
    };

    const handleSave = async () => {
        if (selectedDevice?.id) {
            try {
                await updateConnectionSettings(selectedDevice.id, formData);
                onClose();
            } catch (error) {
                // Error handling is done in the hook
            }
        }

    };

    useEffect(() => {
        if (selectedDevice?.id) {
            getConnectionSettings(selectedDevice.id)
        }
    }, [selectedDevice?.id])
    
    useEffect(() => {
        if (connectionDetails) {
            setFormData(connectionDetails)
        }
    }, [connectionDetails])
    if (!isOpen) return null;
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            className="flex flex-col"
            title={i18nDeviceDirectory('connection-settings-title') + ' ' + selectedDevice?.name}
            size="xl"
            headerClass="bg-background-light-gray pb-4 text-primary-dark text-lg font-normal"
        >
            <div className="flex-1 overflow-y-auto bg-white">
                <form onSubmit={handleSubmit} className="divide-y">
                    <div className="px-6">
                        <div className="space-y-2 border-b p-4">
                            <h3 className="text-md font-semibold text-primary-dark">{i18nDeviceDirectory('network')}</h3>
                            <p className="text-sm text-secondary-extralight">
                                {i18nDeviceDirectory('network-desc')}
                            </p>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] items-center border-b text-sm text-primary-dark gap-8">
                            <p className="font-medium">{i18nDeviceDirectory('connection-name')}</p>
                            <Input
                                className="w-full max-w-[520px]"
                                value={formData.connection_name}
                                onChange={(e) => handleInputChange('connection_name', e.target.value)}
                                placeholder={i18nDeviceDirectory('connection-name-placeholder')}
                            />
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] border-b text-sm text-primary-dark gap-8">
                            <p className="font-medium">{i18nDeviceDirectory('network')}</p>
                            <div className="flex gap-5">
                                <div className="flex flex-col gap-2 relative">
                                    <div className="flex items-center gap-1">
                                        <label className="text-sm font-medium">{i18nDeviceDirectory('host-ip')}</label>
                                        <div className="relative group">
                                            <IconMaterial
                                                icon="info"
                                                className="cursor-pointer mt-1 text-custom-blue group-hover:text-blue-700"
                                                size={16}
                                                iconColor="var(--tokens-text-secondary-text)"
                                            />
                                            <div className="absolute top-0 left-5 z-10 w-64 p-2 bg-strongblue text-white text-xs rounded shadow-lg hidden group-hover:block">
                                                {i18nDeviceDirectory('host-ip-desc')}
                                            </div>
                                        </div>
                                    </div>
                                    <Input
                                        className="min-w-[250px]"
                                        value={formData.ip_address}
                                        onChange={(e) => handleInputChange('ip_address', e.target.value)}
                                        error={alertMsgs['ip_address'] ? alertMsgs['ip_address'][0] : ''}

                                    />
                                </div>

                                <div className="flex flex-col gap-2 relative">
                                    <div className="flex items-center gap-1">
                                        <label className="text-sm font-medium">{i18nDeviceDirectory('port')}</label>
                                        <div className="relative group">
                                            <IconMaterial
                                                icon="info"
                                                className="cursor-pointer mt-1 text-custom-blue group-hover:text-blue-700"
                                                size={16}
                                                iconColor="var(--tokens-text-secondary-text)"
                                            />
                                            <div className="absolute top-0 left-5 z-10 w-64 p-2 bg-strongblue text-white text-xs rounded shadow-lg hidden group-hover:block">
                                                {i18nDeviceDirectory('port-desc')}
                                            </div>
                                        </div>
                                    </div>
                                    <Input
                                        className="min-w-[250px]"
                                        value={formData.port}
                                        onChange={(e) => handleInputChange('port', e.target.value)}
                                        error={alertMsgs['port'] ? alertMsgs['port'][0] : ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6">
                        <div className="space-y-2 border-b p-4">
                            <h3 className="text-md font-semibold text-primary-dark">{i18nDeviceDirectory('authentication')}</h3>
                            <p className="text-sm text-secondary-extralight">
                                {i18nDeviceDirectory('authentication-desc')}
                            </p>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] items-center border-b text-sm text-primary-dark gap-8">
                            <p className="font-medium">{i18nDeviceDirectory('username')}</p>
                            <Input
                                className="w-full max-w-[520px]"
                                value={formData.auth_username}
                                onChange={(e) => handleInputChange('auth_username', e.target.value)}
                                error={alertMsgs['auth_username'] ? alertMsgs['auth_username'][0] : ''}
                            />
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] items-center border-b text-sm text-primary-dark gap-8">
                            <p className="font-medium">{i18nDeviceDirectory('password')}</p>
                            <Input
                                type="password"
                                className="w-full max-w-[520px]"
                                value={formData.auth_password}
                                onChange={(e) => handleInputChange('auth_password', e.target.value)}
                                error={alertMsgs['auth_password'] ? alertMsgs['auth_password'][0] : ''}
                            />
                        </div>
                    </div>

                    <div className="px-6">
                        <div className="space-y-2 border-b p-4">
                            <h3 className="text-md font-semibold text-primary-dark">{i18nDeviceDirectory('advanced')}</h3>
                            <p className="text-sm text-secondary-extralight">
                                {i18nDeviceDirectory('advanced-desc')}
                            </p>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] border-b text-sm text-primary-dark gap-8">
                            <p className="font-medium">{i18nDeviceDirectory('timeouts')}</p>
                            <div className="flex gap-5">
                                <div className="flex flex-col gap-2 relative">
                                    <div className="flex items-center gap-1">
                                        <label className="text-sm font-medium">{i18nDeviceDirectory('connection-ms')}</label>
                                    </div>
                                    <Input
                                        className="min-w-[250px]"
                                        value={formData.connection_timeout}
                                        onChange={(e) => handleInputChange('connection_timeout', e.target.value)}
                                        type="number"
                                        error={alertMsgs['connection_timeout'] ? alertMsgs['connection_timeout'][0] : ''}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 relative">
                                    <div className="flex items-center gap-1">
                                        <label className="text-sm font-medium">{i18nDeviceDirectory('read-ms')}</label>
                                    </div>
                                    <Input
                                        className="min-w-[250px]"
                                        value={formData.read_timeout}
                                        onChange={(e) => handleInputChange('read_timeout', e.target.value)}
                                        type="number"
                                        error={alertMsgs['read_timeout'] ? alertMsgs['read_timeout'][0] : ''}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] border-b text-sm text-primary-dark gap-8">
                            <p className="font-medium">{i18nDeviceDirectory('retries')}</p>
                            <div className="flex gap-5">
                                <div className="flex flex-col gap-2 relative">
                                    <div className="flex items-center gap-1">
                                        <label className="text-sm font-medium">{i18nDeviceDirectory('count')}</label>
                                    </div>
                                    <Input
                                        className="min-w-[250px]"
                                        value={formData.retries}
                                        onChange={(e) => handleInputChange('retries', e.target.value)}
                                        type="number"
                                        error={alertMsgs['retries'] ? alertMsgs['retries'][0] : ''}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 relative">
                                    <div className="flex items-center gap-1">
                                        <label className="text-sm font-medium">{i18nDeviceDirectory('backoff-strategy')}</label>
                                    </div>
                                    <SelectInput
                                        placeholder={i18nDeviceDirectory('select-strategy')}
                                        value={formData.backoff_strategy}
                                        className="min-w-[250px]"
                                        onChange={(value) => handleInputChange('backoff_strategy', value as string)}
                                        options={[{ id: 'linear', label: "Linear" }]}
                                        error={alertMsgs['backoff_strategy'] ? alertMsgs['backoff_strategy'][0] : ''}
                                    />

                                </div>
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] border-b text-sm text-primary-dark gap-8">
                            <p className="font-medium">{i18nDeviceDirectory('health-check')}</p>
                            <div className="flex gap-5 ">
                                <div className="flex flex-col gap-3 relative">
                                    <div className="flex items-center gap-1">
                                        <label className="text-sm font-medium">{i18nDeviceDirectory('interval')}</label>
                                    </div>
                                    <Input
                                        type='number'
                                        className="min-w-[250px]"
                                        value={formData.keep_alive_interval}
                                        onChange={(e) => handleInputChange('keep_alive_interval', e.target.value)}
                                        error={alertMsgs['keep_alive_interval'] ? alertMsgs['keep_alive_interval'][0] : ''}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 relative">
                                    <div className="flex items-center gap-1">
                                        <label className="text-sm font-medium">{i18nDeviceDirectory("failure-threshold")}</label>
                                        <div className="relative group">
                                            <IconMaterial
                                                icon="info"
                                                className="cursor-pointer mt-1 text-custom-blue group-hover:text-blue-700"
                                                size={16}
                                                iconColor="var(--tokens-text-secondary-text)"
                                            />
                                            <div className="absolute top-0 left-5 z-10 w-64 p-2 bg-strongblue text-white text-xs rounded shadow-lg hidden group-hover:block">
                                                {i18nDeviceDirectory('failure-desc')}
                                            </div>
                                        </div>
                                    </div>
                                    <Input
                                        type='number'
                                        className="min-w-[250px]"
                                        value={formData.failure_threshold}
                                        onChange={(e) => handleInputChange('failure_threshold', e.target.value)}
                                        error={alertMsgs['failure_threshold'] ? alertMsgs['failure_threshold'][0] : ''}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-[12rem_1fr] items-center border-b text-sm text-primary-dark gap-8">
                            <p className="font-medium">{i18nDeviceDirectory('description')}</p>
                            <Input
                                className="w-full max-w-[520px]"
                                placeholder={i18nDeviceDirectory('enter-details')}
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                error={alertMsgs['description'] ? alertMsgs['description'][0] : ''}

                            />
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex items-center justify-between gap-3 p-4 border-t bg-background-light-gray sticky bottom-0 z-10">
                <div className='flex gap-4'>
                    <div onClick={() => apiTestConnection(selectedDevice?.id as number)} className='flex gap-2 text-sm cursor-pointer items-center items-center text-primeblue'>
                        <IconMaterial
                            icon="power_settings_new"
                            className="cursor-pointer text-custom-blue group-hover:text-blue-700"
                            size={20}
                            iconColor="var(--tokens-text-secondary-text)"
                        />
                        <p className=''>
                            {i18nDeviceDirectory('test-connection')}
                        </p>
                    </div>
                    <div className='flex text-sm gap-2 items-center cursor-pointer text-primeblue'>
                        <IconMaterial
                            icon="restart_alt"
                            className="cursor-pointer  text-custom-blue group-hover:text-blue-700"
                            size={20}
                            iconColor="var(--tokens-text-secondary-text)"
                        />
                        <p>
                            {i18nDeviceDirectory('reset-to-defaults')}
                        </p>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {i18nDeviceDirectory('cancel')}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? i18nDeviceDirectory('saving') : i18nDeviceDirectory('save')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateConnectionSettingsModal;