import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { data } from '../countries';
import './ProfileData.css';

const ProfileData = ({profile}) => {
    const findCountry = (countryCode) => {
       for(let i = 0; i < data.length; ++i){
           if(data[i].alpha2 === countryCode.toLowerCase()){
               return data[i].name;
           }
       }
       return null;
    }
    const fullCountryName = findCountry(profile.loccountrycode);
    return (  
        <Row>
            <Col>
                <Row>
                    <Col md={2}>
                        <Image src={profile.avatarfull} fluid/>
                    </Col>
                    <Col md={10}>
                        <h1>{profile.personaname}</h1>
                        <h4>{profile.realname} <Image src={process.env.PUBLIC_URL + 'images/flags/' + profile.loccountrycode + '.png'}/> {fullCountryName ? fullCountryName : null}</h4>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
 
export default ProfileData;