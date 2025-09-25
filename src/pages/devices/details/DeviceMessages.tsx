import { useEffect } from "react";
import { useDevices } from "../../../context/DeviceProvider";
import Button from "../../../components/shared/ui/Button/baseBtn";


function DevicesMessages() {
    const { getDeviceMessages, deviceDetail, deviceMessages } = useDevices()

    useEffect(() => {
        if (deviceDetail?.id) {
            getDeviceMessages(deviceDetail.id)
        }
    }, [deviceDetail?.id])
    return (
        <div className="w-full h-full p-4 bg-white  flex flex-col justify-between items-start gap-4 font-montserrat">
            <div className="w-full max-w-md relative flex flex-col justify-start items-start gap-4">
                <div className="absolute left-2.5 top-5 bottom-0 w-px bg-background-light-gray z-40"></div>

                {deviceMessages.map((item, index) => (
                    <div key={index} className="w-full flex z-50 justify-start items-start gap-3">
                        <div className="w-5 h-5  bg-background-light-gray rounded-full  flex justify-center items-center gap-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-primeblue rounded-full" ></div>
                        </div>

                        <div className="flex-1 max-w-3xl flex flex-col justify-start items-start gap-1">
                            <div className="w-full text-custom-gray text-xs font-medium leading-[18px] break-words">
                                {item.timestamp || item.created_stamp}
                            </div>
                            <div className="w-full text-custom-dark text-sm font-normal leading-[22px] break-words">
                                {item.message_type}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className=" w-full flex border-t bg-white  p-2 gap-2 z-50 justify-end">
                    <Button
                        type="submit"
                        size="md"
                    >
                        View All Logs
                    </Button>
                </div>
        </div>
    );
}

export default DevicesMessages;