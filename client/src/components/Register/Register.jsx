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
} from "@chakra-ui/react";
import { useState } from "react";
import "./Register.css";
import IMAGES from "../../images/Images";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpass, setCpass] = useState('');
    const [name, setName] = useState('');
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [img, SetImg] = useState("");
    const [rem, setRem] = useState(false);


    const handleCpass = (e) => setCpass(e.target.value);
    const handleRem = () => setRem(!rem);
    const handleName = (e) => setName(e.target.value);
    const handleClick1 = () => setShow1(!show1)
    const handleClick2 = () => setShow2(!show2)
    const handleEmail = (e) => setEmail(e.target.value)
    const handlePassword = (e) => setPassword(e.target.value);
    const handleImg = (e) => SetImg(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post("/auth/register", { email, password, cpass, name, rem, img }).then(data => {
            console.log("posted successfully");
        }).catch(err => console.log(err));

    }


    const isError1 = email === '';
    const isError2 = password === '';

    const navigateLogin = () => {
        navigate("/auth/login");
    }


    return (
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

                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick1} style={{ backgroundColor: "white", boxShadow: 'none' }}>
                                        {show1 ? 'Hide' : 'Show'}
                                    </Button>
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

                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick2} style={{ backgroundColor: "white", boxShadow: 'none' }}>
                                        {show2 ? 'Hide' : 'Show'}
                                    </Button>
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

                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <Checkbox colorScheme='teal' value={rem} onChange={handleRem} marginTop={4}>
                                Remember me
                            </Checkbox>
                        </FormControl>
                        <Button type="submit" colorScheme='teal' marginTop={4} borderRadius={"0.6rem"} p={4} onClick={handleSubmit}>Sign up</Button>
                        <FormLabel marginTop={4}>Already have an account ? <Link onClick={navigateLogin} color='teal.500'>Signin here</Link></FormLabel>
                    </form>
                    <div className="verticalLine" />
                    <div style={{ flex: "0.55", backgroundColor: "white", borderRadius: "2rem", display: "flex", justifyItems: "center", alignItems: "center" }}><Image src={IMAGES.image1} alt='logo image' style={{ borderRadius: "2rem" }} /></div>
                </div>

            </div>
        </div>
    )
}

export default Register;
