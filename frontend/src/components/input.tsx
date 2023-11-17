import React, { InputHTMLAttributes, ReactNode } from "react";
import "./input.css"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    children: ReactNode;
    placeholder?: string;
    name?: string;
}

const Input: React.FC<InputProps> = ({ children, placeholder, name, ...props }) => {
    return (
        <input className="input" placeholder={placeholder} name={name}>{children}</input>
    )
}

export default Input;