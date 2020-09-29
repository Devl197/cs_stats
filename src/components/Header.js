import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

const Header = ({getProfileDataById, getProfileDataByUrl}) => {
    const [searchValue, setSearchValue] = useState('');

    // On change handler for the search input
    const searchValueHandler = (event) => setSearchValue(event.target.value);

    // On click handler for the search button
    const search = () => {
        if(searchValue !== ''){
            const id = /\d{17}/;
            if(id.test(searchValue)){
                getProfileDataById(searchValue);
            } else {
                getProfileDataByUrl(searchValue);
            }
        }
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
                        placeholder="Enter a Steam ID or custom Steam username"
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