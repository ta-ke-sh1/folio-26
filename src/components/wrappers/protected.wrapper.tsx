import type { JSX } from "react";
import type { ROLES } from "../../enums/user.enum";

interface ProtectedWrapperProps {
    children: JSX.Element;
    roles: ROLES[];
}

export default function ProtectedWrapper({
    children,
    roles,
}: ProtectedWrapperProps) {
    return <>{children}</>;
}
