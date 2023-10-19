import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./morph.css";
import ChatProvider from "./components/Context/ChatProvider";
import { Container } from 'react-bootstrap';



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>,
)
