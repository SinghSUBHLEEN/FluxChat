import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText, Image,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Checkbox,
    Link,
    Alert,
    useToast,
    AlertIcon,
    Box,
    InputRightAddon
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./Login.css";
import IMAGES from "../../images/Images";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { ClipLoader } from "react-spinners";
import cookie from "js-cookie";
import Header from "../Header/Header";
import { PiEyeBold, PiEyeClosed, PiEyeClosedBold, PiEyeClosedDuotone, PiEyeDuotone, PiEyeLight } from "react-icons/pi";


function Login() {

    const [cook, setCook] = useState(cookie.get("token"));
    const toast = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false)
    const [rem, setRem] = useState(false);
    const [load, setLoad] = useState(false);
    const [alert, setAlert] = useState("");

    const handleRem = () => setRem(!rem);
    const handleClick = () => setShow(!show)
    const handleEmail = (e) => setEmail(e.target.value)
    const handlePassword = (e) => setPassword(e.target.value);

    const handleRegister = () => {
        navigate("/auth/register");
    }

    useEffect(() => {
        setAlert("");
    }, [email, password, rem]);

    useEffect(() => {
        setCook(cookie.get("token"));
        if (cook) navigate('/chat');
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoad(true);
        setAlert("");
        axios.post("/api/users/auth/login", { email, password, rem }).then(res => {
            console.log("done");
            toast({
                title: "Logged in Successfully!",
                status: "success",
                duration: "4000",
                isClosable: true,
                position: "bottom"
            });
            navigate("/chat");
        }).catch(err => {
            console.log(err.response.data.error)
            setLoad(false);
            setAlert(err.response.data.error);
        });
    }


    const isError1 = email === '';
    const isError2 = password === '';


    return (
        <>
            <Header />
            <div className="formContainer">
                <div className="myForm d-flex justify-content-center align-items-center">
                    <div style={{ display: "flex", width: "50%", backgroundColor: "white", borderRadius: "2rem" }}>
                        <div style={{ flex: 0.6, backgroundColor: "white", borderRadius: "2rem", display: "flex", justifyItems: "center", alignItems: "center" }}>
                            <Image src={IMAGES.image1} alt='logo image' style={{ borderRadius: "2rem" }} />
                        </div>
                        <div className="verticalLine" />
                        <form className="rounded p-4 p-sm-7 signup-form loginContainer">
                            <h1 className="loginHead">Sign in</h1>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input type='email' value={email} onChange={handleEmail} placeholder='Enter email' />
                                {!isError1 ? (
                                    <FormHelperText>
                                        {"We'll never share your email"}
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Email is required.</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel marginTop={"0.7rem"}>Password</FormLabel>
                                <InputGroup size='md'>
                                    <Input
                                        pr='4.5rem'
                                        type={show ? 'text' : 'password'}
                                        placeholder='Enter password'
                                        value={password}
                                        onChange={handlePassword}
                                    />

                                    <InputRightElement width='fit-content' p={0} bg="inherit" mr={1} color="RGBA(0, 0, 0, 0.7)">
                                        {/* <Button h='1.75rem' size='sm' onClick={handleClick} style={{ backgroundColor: "white", boxShadow: 'none', fontWeight: "thin" }} p={0} > */}
                                        {show ? <button onClick={e => {
                                            e.preventDefault()
                                            handleClick()
                                        }}><PiEyeClosedDuotone fontSize="23px" /></button> : <button onClick={e => {
                                            e.preventDefault()
                                            handleClick()
                                        }}><PiEyeDuotone fontSize="23px" /></button>}
                                        {/* </Button> */}
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <Checkbox colorScheme='red' value={rem} onChange={handleRem} marginTop={4}>
                                    Remember me
                                </Checkbox>
                            </FormControl>
                            {!load ? <Button type="submit" colorScheme='red' marginTop={4} borderRadius="xl" p={4} onClick={handleSubmit}>Sign in</Button> : <Button isLoading colorScheme='red' padding={5} marginTop={4}
                                spinner={<ClipLoader size={25} color='white' />}></Button>}
                            {alert !== "" ? <div className="d-flex m6 p3" style={{ marginTop: "0.4rem" }}>
                                <Alert borderRadius="lg" status='error' margin={2}>
                                    <AlertIcon />
                                    {alert}
                                </Alert>
                            </div> : <></>}
                            <FormLabel marginTop={4}> No account ? <Link onClick={handleRegister} color='red.500'>Create here</Link></FormLabel>
                        </form>
                    </div>

                </div>
            </div >
        </>
    )
}

export default Login;
