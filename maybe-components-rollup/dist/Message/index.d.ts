import { CSSProperties, ReactNode } from "react";
import "./index.scss";
export type Position = "top" | "bottom";
export interface MessageProps {
    style?: CSSProperties;
    className?: string | string[];
    content: ReactNode | string;
    duration?: number;
    onClose?: (...args: any) => void;
    id?: number;
    position?: Position;
}
export interface MessageRef {
    add: (messageProps: MessageProps) => number;
    remove: (id: number) => void;
    update: (id: number, messageProps: MessageProps) => void;
    clearAll: () => void;
}
export declare const MessageProvider: import("react").ForwardRefExoticComponent<import("react").RefAttributes<MessageRef>>;
