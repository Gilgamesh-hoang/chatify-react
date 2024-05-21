import React from "react";

export interface LayoutProps {
    children: React.ReactNode
}

const DefaultLayout = ({children} : LayoutProps) => {
    return (<div>{children}</div>)
};
export default DefaultLayout