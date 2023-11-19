// Button.tsx

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './button.css'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button className='small-button' {...props}>
            {children}
        </button>
    );
};

const BigButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button className='big-button' {...props}>
            {children}
        </button>
    );
};

export { Button, BigButton };