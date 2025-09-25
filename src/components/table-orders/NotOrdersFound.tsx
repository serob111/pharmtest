import { useTranslation } from "react-i18next"
import { IconMaterial } from "../shared/iconMaterial/IconMaterial"

export default function NotOrderFound() {
    const { t } = useTranslation()
    const i18nOrderDirectory = (key: string): string =>
        t(`orders-directory.${key}`);
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
            <h1 className="text-sm not-italic font-medium">{i18nOrderDirectory('not-order-found')}</h1>
            <p className="text-sm not-italic font-normal">
                {i18nOrderDirectory('check-different-keywoard')}
            </p>
        </div>
    )
}
