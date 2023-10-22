import './App.css';
import { Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Chat from './components/Chat/Chat';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from "js-cookie";
import { ModalCloseButton, ModalContent, ModalOverlay, useDisclosure, Button, Container, Modal, ModalBody, ModalHeader, Spinner } from '@chakra-ui/react';
import { SyncLoader } from 'react-spinners';
import NotFound from './components/NotFound/NotFound';
import Footer from './components/Footer/Footer';


function Home() {

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal closeOnOverlayClick={onClose} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="transparent" ml="auto"
          mr="auto"
          mt="auto"
          mb="auto">
          <SyncLoader
            style={{ marginLeft: "auto", marginRight: "auto" }}
            size={18}
            color='#e53e3e'
            speedMultiplier={0.85}
          />
        </ModalContent>
      </Modal>
    </>
  )
}


function App() {
  return (
    <div className='App'>

      <Routes>
        <Route path="*" Component={NotFound} />
        <Route path="/chat" Component={Chat} />
        <Route path="/" Component={Chat} />
        <Route path="/home" Component={Chat} />
        <Route path="/auth/login" Component={Login} />
        <Route path='/auth/register' Component={Register} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
