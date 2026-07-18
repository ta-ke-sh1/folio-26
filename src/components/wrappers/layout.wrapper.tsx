import type { JSX } from "react";

interface LayoutWrapperProps {
    children: JSX.Element[] | JSX.Element;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    return <div className="layout-wrapper">{children}</div>;
}
