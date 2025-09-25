import { t } from "i18next";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";
import Button from "../shared/ui/Button/baseBtn";
import { TooltipCell } from "../table/TooltipCell";
import Switch from "../shared/ui/switch/switch";

type TProfileItem = {
    id: string;
    content: string;
    subcontent: string;
    icon: string;
    onChange?: () => void;
    onSwitch?: () => void;
    description?: string
    value?: boolean | string | number | null,
    checked2fa?: boolean,
    editable?: boolean
}
export default function ProfileItem({
    id,
    content,
    subcontent,
    icon,
    onChange,
    onSwitch,
    description,
    editable,
    value,
    checked2fa
}: TProfileItem) {
    return (
        <div className="border-b py-4 flex w-full justify-between items-center">
            <div className="gap-2">
                <div className="gap-2 group min-w-0 flex items-center">
                    <div className="p-3 bg-background-light-gray flex items-center justify-center rounded-md">
                        <IconMaterial
                            filled
                            icon={icon}
                            className="cursor-pointer text-primary-light"
                            size={20}
                        />
                    </div>
                    <div className="min-w-0 flex-shrink">
                        <TooltipCell
                            content={content}
                            className={`typo-body-small-medium-14 truncate text-primary-dark ${editable ? "cursor-pointer group-hover:underline" : ''}`}
                        />

                        {
                            description ?
                                <p
                                    className={`${editable && 'cursor-pointer'} typo-caption-regular-12  text-xs text-start truncate text-primary-light`}
                                >
                                    {description}
                                </p> :
                                <p
                                    className={`${editable && 'cursor-pointer'} typo-caption-regular-12 text-xs text-start truncate text-primary-light`}
                                >
                                    {subcontent}
                                </p>
                        }
                    </div>
                </div>
            </div>
            {
                onChange && <>
                    {
                        id === 'status' ?
                            <Button size="md" onClick={onChange} variant="warning">
                                {t('Deactivate User')}
                            </Button>
                            :
                            <Button onClick={onChange} size="md" variant="outline">
                                {t('change')}
                            </Button>
                    }

                </>
            }
            {
                onSwitch &&
                <Switch checked={checked2fa} onChange={onSwitch} />
            }
        </div>
    )
}


