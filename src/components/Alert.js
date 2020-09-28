import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BootstrapAlert from 'react-bootstrap/Alert';
const Alert = ({error}) => {
    const createErrorObj = (errorCode) => {
        const errorObj = {
            heading: '',
            message: '' 
        };

        if(errorCode === 1){
            errorObj.heading = 'PROFILE PRIVATE';
            errorObj.message = <p>To view your stats you must set your game data to public by going to your <b>Steam Profile --&gt; Edit Profile --&gt; Privacy Settings --&gt; Set: "My profile: Public" and "Game details: public"</b></p>;
        } else if(errorCode === 2){
            errorObj.heading = `PROFILE DIDN'T PLAY ANY GAMES`;
        } else if(errorCode === 3){
            errorObj.heading = 'PROFILE NOT FOUND';
            errorObj.message = <p>Specified profile doesn't exist.</p>
        }

        return errorObj;
    }

    const errorObj = createErrorObj(error);
    return (  
        <Row className="mt-2">
            <Col>
                <BootstrapAlert variant="danger">
                    <BootstrapAlert.Heading>{errorObj.heading}</BootstrapAlert.Heading>
                    {errorObj.message}
                </BootstrapAlert>
            </Col>
        </Row>

    );
}
 
export default Alert;