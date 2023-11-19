import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react';

import { Button } from '../components/button'

import Back from '../assets/back-button.svg'
import Input from '../components/input';
import Logo from "../assets/oasis-logo.png"
import "./login.css"
import axios from 'axios';
import { useCookies } from 'react-cookie';





type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = () => {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token']);
    const login = async (username: string, password: string) => {
        const response = await axios.get("http://127.0.0.1:8080/api/v1/user/authentication", {
            auth: {
                username: username,
                password: password
            }
        });
        const { token } = response.data["authToken"];
        console.log(token)
        setCookie('token', token, { path: '/' });
        return response.data;
    };
    const handleClick = () => {
        console.log("pressed");
        navigate('/');
    }
    const handleSubmit = async (event: any) => {
        console.log("toto");
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const { token } = await login(username, password);
        localStorage.setItem('token', token);
        navigate('/home')
    };






    return (
        <div>
            <button className='back-button' style={{ backgroundImage: `url(${Back})` }} onClick={handleClick}></button>
            <div className='login-container'>
                <img src={Logo} alt="Login Image" className='image' />
                <form onSubmit={handleSubmit}>
                    <Input placeholder='Username' name="username" ></Input>
                    <Input placeholder='Password' name="password" password={true}></Input>
                    <Button type='submit'>Log In</Button>
                </form>
            </div>
        </div>
    )

}

export default LoginPage;