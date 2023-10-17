// import { useState, useEffect } from "react";
import "./Header.css";
import { AiOutlineMenu } from 'react-icons/ai';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, DrawerFooter } from "@chakra-ui/react";
import { Navbar, Container, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {


    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginClick = async (event) => {
        event.preventDefault();
        navigate('/auth/login');
    }

    const handleBrand = async () => {
        navigate('/');
    }

    const option = {
        paddingTop: "1rem"
    }

    const obj = {};

    return (
        <>
            <Navbar sticky="top" expand="sm" className="color-nav" style={(location.pathname === '/auth/login' && location.pathname === '/auth/register') ? option : obj}>
                <Container fluid className="Inner">
                    <Drawer
                        variant="secondary"
                        isOpen={isOpen}
                        placement='left'
                        onClose={onClose}
                        size="xs"
                        className="headerDrawer"
                    >
                        <DrawerContent>
                            <DrawerHeader className="menuHeader">
                                <div style={{ display: "flex", marginLeft: '1.6rem' }}>
                                    <div onClick={onClose} style={{ fontSize: "x-large", marginTop: "0.42rem", paddingRight: "0.7rem" }} className="menuIcon">
                                        <AiOutlineMenu variant="primary" />
                                    </div>
                                    <span className="menuIcon" style={{ fontSize: "1.5rem", marginTop: "0.07rem" }} onClick={handleBrand}>FluxChat</span>
                                </div>
                            </DrawerHeader>
                            <DrawerBody className="menuBody">




                            </DrawerBody>

                            <DrawerFooter className="menuFooter">
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                    <div style={{ display: "flex", marginLeft: '2.45rem', fontWeight: "630" }}>
                        <div onClick={onOpen} style={{ fontSize: "x-large", marginTop: "0.42rem", paddingRight: "0.7rem" }} className="menuIcon">
                            <AiOutlineMenu variant="primary" />
                        </div>
                        <span className="menuIcon" style={{ fontSize: "1.5rem", marginTop: "0.07rem" }} onClick={handleBrand}>FluxChat</span>
                    </div>

                    <Navbar.Collapse id="navbarScroll" />
                    {(location.pathname !== '/auth/login' && location.pathname !== '/auth/register') ? <Form className="d-flex loginButton">
                        <Button variant="outline-success" style={{ padding: '0.8rem', width: "5.5rem", marginRight: "4rem", fontSize: "1.05rem" }} onClick={handleLoginClick}>Login</Button>
                    </Form> : <></>}
                </Container>
            </Navbar >
        </>
    )
}

export default Header;
