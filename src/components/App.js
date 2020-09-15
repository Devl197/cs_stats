import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './Header';
import './App.css';

function App() {
  const search = () => {
    console.log('Hello');
  }
  return (
    <div className="App">
      <Header onClick={search}/>
    </div>
  );
}

export default App;
