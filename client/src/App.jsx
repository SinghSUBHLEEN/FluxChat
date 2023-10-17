import './App.css';
import { Routes, Route } from "react-router-dom";
import { Button } from "react-bootstrap";
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

function Home() {
  return <Button variant='success'>Submit</Button>
}

function App() {
  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/auth/login" Component={Login} />
        <Route path='/auth/register' Component={Register} />
      </Routes>
    </div>
  )
}

export default App;
