// import { useState, useEffect } from "react";
import "./Header.css";
import { TbLogout2 } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { BiSearch, BiSearchAlt, BiSolidPencil } from "react-icons/bi";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, useDisclosure, useToast, DrawerFooter, Avatar, Tooltip, Button, Input, FormControl, InputLeftElement, InputGroup, InputRightElement, DrawerOverlay, DrawerCloseButton, Box, Stack, Skeleton, Spinner, ModalOverlay, ModalContent, Menu, MenuButton, MenuList, MenuItem, IconButton, InputLeftAddon, Text } from "@chakra-ui/react";
import { Navbar, Container, Form, NavDropdown, Modal, Dropdown, DropdownButton, Nav, DropdownItem } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import IMAGES from "../../images/Images";
import cookie from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import UserListItem from "../UserListItem/UserListItem";
import { ChatState } from "../Context/ChatProvider";
import SkeletonCustom from "../SkeletonCustom/SkeletonCustom";
import { AiOutlineMenu, AiOutlineUserAdd } from "react-icons/ai";
import UserModal from "./UserModal";
import { RiChat1Fill } from "react-icons/ri";
import { getSender } from "../Chat/chatLogic";
import { MDBBadge, MDBIcon } from 'mdb-react-ui-kit';
import { MdGroupAdd } from "react-icons/md";
import AddUser from "./AddUser";

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
    const { setSelectedChat, setChats, chats, setLoadingChat, socket, notification, setNotification } = ChatState();
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
        // setSearch(e.target.value);
        if (!e.target.value) {
            setSearchResult([]);
            return;
        }

        try {
            setLoading(true);
            const s = await axios.get(`/api/search/${e.target.value}`);
            setLoading(false);
            setSearchResult(s.data);
            // socket.emit("fetch again", )
            // if (s.data.length === 0) {
            //     toast({
            //         title: "No such user",
            //         status: 'warning',
            //         duration: 4000,
            //         isClosable: true,
            //         position: "bottom-left"
            //     })
            // }

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
            if (!chats.find((it) => it._id === data._id)) {
                socket.emit("fetch again chat", { users: data.users, id: cookie.get("_id") });
                setChats([data, ...chats]);
            }
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
            <Navbar collapseOnSelect sticky="top" expand="sm" className="color-nav mb-1" >

                <Container fluid className="Inner" style={{ display: "flex" }}>
                    {/* <Navbar.Toggle aria-controls="responsive-navbar-nav"><span><AiOutlineMenu color="white" /></span></Navbar.Toggle> */}
                    <Drawer
                        variant="secondary"
                        isOpen={isOpen}
                        placement='left'
                        onClose={() => { onClose() }}
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
                                    <span className="menuIcon" style={{ fontSize: "1.5rem", marginLeft: "6px", marginBottom: "0.3rem", color: "ghostwhite" }} onClick={handleBrand}><img
                                        src={IMAGES.icon}
                                        width="34"
                                        height="34"
                                        className="d-inline-block align-top m-1"
                                        alt="Navbar logo"
                                    />FluxChat</span>
                                </Container>
                            </DrawerHeader>
                            <DrawerHeader className="menuHeader">
                                <FormControl className="p-0 m-0 d-flex" onClick={onOpen}>
                                    <InputGroup>
                                        <InputLeftAddon p={2}
                                            color="whiteAlpha.700"
                                            borderLeftRadius="3xl"
                                            cursor="pointer"
                                            bg="whiteAlpha.50"
                                            borderColor="gray"
                                            borderRightWidth={0} ><BiSearch size="md" /></InputLeftAddon>
                                        <Input type='text' placeholder="Search users" size="md" onChange={handleSearchSubmit} color="white  " fontSize="large" bg="whiteAlpha.50" borderWidth="thin" borderColor="gray" autoComplete="off" borderRadius="3xl" _placeholder={{ color: "whiteAlpha.600" }} />
                                    </InputGroup>
                                </FormControl>
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
                                    searchResult.length > 0 ? searchResult.map((it) => {
                                        return (<UserListItem key={it._id} user={it} handleOnClick={function () { accessChat(it._id) }} />);
                                    }) : <div className="d-flex" style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                                        <Text fontSize="2xl" pb={3} display="flex" color="whiteAlpha.800">
                                            <AiOutlineUserAdd fontSize="35px" style={{ marginRight: "8px", }} />{"Add Users"}
                                        </Text></div>
                                ))}

                            </DrawerBody>
                            <DrawerFooter height="10" backgroundColor="#0f0f0f">
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                    <div style={{ float: "left", marginLeft: '18px', fontWeight: "630", marginTop: "8px", display: "flex" }}>
                        {/* <div onClick={onOpen} style={{ fontSize: "x-large", marginTop: "0.42rem", paddingRight: "0.7rem" }} className="menuIcon">
                            <AiOutlineMenu variant="primary" />
                        </div> */}
                        {/* <Box
                            display={{ base: "none", md: "flex" }}
                            alignItems="center"
                            fontSize="2xl"
                            p={0}
                            bg="whiteAlpha.200"
                            color="white"
                            borderRadius="full"
                            p={2}
                        >
                            <span><BiSearchAlt /></span>
                        </Box> */}

                        <Box display="flex" className="menuIcon" style={{ fontSize: "1.5rem", marginTop: "0.07rem", color: "ghostwhite", }} onClick={handleBrand}>
                            <span><img
                                src={IMAGES.icon}
                                width="34"
                                height="34"
                                className="d-inline-block align-top m-1"
                                alt="Navbar logo"
                            /></span><span>FluxChat</span></Box>
                    </div>

                    {/* <Navbar.Collapse
                        id="responsive-navbar-nav" style={{ display: "flex", justifyContent: "flex-start" }}> */}
                    {cook &&
                        <Tooltip label="Search users by name or email" hasArrow>
                            <form className="m-0 p-0">

                                <Box
                                    display={{ base: "flex", md: "none" }}
                                    alignItems="center"
                                    flexDir="column"
                                    p={0}
                                    bg="inherit"
                                    color="white"
                                    w={{ base: "fit-content", md: "38%" }}
                                    onClick={onOpen}
                                    mt={2}
                                // ml={1}
                                ><IconButton isRound={true}
                                    variant="outline" size='md'
                                    color="white"
                                    borderWidth="0"
                                    _hover={{ bg: "whiteAlpha.200" }}
                                    icon={<BiSearchAlt fontSize="25px" />} /></Box>

                                <Box
                                    display={{ base: "none", md: "flex" }}
                                    alignItems="center"
                                    flexDir="column"
                                    p={0}
                                    bg="inherit"
                                    color="white"
                                    w={{ base: "100%", md: "68%" }}
                                >
                                    <InputGroup
                                        width="120%"
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
                                </Box>
                            </form>
                        </Tooltip>}
                    <Box alignSelf={"center"}>
                        <Box display={"flex"} justifyContent={"space-between"}  >
                            <Box display="inline" mr={4} mt={1}>{cook && <NavDropdown align={"end"} title={(<>
                                <Tooltip label="Notifications" hasArrow>
                                    <Button
                                        borderRadius="full"
                                        variant="outline" size='md'
                                        color="white"
                                        mt={1}
                                        borderWidth="0"
                                        p={0}
                                        _hover={{ bg: "whiteAlpha.200" }}
                                        className="icon-button"
                                    ><RiChat1Fill fontSize="28.5px" />
                                        {notification.length > 0 && <span className="icon-button_badge">{notification.length > 9 ? " 9+" : notification.length}</span>}</Button>
                                </Tooltip>
                            </>)} id="collapsible-nav-dropdown" style={{
                                // width: "7rem",
                                boxShadow: "none",
                                fontSize: "22px"
                            }} className="dropDown" >
                                {!notification.length ? <><Dropdown.Item style={{ color: "white", fontSize: "15px" }}
                                    className="m-0">
                                    No Notifications
                                </Dropdown.Item></> : <>
                                    {notification.map(it => (
                                        <Dropdown.Item
                                            key={it._id}
                                            style={{ color: "white", fontSize: "15px" }}
                                            className="m-0"
                                            onClick={() => {
                                                setSelectedChat(it.chat);
                                                setNotification(notification.filter(c => c !== it));
                                            }}
                                        >{it.chat.isGroupChat ? ("New Messages in " + it.chat.chatName) : ("New messages from " + getSender(cookie.get("_id"), it.chat.users))}</Dropdown.Item>))}
                                </>}
                            </NavDropdown>}
                            </Box>
                            <Box display="inline">
                                {cook && <div style={{ display: "block" }}><NavDropdown align={"end"} title={<><Avatar size="md" bg='red.600' _hover={{ bg: "red.400" }} src={cookie.get("img")} name={cookie.get("name")} color="white" style={{ marginRight: "4px" }} />  </>} id="collapsible-nav-dropdown" style={{
                                    // width: "7rem",
                                    width: "fit-content",
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
                                </NavDropdown></div>}</Box>
                            {/* </Navbar.Collapse> */}
                        </Box>
                    </Box>
                </Container >
            </Navbar >
        </>
    )
}

export default Header;
