import Card from "../../../components/card/Card";
import Button from "../../../components/shared/ui/Button/baseBtn";
import { useDevices } from "../../../hooks/useDevices";

export default function DevaiceDetails({
    openDeleteModal,
    openConectionSettings
}: {
    openConectionSettings: () => void,
    openDeleteModal: () => void
}) {
    const { deviceDetail, selectedDevice, pingDevice } = useDevices()

    const handlePing = () => {
        if (selectedDevice?.id) {
            pingDevice(selectedDevice.id)
        }
    }
    
    // Use deviceDetail if available, otherwise fall back to selectedDevice
    const device = deviceDetail || selectedDevice;
    
    return (
        <>
            <div className=" h-full flex flex-col justify-between ">
                <div className="flex flex-col ">
                    <Card
                        className='mt-2 mx-4'
                        title='General Information'
                        items={
                            [{
                                label: 'name',
                                value: device?.name
                            },
                            {
                                label: 'Manufacturer',
                                value: device?.manufacturer
                            },
                            {
                                label: "Model",
                                value: device?.model
                            },
                            {
                                label: "Location",
                                value: device?.department
                            },
                            {
                                label: 'Date Added',
                                value: device?.created_stamp,
                            },
                            {
                                label: 'Added by',
                                value: device?.added_by,
                            }
                            ]}
                    />
                    <Card
                        titleClass='flex items-center justify-between bg-background-light-gray'
                        icon="settings"
                        onClick={openConectionSettings}
                        className='mt-2 mx-4'
                        title='Connection & Status'
                        items={
                            [{
                                label: 'IP Address',
                                value: device?.config?.ip_address
                            },
                            {
                                label: 'Port Number',
                                value: device?.config?.port
                            },
                            {
                                label: "Device Protocol",
                                value: device?.config?.protocol
                            },
                            {
                                label: "Last Health Check",
                                value: device?.last_health_check
                            },
                            {
                                label: 'Last Status Update',
                                value: device?.config?.applied_at
                            },
                            {
                                label: 'Status',
                                value: device?.status,
                            }
                            ]}
                    />
                </div>
                <div className=" w-full flex border-t bg-white  p-2 gap-2 z-50 justify-end">
                    <Button
                        variant="warning"
                        type="submit"
                        size="md"
                        onClick={openDeleteModal}
                    >
                        Deactivate
                    </Button>
                    <Button
                        type="submit"
                        size="md"
                        onClick={handlePing}
                    >
                        Ping Device
                    </Button>
                </div>
            </div>
        </>
    )
}
