import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react';

import { Button, BigButton } from '../components/button'

import Input from '../components/input';
import Image from "../assets/image.png"
import "./login.css"
import axios from 'axios';

const login = async (username: string, password: string) => {
    const response = await axios.get("http://127.0.0.1:8080/api/v1/user/authentication", {
        auth: {
            username: username,
            password: password
        }
    });
    const { token } = response.data["authToken"];
    localStorage.setItem('token', token);
    return response.data;
};



type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = () => {
    const navigate = useNavigate;
    const handleSubmit = async (event) => {
        console.log("toto");
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const { token } = await login(username, password);
        localStorage.setItem('token', token);
    };
    return (
        <div className='login-container'>
            <img src={Image} alt="Login Image" className='image' />
            <form onSubmit={handleSubmit}>
                <Input placeholder='Username' name="username"></Input>
                <Input placeholder='Password' name="password"></Input>
                <Button type='submit'>Log In</Button>
            </form>
        </div>
    )

}

export default LoginPage;