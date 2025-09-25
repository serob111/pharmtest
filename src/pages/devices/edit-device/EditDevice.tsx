import { useTranslation } from "react-i18next";
import Input from "../../../components/shared/ui/input/Input";
import { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Button from "../../../components/shared/ui/Button/baseBtn";
import { TCreateDeviceProp } from "../../../context/DeviceProvider";
import { useDevices } from "../../../hooks/useDevices";
import { IconMaterial } from "../../../components/shared/iconMaterial/IconMaterial";
import SelectInput from "../../../components/shared/ui/input/SelectInput";
import { useLocation } from "react-router";
import Modal from "../../../components/modal/Modal";

export default function EditDevice() {
  const { t } = useTranslation();
  const i18nEditDevice = (key: string, options?: Record<string, any>): string =>
    t(`edit-device.${key}`, options);

  const [formData, setFormData] = useState({} as TCreateDeviceProp)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const {
    alertMsgs,
    editDevice,
    fetchModels,
    deviceModels,
    deviceDetail,
    getDeviceDetail,
    deleteDevice
  } = useDevices()

  const { state } = useLocation()

  useEffect(() => {
    if (state.id) {
      fetchModels()
      getDeviceDetail(state.id)
    }
  }, [state.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await editDevice(deviceDetail?.id as number, formData);
      window.location.assign('/devices');
    } catch (error) {
      // Error handling is done in the hook
    }
  };
  
  useEffect(() => {
    if (deviceDetail) {
      setFormData({
        name: deviceDetail.name,
        model: String(deviceModels.find(elm => elm.name == deviceDetail.model)?.id),
        location: deviceDetail.department,
        config: {
          ip_address: deviceDetail.config.ip_address,
          port: deviceDetail.config.port
        }
      })
    }
  }, [state.id, deviceDetail])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const keys = field.split(".");
      let updated: any = { ...prev };

      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return updated;
    });
  };

  const handleCancel = () => {
    setIsOpenDeleteModal(false)
  }

  const handleSave = () => {
    deleteDevice(state.id || deviceDetail?.id)
    window.location.assign('/devices')
  }

  return (
    <>
      <div className="relative h-screen justify-between flex flex-col overflow-x-hidden">
        <div>
          <Header
            title={i18nEditDevice('edit-device')}
            crumbs={[{ path: '/devices/', name: i18nEditDevice('devices') }, { name: i18nEditDevice('edit-device'), path: '' }]}
          />

          <div className="w-full flex flex-col justify-between" >
            <div className=" flex items-center gap-2 px-4 py-3 bg-background-light-gray rounded-lg mt-4 mx-4 ">
              <IconMaterial
                icon="power_settings_new"
                className="cursor-pointer text-primeblue "
                size={20}
              />
              <span className="text-primary-dark text-sm">
                {i18nEditDevice('device-info')}
              </span>
            </div>
            <div className="w-1/2 p-5 flex flex-col gap-4">
              <div className="flex gap-3">
                <Input
                  important
                  required
                  name="device_name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  label={i18nEditDevice('device-name')}
                  placeholder={i18nEditDevice('enter-device-name')}
                  error={alertMsgs['name'] ? alertMsgs['name'][0] : ''}

                />
                <SelectInput
                  label={i18nEditDevice('model')}
                  important
                  required
                  options={deviceModels.map((dmod) => ({
                    id: dmod.id,
                    label: dmod.name
                  }))}
                  value={formData.model}
                  onChange={(value) => handleInputChange('model', value as string)}
                  placeholder="Select unit..."
                  searchable
                  name="model"
                  error={alertMsgs['model'] ? alertMsgs['model'][0] : ''}

                />
              </div>

              <Input
                important
                name="location"
                label={i18nEditDevice('location')}
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={i18nEditDevice('enter-location')}
                required
                error={alertMsgs['location'] ? alertMsgs['location'][0] : ''}

              />
            </div>
            <div className=" flex items-center gap-2 px-4 py-3 bg-background-light-gray rounded-lg mx-4 ">
              <IconMaterial
                icon="rss_feed"
                className="cursor-pointer text-primeblue "
                size={20}
              />
              <span className="text-primary-dark text-sm">
                {i18nEditDevice('connection-settings')}
              </span>
            </div>
            <div className="w-1/2 p-5 flex flex-col gap-4">
              <Input
                name="ip-address"
                label={i18nEditDevice('ip')}
                value={formData?.config?.ip_address}
                onChange={(e) => handleInputChange('config.ip_address', e.target.value)}
                placeholder="000.000.000.000"
                required
                error={alertMsgs?.config?.ip_address ? alertMsgs?.config?.ip_address : ''}
                helpText={i18nEditDevice('enter-ip')}
              />

              <Input
                name="port"
                type="number"
                label={i18nEditDevice('port')}
                value={formData?.config?.port}
                onChange={(e) => handleInputChange('config.port', e.target.value)}
                placeholder="e.g., 8080"
                required
                error={alertMsgs?.config?.port ? alertMsgs?.config?.port : ''}
                helpText={i18nEditDevice('enter-port')}

              />
            </div>

          </div>
        </div>
        <div className="w-full bg-gray-100 p-2 flex items-center justify-between">
          <Button
            onClick={() => { setIsOpenDeleteModal(true) }}
            type="button" variant="warning" size="md"  >
            {i18nEditDevice('remove')}
          </Button>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => { window.location.assign('/devices') }}
              type="button" variant="outline" size="md"  >
              {i18nEditDevice('cancel')}
            </Button>
            <Button

              type="submit"
              onClick={handleSubmit}
              size="md"
              className="bg-primary">
              {i18nEditDevice('save')}
            </Button>
          </div>
        </div>
      </div>
      <Modal
        headerClass='text-[32px]'
        isOpen={isOpenDeleteModal}
        onClose={handleCancel}
        title={i18nEditDevice('delete-device')}
        size="md"
      >
        <div className="px-6 py-4 space-y-6">
          <p className="text-md text-secondary-extralight font-montserrat">
            {i18nEditDevice('sure', { device: deviceDetail?.name })}
          </p>

        </div>
        <div className="flex bg-gray-100 justify-end gap-3 p-4">
          <Button
            size='sm'
            variant="outline"
            onClick={handleCancel}
          >
            {i18nEditDevice('cancel')}
          </Button>
          <Button
            size='md'
            onClick={handleSave}
          >
            {i18nEditDevice('yes-remove')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
