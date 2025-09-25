import { IconMaterial } from "../shared/iconMaterial/IconMaterial";
import Badge from "../shared/ui/Badge";

interface InfoItem {
    label: string;
    value: number | string | undefined | null | Date;
    useInKiro?: boolean;
    hasIcon?: boolean;

}

interface GeneralInfoCardProps {
    title?: string;
    subtitle?: string;
    icon?: string;
    items: InfoItem[];
    className?: string;
    titleClass?: string
    itemsClass?: string
    isActive?: boolean,
    status?: boolean | string
    onClick?: () => void
}

export default function Card({
    icon,
    onClick,
    isActive,
    titleClass = "bg-background-light-gray",
    title = "General Information",
    itemsClass = 'flex justify-between items-center',
    subtitle,
    status,
    items,
    className = ""
}: GeneralInfoCardProps) {
    return (
        <div onClick={onClick} className={`bg-white relative rounded-lg shadow-sm  p-2 ${isActive ? 'border border-primeblue' : "border"} ${className}`}>
            <div className={`w-full p-2.5 mb-2 ${isActive ? "bg-lightblue" : ''} ${titleClass}  rounded-lg`}>
                <div className="flex flex-col gap-2  text-primary-dark">
                    <h3 className="text-sm font-semibold">
                        {title}
                    </h3>
                    <span className="text-xs font-normal">
                        {subtitle}
                    </span>
                </div>
                {
                    icon &&
                    <IconMaterial
                        onClick={onClick}
                        icon={icon}
                        className="cursor-pointer mt-1 text-primary-dark"
                        size={20}

                    />
                }
            </div>

            <div className="space-y-2 text-extralight">
                {items.map((item, index) => {
                    const renderValue = () => {
                        if (item.label === "Status") {
                            return null;
                        }
                        if (item.value instanceof Date) {
                            return new Date(item.value).toLocaleString("ru-RU", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            });
                        }
                        return item.value || "Not Provided Yet";
                    };

                    return (
                        <div key={index} className={`${itemsClass}`}>
                            <span className="text-xs text-secondary-extralight font-normal">
                                {item.label}:
                            </span>

                            <div className="flex items-center gap-2">
                                {renderValue() && (
                                    <span className="text-sm text-primary-dark text-end font-normal">
                                        {renderValue()}
                                    </span>
                                )}

                                {item.label === "Status" && (
                                    <Badge status={item.value as string} />
                                )}

                                {item.hasIcon && (
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center ${item.useInKiro ? "bg-primary" : "bg-secondary-extralight"
                                            }`}
                                    >
                                        <IconMaterial
                                            filled
                                            icon={item.useInKiro ? "check" : "close"}
                                            className="cursor-pointer text-white"
                                            size={16}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {
                status &&
                <div className="absolute bottom-2 right-2">
                    <Badge status={status} />
                </div>
            }

        </div>
    );
}