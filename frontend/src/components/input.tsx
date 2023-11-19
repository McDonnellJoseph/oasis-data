import React, { InputHTMLAttributes, ReactNode } from "react";
import "./input.css"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    children: ReactNode;
    placeholder?: string;
    name?: string;
    password?: boolean;
}

const Input: React.FC<InputProps> = ({ children, placeholder, name, password, ...props }) => {


    return (
        <input className="input" placeholder={placeholder} name={name} type={password ? "password" : "text"}>{children}</input>
    )
}

export default Input;