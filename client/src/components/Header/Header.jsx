// import { useState, useEffect } from "react";
import "./Header.css";
import { AiOutlineMenu, AiOutlineUser } from 'react-icons/ai';
import { TbLogout2 } from "react-icons/tb";
import { FaUserLarge } from "react-icons/fa6";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, useToast, DrawerFooter, Avatar, Tooltip } from "@chakra-ui/react";
import { Navbar, Container, Form, Button, NavDropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import IMAGES from "../../images/Images";
import cookie from "js-cookie";
import { useEffect, useState } from "react";

function Header() {

    const [cook, setCook] = useState(cookie.get("token"));
    const [cookProfile, setCookProfile] = useState(cookie.get("img"));
    const [cookName, setCookName] = useState(cookie.get("name"));
    const toast = useToast();

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

    const handleLogout = async () => {
        cookie.remove("token");
        cookie.remove("name");
        cookie.remove("img");
        toast({
            title: "Logged out Successfully!",
            status: "success",
            duration: "4000",
            isClosable: true,
            position: "bottom"
        });
        navigate("/");
    }

    useEffect(() => {
        setCook(cookie.get("token"));
        setCookProfile(cookie.get("img"));
        setCookName(cookie.get("name"));
    });

    const option = { display: "flex", marginLeft: '2.45rem', fontWeight: "630", marginTop: "1.9rem" }
    const obj = { display: "flex", marginLeft: '2.45rem', fontWeight: "630" }

    return (
        <>
            <Navbar sticky="top" expand="sm" className="color-nav">
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
                            <DrawerHeader className="menuHeader" style={(location.pathname === '/auth/login' || location.pathname === '/auth/register') ? { paddingTop: "0.52rem" } : {}}>
                                <Container className="m-0" style={{ padding: '0' }}>
                                    <div style={{
                                        display: "flex",
                                        marginLeft: '1.7rem'
                                    }}>
                                        <div onClick={onClose} style={{ fontSize: "x-large", marginTop: "0.3rem", paddingRight: "0.7rem" }} className="menuIcon">
                                            <AiOutlineMenu variant="primary" />
                                        </div>
                                        <span className="menuIcon" style={{ fontSize: "1.5rem", marginTop: "-0.03rem" }} onClick={handleBrand}><img
                                            src={IMAGES.icon}
                                            width="40"
                                            height="40"
                                            className="d-inline-block align-top"
                                            alt="Navbar logo"
                                        />FluxChat</span>
                                    </div>
                                </Container>
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
                        <span className="menuIcon" style={{ fontSize: "1.5rem", marginTop: "0.07rem" }} onClick={handleBrand}><img
                            src={IMAGES.icon}
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                            alt="Navbar logo"
                        />FluxChat</span>
                    </div>

                    <Navbar.Collapse id="navbarScroll" />
                    {(location.pathname !== '/auth/login' && location.pathname !== '/auth/register') ? (!cook ? <Form className="d-flex loginButton">
                        <Button variant="outline-success" style={{ padding: '0.8rem', width: "5.5rem", marginRight: "4rem", fontSize: "1.05rem" }} onClick={handleLoginClick}>Login</Button>
                    </Form> : (<NavDropdown title={<><Avatar size="md" bg='teal.500' icon={<AiOutlineUser fontSize='1.8rem' />} />  </>} id="collapsible-nav-dropdown" className="m2" style={{ marginRight: "7rem" }}>
                        <Tooltip hasArrow label={cookName}><NavDropdown.Item><div className="m-0 p-0 d-flex"><FaUserLarge fontSize="1.2rem" style={{ marginRight: "0.8rem" }} /><span>{" " + " My profile"}</span></div></NavDropdown.Item></Tooltip>
                        <NavDropdown.Divider />
                        <NavDropdown.Item><div className="m-0 p-0 d-flex" onClick={handleLogout}><TbLogout2 fontSize="1.6rem" style={{ marginRight: "0.8rem" }} /><span>{" " + " Logout"}</span></div></NavDropdown.Item>

                    </NavDropdown>)) : <></>}
                </Container>
            </Navbar >
        </>
    )
}

export default Header;
