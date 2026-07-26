import type { JSX } from "react";
import "./layout.scss"

interface LayoutWrapperProps {
    children: JSX.Element[] | JSX.Element;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    return <div className="layout-wrapper">{children}</div>;
}
