import { } from 'react'
import { useNavigate } from 'react-router-dom';
import { TbError404 } from "react-icons/tb";
import "./NotFound.css";
import { Button } from '@chakra-ui/react';
import { BiLinkExternal } from 'react-icons/bi';
import Header from '../Header/Header';
import NotFoundComponent from './NotFoundComponent';

function NotFound() {

    const navigate = useNavigate();

    const handleTakeBack = () => {
        navigate("/chat");
    }

    return <>
        <Header />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "90vh" }}>
            <div style={{ color: "rgba(256, 256, 256, 0.9)", display: "flex" }}>
                <div style={{ marginLeft: "auto", marginRight: "auto", fontSize: "100px", paddingRight: "10px", paddingLeft: "10%" }}><NotFoundComponent color="rgba(256, 256, 256, 0.1)" height="100" width="100" /></div>

                <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                    <div className="page-head" style={{ color: "rgba(256, 256, 256, 0.9)", width: "fit-content" }}>Page Not found<Button mx={2} onClick={handleTakeBack} variant="link" color="white">Go to home<BiLinkExternal /></Button></div>
                    <div className="page-body d-block" style={{ maxWidth: "80%", color: "rgba(256, 256, 256, 0.5)" }}>Sorry, but it looks like the requested page does not exist...</div>
                </div>
            </div>
        </div >
    </>
}

export default NotFound
