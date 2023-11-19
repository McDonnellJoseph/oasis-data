import React, { useState, useEffect } from "react";
import { Button } from "../components/button";
import Logo from '../assets/oasis-long-logo.png'
import Summary from "../components/summary";
import "./userhome.css"
import axios from "axios";

type UserPageProps = {};

const UserPage: React.FC<UserPageProps> = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    type Collection = string;
    type Folder = any[]; // Replace 'any[]' with the actual type of your folder data
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/user/me')
            .then(response => {
                setFirstName(response.data.firstName)
                setLastName(response.data.lastName)
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const [collection, setCollection] = useState<Collection>("");
    const [folder, setFolder] = useState<Folder>([]);
    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/collection')
            .then(response => {
                setCollection(response.data[0]["_id"])
            })
            .catch(error => console.error('Error:', error));
    })


    const params = {
        parentType: "collection",
        parentId: "6557963428c5653656d937d6",
    }


    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/folder', { params })
            .then(response => {
                setFolder(response.data)
            })
            .catch(error => {
                console.error("Error", error);
            })
    }, []);

    return (
        <div>
            <div className="top-bar">
                <img src={Logo} alt="top-logo" className="top-logo" />
                <div className="right-parents">
                    <p className="UserId">{firstName} {lastName}</p>
                    <Button>Log Out</Button>
                </div>
            </div>
            <div className="main">
                {folder.map(f => (
                    <Summary title={f.name} id={f._id}>
                    </Summary>
                ))}
            </div>
        </div>
    )
}

export default UserPage;