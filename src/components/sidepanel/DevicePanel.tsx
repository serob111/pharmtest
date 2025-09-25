import React, { useEffect, useState } from 'react';
import { IconMaterial } from '../shared/iconMaterial/IconMaterial';
import { useDevices } from '../../hooks/useDevices';
import { TabPanel } from '../tab-panel/TabPanel';
import Modal from '../modal/Modal';
import Button from '../shared/ui/Button/baseBtn';
import { useTranslation } from 'react-i18next';
import UpdateConnectionSettingsModal from '../connection-settings-modal/UpdateConnectionSettingsModal';
import { useLocation, useNavigate } from 'react-router';

export interface DevicePanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const DevicePanel: React.FC<DevicePanelProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenConnectionSettings, setIsOpenConnectionSettings] = useState(false)
  const navigate = useNavigate()
  const {
    selectedDevice,
    getDeviceDetail,
    deactivateDevice,
    deviceDetail,
  } = useDevices()

  useEffect(() => {
    if (selectedDevice) {
      getDeviceDetail(selectedDevice.id)
    }
  }, [selectedDevice?.id])

  const handleCancel = () => {
    setIsOpenDeleteModal(false)
  }
  const openDeleteModal = () => {
    setIsOpenDeleteModal(true)
  }
  const handleSave = () => {
    if (deviceDetail?.id) {
      deactivateDevice(deviceDetail.id)
      setIsOpenDeleteModal(false)
    }
  }
  const handleEdit = () => {
    navigate("/devices/editing", {
      state: { id: selectedDevice?.id }
    });
  };
  

  const { t } = useTranslation()

  const i18nDeviceDirectory = (key: string): string =>
    t(`device-directory.${key}`);

  return (
    <>
    <div
      className={`top-0 right-0 w-[460px] bg-white border-l transform transition-transform duration-300 ease-in-out z-40 h-full flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${className}`}
    >
      <div className="flex-shrink-0 p-4 flex items-center justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-lightblue rounded-lg flex items-center justify-center">
            <IconMaterial
              filled
              icon="route"
              className="cursor-pointer text-primeblue"
              size={20}
            />
          </div>
          <div>
            <h2
              className="text-lg font-semibold text-gray-900 font-montserrat  truncate max-w-[250px]"
              title={selectedDevice?.name}
            >
              {selectedDevice?.name}
            </h2>
            <p className="text-sm text-gray-600 font-montserrat">
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
        <div
              onClick={handleEdit}
              className="p-2 text-gray-400 flex items-center justify-center border  hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <IconMaterial
                filled
                icon="edit"
                className="cursor-pointer"
                size={20}
              />
            </div>
          <div
            className="p-2 text-gray-400 flex items-center justify-center border  hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <IconMaterial
              filled
              icon="close"
              className="cursor-pointer"
              size={20}
              onClick={onClose}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <TabPanel
          openConectionSettings={() => setIsOpenConnectionSettings(true)}
          openDeleteModal={openDeleteModal}
          deviceName={''}
          events={[]}
        />
      </div>
    </div>
    <UpdateConnectionSettingsModal
      isOpen={isOpenConnectionSettings}
      onClose={() => setIsOpenConnectionSettings(false)}
    />
    <Modal
      headerClass='text-[32px]'
      isOpen={isOpenDeleteModal}
      onClose={handleCancel}
      title={i18nDeviceDirectory('deactivate-device')}
      size="md"
    >
      <div className="px-6 py-4 space-y-6">
        <p className="text-md text-secondary-extralight font-montserrat">
          Are you sure you want to deactivate this device? It will become unavailable for all operations until reactivated.
        </p>

      </div>
      <div className="flex bg-gray-100 justify-end gap-3 p-4">
        <Button
          size='sm'
          variant="outline"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          size='md'
          onClick={handleSave}
        >
          Yes, Deactivate
        </Button>
      </div>
    </Modal>
  </>
  );
};

export default DevicePanel;