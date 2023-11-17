import React, { ReactNode } from "react";
import './header1.css'

interface Header1Props {
    children: ReactNode;
}

const Header1: React.FC<Header1Props> = ({ children }) => {
    return (
        <h1 className="main-header">
            {children}
        </h1>
    );
};

export default Header1;