import React, { useState, useEffect } from "react";
import Alert, { AlertType, AlertVariant } from "./Alert";

export interface AlertState {
    type?: AlertType;
    variant?: AlertVariant;
    messages: Partial<Record<string, string[]>> | string;
}

interface AlertsWrapperProps {
    alertState: AlertState | null;
    setAlertMessages?: (state: AlertState | null) => void;
}

export const AlertsWrapper: React.FC<AlertsWrapperProps> = ({ alertState, setAlertMessages }) => {
    if (!alertState) return null;

    const { type = AlertType.Info, messages, variant = AlertVariant.Default } = alertState;
    const normalizedMessages: string[] = typeof messages === "string"
        ? [messages]
        : typeof messages === "object" && messages !== null
            ? Object.values(messages).flat().filter(Boolean) as string[]
            : [];

    const [visibleMessages, setVisibleMessages] = useState(normalizedMessages);

    const handleClose = (msgToClose: string) => {
        setVisibleMessages(prev => prev.filter(msg => msg !== msgToClose));
    };

    useEffect(() => {
        if (visibleMessages.length === 0 && setAlertMessages) {
            setAlertMessages(null);
        }
    }, [visibleMessages, setAlertMessages]);

    if (visibleMessages.length === 0) return null;

    return (
        <div className="absolute flex flex-col gap-2 top-4 right-4 z-50">
            {visibleMessages.map((msg, idx) => (
                <Alert
                    key={`${idx}-${msg}`}
                    type={type}
                    variant={variant}
                    onClose={() => handleClose(msg)}
                    alertMsgs={msg}
                />
            ))}
        </div>
    );
};
