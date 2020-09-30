import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
    return (  
        <Row className="mt-4">
            <Col className="d-flex justify-content-center">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
                <p className="ml-2 d-inline font-weight-bold" style={{fontSize:'22px'}} >Loading...</p>
            </Col>
        </Row>
    );
}
 
export default Loading;