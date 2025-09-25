import React from "react";
import AlertCircle from "../../assets/alertcircle.svg?react";
import CheckCircle from "../../assets/checkcircle.svg?react";
import Info from "../../assets/info.svg?react";
import X from "../../assets/x.svg?react";
import { IconMaterial } from "../shared/iconMaterial/IconMaterial";

export enum AlertType {
  Error = "error",
  Success = "success",
  Info = "info",
  Warning = "warning",
  Sync = "sync",
}

export enum AlertVariant {
  Default = "default",
  Swimming = "swimming",
}

export interface AlertProps {
  type?: AlertType;
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  rightIcon?: string;
  onClose?: () => void;
  className?: string;
  alertMsgs?: string | Partial<Record<string, string[]>>;
}


const Alert: React.FC<AlertProps> = ({
  type = AlertType.Info,
  variant = AlertVariant.Default,
  title,
  children,
  alertMsgs,
  onClose,
  className = "",
}) => {
  const getAlertStyles = () => {
    const baseStyles =
      "self-stretch px-4 py-2.5 w-full rounded-lg inline-flex justify-start items-center gap-2";
    switch (type) {
      case AlertType.Error:
        return `${baseStyles} bg-red-50`;
      case AlertType.Success:
        return `${baseStyles} bg-green-50`;
      case AlertType.Warning:
        return `${baseStyles} bg-yellow-50 border`;
      case AlertType.Sync:
        return `${baseStyles} bg-lightblue`;
      case AlertType.Info:
      default:
        return `${baseStyles} bg-blue-50`;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case AlertVariant.Swimming:
        return " top-4 right-4 animate-slide-in shadow-lg z-50 max-w-sm";
      case AlertVariant.Default:
      default:
        return "";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case AlertType.Error:
        return "text-red-500";
      case AlertType.Success:
        return "text-green-500";
      case AlertType.Warning:
        return "text-yellow-500";
      case AlertType.Sync:
        return "text-primeblue";
      case AlertType.Info:
      default:
        return "text-blue-500";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case AlertType.Error:
        return "text-red-800";
      case AlertType.Success:
        return "text-green-800";
      case AlertType.Warning:
        return "text-yellow-800";
      case AlertType.Sync:
        return "text-primary-dark";
      case AlertType.Info:
      default:
        return "text-blue-800";
    }
  };

  const renderIcon = () => {
    const iconClass = `w-5 h-5 ${getIconColor()} flex-shrink-0 mt-0.5`;
    switch (type) {
      case AlertType.Error:
        return <AlertCircle className={iconClass} />;
      case AlertType.Success:
        return <CheckCircle className={iconClass} />;
      case AlertType.Warning:
        return <AlertCircle className={iconClass} />;
      case AlertType.Sync:
        return (
          <IconMaterial
            filled
            icon={"sync"}
            className={iconClass}
            size={20}
          />
        );
      case AlertType.Info:
      default:
        return <Info className={iconClass} />;
    }
  };

  const hasMessages =
    !!children ||
    (typeof alertMsgs === "string" && alertMsgs.trim() !== "") ||
    (alertMsgs &&
      typeof alertMsgs === "object" &&
      Object.keys(alertMsgs).length > 0);

  if (!hasMessages) return null;

  const renderMessages = (msgs: any): React.ReactNode => {
    if (!msgs) return null;
    if (typeof msgs === "string") return <div>{msgs}</div>;
    if (Array.isArray(msgs)) {
      return (
        <ul className="mt-1 list-disc list-inside">
          {msgs.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      );
    }
    if (typeof msgs === "object") {
      return (
        <>
          {Object.values(msgs).map((value, i) => (
            <React.Fragment key={i}>{renderMessages(value)}</React.Fragment>
          ))}
        </>
      );
    }
    return null;
  };

  return (
    <div className={`${getAlertStyles()} ${getVariantStyles()} ${className}`}>
      {renderIcon()}

      <div className="flex-1">
        {title && (
          <div className={`font-medium text-sm ${getTextColor()} mb-1`}>
            {title}
          </div>
        )}

        <div className={`text-sm ${getTextColor()}`}>
          {children}
          {alertMsgs && renderMessages(alertMsgs)}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`${getIconColor()} hover:opacity-70 transition-opacity flex-shrink-0 mt-0.5`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
