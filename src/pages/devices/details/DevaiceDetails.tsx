import Card from "../../../components/card/Card";
import Button from "../../../components/shared/ui/Button/baseBtn";
import { useDevices } from "../../../context/DeviceProvider";

export default function DevaiceDetails({
    openDeleteModal,
    openConectionSettings
}: {
    openConectionSettings: () => void,
    openDeleteModal: () => void
}) {
    const { deviceDetail, pingDevice } = useDevices()

    const handlePing = () => {
        if (deviceDetail?.id) {
            pingDevice(deviceDetail?.id)
        }
    }
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
                                value: deviceDetail?.name
                            },
                            {
                                label: 'Manufacturer',
                                value: deviceDetail?.manufacturer
                            },
                            {
                                label: "Model",
                                value: deviceDetail?.model
                            },
                            {
                                label: "Location",
                                value: deviceDetail?.department
                            },
                            {
                                label: 'Date Added',
                                value: deviceDetail?.created_stamp,
                            },
                            {
                                label: 'Added by',
                                // @ts-ignore
                                value: deviceDetail?.added_by,
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
                                value: deviceDetail?.config?.ip_address
                            },
                            {
                                label: 'Port Number',
                                value: deviceDetail?.config?.port
                            },
                            {
                                label: "Device Protocol",
                                value: deviceDetail?.config?.protocol
                            },
                            {
                                label: "Last Health Check",
                                value: deviceDetail?.last_health_check
                            },
                            {
                                label: 'Last Status Update',
                                value: deviceDetail?.config?.applied_at
                            },
                            {
                                label: 'Status',
                                value: deviceDetail?.status,
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
