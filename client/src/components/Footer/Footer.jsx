import "./Footer.css";
import {
    MDBFooter,
    MDBContainer,
} from 'mdb-react-ui-kit';
import { BiLogoGithub } from "react-icons/bi"
import { MdAlternateEmail } from "react-icons/md";
import Header from "../Header/Header";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { AiFillLinkedin } from "react-icons/ai";

// import GitHubIcon from '@mui/icons-material/GitHub';
// import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

export default function Footer() {

    const handleGit = () => {

    }

    const date = new Date();

    return <>

        {/* <div></div>
        <hr className="break" />

        <div className="c">
            <h5 className="h">Copyright &copy; 2023 Algorithmic All rights reserved.</h5>
            <a class="footer-link" href="https://github.com/SinghSUBHLEEN/Algorithmic/tree/master">Github</a>
        </div>
        <div className="end"></div> */}
        <MDBFooter className='custom-footer bg-dark text-center text-white'>

            <Box display="flex" width="100%" padding={3} height="100%" bg="rgba(15,15,15)" justifyContent="center">
                <Tooltip label="https://github.com/SinghSUBHLEEN/FluxChat" hasArrow>
                    <span style={{ margin: "5px" }}>
                        <IconButton
                            isRound={true}
                            variant="outline"
                            aria-label='Call Segun'
                            size='md'
                            color="white"
                            borderWidth="0"
                            _hover={{ bg: "whiteAlpha.200" }}
                            icon={<a className="git-link" target="_blank" href="https://github.com/SinghSUBHLEEN/FluxChat"><BiLogoGithub fontSize="35px" /></a>}
                        />
                    </span>
                </Tooltip>
                <Tooltip label="https://www.linkedin.com/in/subhleen-singh-489362169/" hasArrow>
                    <span style={{ margin: "5px" }}><IconButton
                        isRound={true}
                        variant="outline"
                        aria-label='Call Segun'
                        size='md'
                        color="white"
                        borderWidth="0"
                        _hover={{ bg: "whiteAlpha.200" }}
                        icon={<a className="git-link" target="_blank" href="https://www.linkedin.com/in/subhleen-singh-489362169/"><AiFillLinkedin fontSize="30px" /></a>}
                    /></span>
                </Tooltip>
                <Tooltip label="subhleensingh96@gmail.com" hasArrow>
                    <span style={{ margin: "5px" }}><IconButton
                        isRound={true}
                        variant="outline"
                        aria-label='Call Segun'
                        size='md'
                        color="white"
                        borderWidth="0"
                        _hover={{ bg: "whiteAlpha.200" }}
                        icon={<a className="git-link" target="_blank" href="mailto:subhleensingh96@gmail.com"><MdAlternateEmail fontSize="30px" /></a>}
                    /></span>
                </Tooltip>
            </Box>
            <Box display="flex" width="100%" fontSize={"lg"} pt={10} justifyContent="center" padding={3} height="100%" bg="rgba(15,15,15,0.5)" >
                <span style={{ marginTop: "20px", marginBottom: "20px" }}>© {date.getFullYear()} Copyright:{"  FluxChat"}</span>
            </Box>

        </MDBFooter>
    </>
}