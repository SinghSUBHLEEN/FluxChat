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
import "./Login.css";
import IMAGES from "../../images/Images";
import { useNavigate } from "react-router-dom";
import axios from "axios"

function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false)
    const [rem, setRem] = useState(false);


    const handleRem = () => setRem(!rem);
    const handleClick = () => setShow(!show)
    const handleEmail = (e) => setEmail(e.target.value)
    const handlePassword = (e) => setPassword(e.target.value);

    const handleRegister = () => {
        navigate("/auth/register");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/auth/login", { email, password, rem }).then(data => {
            console.log("posted successfully");
        }).catch(err => console.log(err));
    }


    const isError1 = email === '';
    const isError2 = password === '';


    return (
        <div className="formContainer">
            <div className="myForm d-flex justify-content-center align-items-center">
                <div style={{ display: "flex", width: "50%", backgroundColor: "white", borderRadius: "2rem" }}>
                    <div style={{ flex: 0.6, backgroundColor: "white", borderRadius: "2rem", display: "flex", justifyItems: "center", alignItems: "center" }}><Image src={IMAGES.image1} alt='logo image' style={{ borderRadius: "2rem" }} /></div>
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

                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick} style={{ backgroundColor: "white", boxShadow: 'none' }}>
                                        {show ? 'Hide' : 'Show'}
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
                        <FormControl>
                            <Checkbox colorScheme='teal' value={rem} onChange={handleRem} marginTop={4}>
                                Remember me
                            </Checkbox>
                        </FormControl>
                        <Button type="submit" colorScheme='teal' marginTop={4} borderRadius={"0.6rem"} p={4} onClick={handleSubmit}>Sign in</Button>
                        <FormLabel marginTop={4}> No account ? <Link onClick={handleRegister} color='teal.500'>Create here</Link></FormLabel>
                    </form>
                </div>

            </div>
        </div >
    )
}

export default Login;
