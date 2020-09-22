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
                        <ul className="list-inline">
                            <li className="list-inline-item"><a href={profile.profileurl} target="_blank" rel="noopener noreferrer" className="text-dark"><Image src={process.env.PUBLIC_URL + 'images/other_icons/steam-icon_8.png'} width="25px" height="25px"/> Steam profile</a></li>
                            <li className="list-inline-item">{profile.realname}</li>
                            <li className="list-inline-item"><Image src={process.env.PUBLIC_URL + 'images/flags/' + profile.loccountrycode + '.png'}/></li>
                            <li className="list-inline-item">{fullCountryName ? fullCountryName : null}</li>
                        </ul>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
 
export default ProfileData;