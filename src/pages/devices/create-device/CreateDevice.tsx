import { useTranslation } from "react-i18next";
import Input from "../../../components/shared/ui/input/Input";
import { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Alert from "../../../components/alert/Alert";
import Button from "../../../components/shared/ui/Button/baseBtn";
import { useDevices } from "../../../hooks/useDevices";
import { IconMaterial } from "../../../components/shared/iconMaterial/IconMaterial";
import SelectInput from "../../../components/shared/ui/input/SelectInput";

export default function CreateDevice() {
  const { t } = useTranslation();
  const i18nCreateDevice = (key: string): string =>
    t(`create-device.${key}`);
  const [submitted, setSubmitted] = useState(false);
  const [device_name, setDeviceName] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [ip, setIp] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const { alertMsgs, createDevice, fetchModels, deviceModels } = useDevices()

  useEffect(() => {
    fetchModels()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    try {
      await createDevice({
        model,
        name: device_name,
        location,
        config: {
          ip_address: ip,
          port: +port
        },
      });
      window.location.assign('/devices');
    } catch (error) {
      // Error handling is done in the hook
    }
  };


  return (
    <div className="relative h-screen justify-between flex flex-col overflow-x-hidden">

      <div>
        <Header
          title={i18nCreateDevice('create-device')}
          crumbs={[{ path: '/devices/', name: i18nCreateDevice('devices') }, { name: i18nCreateDevice('adding-device'), path: '' }]}
        />

        <div className="w-full flex flex-col justify-between" >
          <div className=" flex items-center gap-2 px-4 py-3 bg-background-light-gray rounded-lg mt-4 mx-4 ">
            <IconMaterial
              icon="power_settings_new"
              className="cursor-pointer text-primeblue "
              size={20}
            />
            <span className="text-primary-dark text-sm">
              {i18nCreateDevice('device-info')}
            </span>
          </div>
          <div className="w-1/2 p-5 flex flex-col gap-4">
            <div className="flex gap-3">
              <Input
                important
                required
                name="device_name"
                value={device_name}
                onChange={(e) => setDeviceName(e.target.value)}
                label={i18nCreateDevice('device-name')}
                placeholder={i18nCreateDevice('enter-device-name')}
                error={alertMsgs['name'] ? alertMsgs['name'][0] : ''}

              />
              <SelectInput
                label={i18nCreateDevice('model')}
                important
                required
                options={deviceModels.map((dmod) => ({
                  id: dmod.id,
                  label: dmod.name
                }))}
                value={model}
                onChange={(value) => setModel(value as string)}
                placeholder="Select unit..."
                searchable
                name="model"
                error={alertMsgs['model'] ? alertMsgs['model'][0] : ''}
              />
            </div>

            <Input
              important
              name="location"
              label={i18nCreateDevice('location')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={i18nCreateDevice('enter-location')}
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
              {i18nCreateDevice('connection-settings')}
            </span>
          </div>
          <div className="w-1/2 p-5 flex flex-col gap-4">
            <Input
              name="ip-address"
              label={i18nCreateDevice('ip')}
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="000.000.000.000"
              required
              error={alertMsgs?.config?.ip_address ? alertMsgs?.config?.ip_address : ''}

            />

            <Input
              name="port"
              type="number"
              label={i18nCreateDevice('port')}
              value={port || ''}
              onChange={(e) => setPort(e.target.value)}
              placeholder="e.g., 8080"
              required
              error={alertMsgs?.config?.port ? alertMsgs?.config?.port : ''}

            />
          </div>

        </div>
      </div>
      <div className="w-full bg-gray-100 p-2 flex items-center gap-4 justify-end">
        <Button
          onClick={() => { window.location.assign('/devices') }}
          type="button" variant="outline" size="md"  >
          {i18nCreateDevice('cancel')}
        </Button>
        <Button
          disabled={!device_name || !model || !location }
          type="submit"
          onClick={handleSubmit}
          size="md"
          className="bg-primary">
          {i18nCreateDevice('create')}
        </Button>
      </div>
    </div>
  );
}
