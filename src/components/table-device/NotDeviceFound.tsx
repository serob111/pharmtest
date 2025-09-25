import { useTranslation } from "react-i18next"
import { IconMaterial } from "../shared/iconMaterial/IconMaterial"

export default function NotDeviceFound() {
    const { t } = useTranslation()
    const i18nDeviceDirectory = (key: string): string =>
        t(`device-directory.${key}`);
    return (
        <div className="w-full gap-2 h-full flex flex-col items-center justify-center text-secondary-extralight">
            <div className="bg-background-light-gray flex items-center justify-center p-2 rounded-lg">
                <IconMaterial
                    filled
                    icon='search_off'
                    className="cursor-pointer"
                    size={22}
                />
            </div>
            <h1 className="text-sm not-italic font-medium">{i18nDeviceDirectory('not-device-found')}</h1>
            <p className="text-sm not-italic font-normal">
                {i18nDeviceDirectory('check-different-keywoard')}
            </p>
        </div>
    )
}
