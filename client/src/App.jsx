import './App.css';
import { Routes, Route } from "react-router-dom";
import { Button } from "react-bootstrap";
import Header from './components/Header/Header';

function Home() {
  return <Button variant='success'>Submit</Button>
}

function App() {
  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route path="/" Component={Home}></Route>
      </Routes>
    </div>
  )
}

export default App;
