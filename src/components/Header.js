import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

const Header = ({onClick}) => {
    const [searchValue, setSearchValue] = useState('');
    const searchValueHandler = (event) => setSearchValue(event.target.value);

    const search = () => {
        console.log(searchValue);
        onClick();
    }
    return (  
        <Container fluid style={{backgroundColor: 'black'}}>
            <Row>
                <Col>
                    <h1 className="display-1 text-light text-center">CSGO STATS</h1>
                </Col>
            </Row>
            <Row className="h-100 justify-content-center align-items-end">
                <Col md={6}>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Profile"
                        aria-label="Profile"
                        aria-describedby="basic-addon2"
                        value={searchValue}
                        onChange={searchValueHandler}
                        />
                    <InputGroup.Append>
                        <Button variant="secondary" onClick={search}>Search</Button>
                    </InputGroup.Append>
                </InputGroup>
                </Col>
            </Row>
        </Container>
    );
}
 
export default Header;