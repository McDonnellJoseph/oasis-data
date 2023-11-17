import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react';
import { Button, BigButton } from '../components/button';
import Header1 from '../components/header1';
import Image from "../assets/image.png"

type HomePageProps = {};

const HomePage: React.FC<HomePageProps> = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    };

    return (
        <div className='Home'>
            <div className='top-bar'>
                <Button> Button 1 </Button>
                <Button> Button 2 </Button>
                <Button> Button 3 </Button>
                <Button> Button 4 </Button>
            </div>
            <div>
                <Header1>Some Text</Header1>
            </div>
            <div className='middle-bar'>
                <img src={Image} alt="RE" className='image' />
                <BigButton onClick={handleClick}>Login</BigButton>
            </div>
        </div>
    )
}

export default HomePage;

