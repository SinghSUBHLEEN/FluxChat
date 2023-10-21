// import { useState, useEffect } from "react";
import "./Header.css";
import { TbLogout2 } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { BiSearch, BiSearchAlt, BiSolidPencil } from "react-icons/bi";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, useToast, DrawerFooter, Avatar, Tooltip, Button, Input, FormControl, InputLeftElement, InputGroup, InputRightElement, DrawerOverlay, DrawerCloseButton, Box, Stack, Skeleton, Spinner, ModalOverlay, ModalContent, Menu, MenuButton, MenuList, MenuItem, IconButton, InputLeftAddon } from "@chakra-ui/react";
import { Navbar, Container, Form, NavDropdown, Modal, Dropdown, DropdownButton, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import IMAGES from "../../images/Images";
import cookie from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import UserListItem from "../UserListItem/UserListItem";
import { ChatState } from "../Context/ChatProvider";
import SkeletonCustom from "../SkeletonCustom/SkeletonCustom";
import { AiOutlineMenu } from "react-icons/ai";
import UserModal from "./UserModal";

function Header() {

    const [cook, setCook] = useState(cookie.get("token"));
    const [id, setId] = useState(cookie.get("_id"));
    const [cookProfile, setCookProfile] = useState(cookie.get("img"));
    const [clear, setClear] = useState(false);
    const [cookName, setCookName] = useState(cookie.get("name"));
    const toast = useToast();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const { selectedChat, setSelectedChat, setChats, chats, loadingChat, setLoadingChat } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleBrand = async () => {
        navigate('/chat');
    }

    const handleLogout = async () => {
        cookie.remove("token");
        cookie.remove("name");
        cookie.remove("img");
        cookie.remove("_id");
        toast({
            title: "Logged out Successfully!",
            status: "success",
            duration: "4000",
            isClosable: true,
            position: "bottom"
        });
        setChats([]);
        setSelectedChat("");
        setCook("");
        setCookName("");
        setCookProfile("");
        setId("");
        navigate("/auth/login");
    }

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!search) {
            return;
        }

        try {
            setLoading(true);
            const s = await axios.get(`/api/search/${search}`);
            setLoading(false);
            setSearchResult(s.data);
            if (s.data.length === 0) {
                toast({
                    title: "No such user",
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                    position: "bottom-left"
                })
            }

        } catch (error) {
            console.log(error);
            toast({
                title: "Something went wrong",
                description: "failed to load data",
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: "bottom-left"
            });
        }

    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const { data } = await axios.post("/api/chat", { userId });
            if (!chats.find((it) => it._id === data._id))
                setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setSearchResult([]);
            setSearch("");
            onClose();
        } catch (error) {
            console.log(error);
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }

    useEffect(() => {
        setId(cookie.get("_id"));
        setCook(cookie.get("token"));
        setCookProfile(cookie.get("img"));
        setCookName(cookie.get("name"));
    });

    return (
        <>
            <Navbar collapseOnSelect sticky="top" expand="sm" className="color-nav">

                <Container fluid className="Inner" style={{ display: "flex" }}>
                    {/* <Navbar.Toggle aria-controls="responsive-navbar-nav"><span><AiOutlineMenu color="white" /></span></Navbar.Toggle> */}
                    <Drawer
                        variant="secondary"
                        isOpen={isOpen}
                        placement='left'
                        onClose={onClose}
                        size="xs"
                        className="headerDrawer"
                    >
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader className="menuHeader" style={(location.pathname === '/auth/login' || location.pathname === '/auth/register') ? { paddingTop: "0.52rem" } : {}}>
                                {/* <Container className="m-0" style={{ padding: '0' }}>
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
                                </Container> */}
                                <Container className="m-0" style={{ padding: '0' }}>
                                    <span className="menuIcon" style={{ fontSize: "1.5rem", marginLeft: "0px", marginBottom: "0.3rem", color: "ghostwhite" }} onClick={handleBrand}><img
                                        src={IMAGES.icon}
                                        width="34"
                                        height="34"
                                        className="d-inline-block align-top m-1"
                                        alt="Navbar logo"
                                    />FluxChat</span>
                                </Container>
                            </DrawerHeader>
                            <DrawerHeader className="menuHeader">
                                <form className="m-0 p-0 b-0">
                                    <FormControl className="p-0 m-0 d-flex" onClick={onOpen}>
                                        <InputGroup>
                                            {/* <
                                                p={2}
                                                onClick={onOpen}
                                                bg="whiteAlpha.300"
                                                color="whiteAlpha.800"
                                                borderLeftRadius="3xl"
                                                cursor="pointer"
                                                width="12"
                                                borderColor="gray"
                                                borderWidth={0}
                                            >
                                                <BiSearch size="lg" />
                                            </> */}
                                            <InputLeftElement p={2}
                                                color="whiteAlpha.800"
                                                borderLeftRadius="3xl"
                                                cursor="pointer"
                                                borderColor="gray"
                                                borderWidth={0} ><BiSearch size="md" /></InputLeftElement>
                                            <Input type='text' placeholder="Search users" size="md" value={search} onChange={handleSearch} color="white  " fontSize="large" bg="whiteAlpha.50" borderWidth="thin" borderColor="gray" autoComplete="off" borderRadius="3xl" />
                                        </InputGroup>
                                        <IconButton type="submit" colorScheme="red" isRound="true"
                                            fontSize="3xl"
                                            ml={2}
                                            px={4}
                                            onClick={handleSearchSubmit}
                                            icon={<IoSearch />}
                                            mx={2}
                                        />
                                    </FormControl>
                                </form>
                            </DrawerHeader>
                            <DrawerBody className="menuBody">
                                {!clear && (loading ? <Stack>
                                    <SkeletonCustom />
                                    <SkeletonCustom />
                                    <SkeletonCustom />
                                    <SkeletonCustom />
                                    <SkeletonCustom />
                                    <SkeletonCustom />
                                </Stack> : (
                                    searchResult ? searchResult.map((it) => {
                                        return (<UserListItem key={it._id} user={it} handleOnClick={function () { accessChat(it._id) }} />);
                                    }) : <></>
                                ))}

                            </DrawerBody>
                            <DrawerFooter height="10" backgroundColor="#0f0f0f">
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                    <div style={{ float: "left", marginLeft: '12px', fontWeight: "630", marginTop: "8px" }}>
                        {/* <div onClick={onOpen} style={{ fontSize: "x-large", marginTop: "0.42rem", paddingRight: "0.7rem" }} className="menuIcon">
                            <AiOutlineMenu variant="primary" />
                        </div> */}
                        <span className="menuIcon" style={{ fontSize: "1.5rem", marginTop: "0.07rem", color: "ghostwhite" }} onClick={handleBrand}><img
                            src={IMAGES.icon}
                            width="34"
                            height="34"
                            className="d-inline-block align-top m-1"
                            alt="Navbar logo"
                        />FluxChat</span>
                    </div>

                    <Navbar.Collapse
                        id="responsive-navbar-nav" style={{ display: "flex", justifyContent: "flex-start" }}>
                        {cook && <Container fluid className="p-0 mx-2" style={{ flex: 0.9 }}>

                            <Tooltip label="Search users by name or email" hasArrow>
                                <InputGroup
                                    width="fit-content"
                                    onClick={onOpen}
                                    // display="block"
                                    mx={"auto"}
                                >
                                    <InputLeftAddon
                                        p={2}
                                        onClick={onOpen}
                                        bg="whiteAlpha.300"
                                        color="whiteAlpha.800"
                                        borderLeftRadius="3xl"
                                        cursor="pointer"
                                        width="12"
                                        borderColor="gray"
                                        borderWidth={0}
                                    >
                                        <BiSearch size="lg" />
                                    </InputLeftAddon>
                                    <Input type='text' borderColor="gray" borderRadius="3xl" bg="whiteAlpha.300" placeholder="Search users" _placeholder={{ color: "whiteAlpha.800" }} borderWidth={0} />
                                    {/* <InputLeftElement onClick={onOpen}>
                                        <Button style={{ backgroundColor: "inherit", fontSize: "large" }}>
                                            <span><BiSearchAlt style={{ fontSize: "1.6rem", color: "gray" }} /></span>
                                        </Button>
                                    </InputLeftElement> */}

                                    {/* <InputRightElement onClick={onOpen}>
                                            <Button style={{ backgroundColor: "inherit", paddingRight: "1rem", wdith: "fit-content", marginRight: "6.4rem", color: "gray" }}>
                                                {"........"}
                                            </Button>
                                        </InputRightElement> */}
                                </InputGroup>
                            </Tooltip>

                        </Container>}
                        {cook && <div style={{ flex: 0.1, display: "block" }}><NavDropdown title={<><Avatar size="md" bg='red.600' _hover={{ bg: "red.400" }} src={cookie.get("img")} name={cookie.get("name")} color="white" style={{ marginLeft: "4rem" }} />  </>} id="collapsible-nav-dropdown" style={{
                            marginRight: "3rem",
                            // width: "7rem",
                            boxShadow: "none",
                            padding: "0"
                        }} className="dropDown" >
                            <UserModal>
                                <Tooltip hasArrow label={cookName}>
                                    <Dropdown.Item>
                                        <div className="m-0 p-0 d-flex customElement">
                                            <FaUserLarge fontSize="1.2rem" style={{ marginRight: "0.8rem" }} /><span>{" " + " My profile"}</span>
                                        </div>
                                    </Dropdown.Item>
                                </Tooltip>
                            </UserModal>
                            <Dropdown.Divider />
                            <Dropdown.Item><div className="m-0 p-0 d-flex customElement" onClick={handleLogout}><TbLogout2 fontSize="1.6rem" style={{ marginRight: "0.8rem" }} /><span>{" " + " Logout"}</span></div></Dropdown.Item>
                        </NavDropdown></div>}
                    </Navbar.Collapse>

                </Container >
            </Navbar >
        </>
    )
}

export default Header;
