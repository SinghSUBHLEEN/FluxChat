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
    AlertIcon,
    useToast,
    InputLeftElement,
    Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./Register.css";
import IMAGES from "../../images/Images";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import cookie from "js-cookie";
import Header from "../Header/Header";
import { PiEyeBold, PiEyeClosedBold, PiEyeClosedDuotone, PiEyeDuotone } from "react-icons/pi";


function Register() {

    var cook;
    const toast = useToast();
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpass, setCpass] = useState('');
    const [name, setName] = useState('');
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [img, setImg] = useState("");
    const [rem, setRem] = useState(false);
    const [alert, setAlert] = useState("");
    const [picLoad, setPicLoad] = useState(false);

    const handleCpass = (e) => setCpass(e.target.value);
    const handleRem = () => setRem(!rem);
    const handleName = (e) => setName(e.target.value);
    const handleClick1 = () => setShow1(!show1)
    const handleClick2 = () => setShow2(!show2)
    const handleEmail = (e) => setEmail(e.target.value)
    const handlePassword = (e) => setPassword(e.target.value);
    const handleImg = async (e) => {
        setPicLoad(true);
        if (!e.target.files[0]) {
            toast({
                title: "Please select a jpg or png image only!",
                status: "warning",
                duration: "4000",
                isClosable: true,
                position: "bottom"
            })
            setPicLoad(false);
        }
        else if (e.target.files[0].type !== 'image/jpeg' && e.target.files[0].type !== 'image/png') {
            toast({
                title: "Please select a jpg or png image only!",
                status: "error",
                duration: "4000",
                isClosable: true,
                position: "bottom"
            })
            setPicLoad(false);
        }
        else {
            const data = new FormData();
            data.append("file", event.target.files[0]);
            data.append("upload_preset", "FluxChat");
            data.append("cloud_name", "dcwwq2hus");
            fetch("https://api.cloudinary.com/v1_1/dcwwq2hus/image/upload", {
                method: "post",
                body: data,
            }).then(res => res.json()).then(res => {
                setPicLoad(false);
                setImg(res.url.toString());
                toast({
                    title: "Uploaded successfully!",
                    status: "success",
                    duration: "4000",
                    isClosable: true,
                    position: "bottom"
                });
            }).catch(err => console.log(err));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
        setAlert("");
        axios.post("/api/users/auth/register", { email, password, rem, cpass, img, name }).then(res => {
            console.log("done");
            toast({
                title: "Registered successfully!",
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

    const navigateLogin = () => {
        navigate("/auth/login");
    }

    useEffect(() => {
        setAlert("");
    }, [email, password, rem, cpass, name, img]);

    useEffect(() => {
        cook = cookie.get("token");
        if (cook) navigate('/chat');
    }, []);


    return (
        <>
            <Header />
            <div className="formContainer">
                <div className="myForm d-flex justify-content-center align-items-center">
                    <div style={{ display: "flex", width: "50%", backgroundColor: "white", borderRadius: "2rem" }}>
                        <form className="rounded p-4 p-sm-7 signup-form loginContainer">
                            <h1 className="loginHead">Sign up</h1>
                            <FormControl isRequired>
                                <FormLabel>Name</FormLabel>
                                <Input type='text' value={name} onChange={handleName} placeholder='Enter name' />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel marginTop="0.7rem">Email</FormLabel>
                                <Input type='email' value={email} onChange={handleEmail} placeholder='Enter email' />
                                {!isError1 ? (
                                    <FormHelperText>
                                        {"We'll never share your email"}
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Email is required.</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isRequired >
                                <FormLabel marginTop={"0.7rem"}>Password</FormLabel>
                                <InputGroup size='md'>
                                    <Input
                                        pr='4.5rem'
                                        type={show1 ? 'text' : 'password'}
                                        placeholder='Enter password'
                                        value={password}
                                        onChange={handlePassword}
                                    />
                                    <InputRightElement width='fit-content' mr={1} color="RGBA(0, 0, 0, 0.7)">
                                        {show2 ? <span onClick={handleClick2}><PiEyeClosedDuotone fontSize="23px" /></span> : <span onClick={handleClick2}><PiEyeDuotone fontSize="23px" /></span>}
                                    </InputRightElement>
                                </InputGroup>
                                {!isError2 ? (
                                    <FormHelperText>
                                        {"We'll never share your password"}
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Password is required.</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isRequired >
                                <FormLabel marginTop={"0.7rem"}>Confirm Password</FormLabel>
                                <InputGroup size='md'>
                                    <Input
                                        pr='4.5rem'
                                        type={show2 ? 'text' : 'password'}
                                        placeholder='Enter password'
                                        value={cpass}
                                        onChange={handleCpass}
                                    />
                                    <InputRightElement width='fit-content' mr={1} color="RGBA(0, 0, 0, 0.7)">
                                        {show1 ? <span onClick={handleClick1}><PiEyeClosedDuotone fontSize="23px" /></span> : <span onClick={handleClick1}><PiEyeDuotone fontSize="23px" /></span>}
                                        {/* </Button> */}
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl id="pic">
                                <FormLabel marginTop={"0.7rem"}>Upload you picture</FormLabel>
                                <InputGroup size='md'>
                                    <Input
                                        pr='1.5'
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImg}
                                        border={0}
                                    />
                                    <div>
                                        {picLoad ? <Spinner color='red.500' size='lg'></Spinner> : <></>}
                                    </div>

                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <Checkbox colorScheme='red' value={rem} onChange={handleRem} marginTop={4}>
                                    Remember me
                                </Checkbox>
                            </FormControl>
                            {!load ? <Button type="submit" colorScheme='red' marginTop={4} borderRadius="xl" p={4} onClick={handleSubmit}>Sign up</Button> : <Button isLoading colorScheme='red' padding={5} marginTop={4}
                                spinner={<ClipLoader size={25} color='white' />}></Button>}

                            {alert !== "" ? <div className="d-flex m6 p3" style={{ marginTop: "0.4rem" }}>
                                <Alert borderRadius="lg" status='error' margin={2}>
                                    <AlertIcon />
                                    {alert}
                                </Alert>
                            </div> : <></>}

                            <FormLabel marginTop={4}>Already have an account ? <Link onClick={navigateLogin} color='red.500'>Signin here</Link></FormLabel>
                        </form>
                        <div className="verticalLine" />
                        <div style={{ flex: "0.55", backgroundColor: "white", borderRadius: "2rem", display: "flex", justifyItems: "center", alignItems: "center" }}><Image src={IMAGES.image1} alt='logo image' style={{ borderRadius: "2rem" }} /></div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Register;
