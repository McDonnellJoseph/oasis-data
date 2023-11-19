import React, { ReactNode, useState, useEffect } from "react";
import './summary.css'
import axios from "axios";

interface Summary {
    children: ReactNode;
    title: string;
    id: string,
}

const Summary: React.FC<Summary> = ({ children, title, id }) => {

    const [files, setFiles] = useState([]);


    useEffect(() => {
        axios.get(`http://localhost:8080/api/v1/item?limit=101&offset=0&sort=name&sortdir=1&folderId=${id}`,)
            .then(response => {
                setFiles(response.data)
            })
            .catch(error => {
                console.error("Error", error);
            })

    }, []);

    const length = files.length;
    return (
        <div className="main-container">
            <p className="title">{title}</p>

            <div className="list">
                <p className="list-title">{length} Documents Available:</p>
                <ul className="elem">
                    {files.map((file, index) => (
                        <li key={index}> {file.name}</li>
                    ))}
                </ul>
            </div>

        </div >
    )
}

export default Summary;