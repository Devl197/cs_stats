import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { data } from '../countries';
import './ProfileData.css';

const ProfileData = ({profile}) => {
    const findCountry = (countryCode) => {
        if(countryCode)
            for(let i = 0; i < data.length; ++i){
                if(data[i].alpha2 === countryCode.toLowerCase()){
                    return data[i].name;
                }
            }
       return null;
    }
    const returnStateString = (profileStateNum) => {
        switch(profileStateNum){
            case 0:
                return 'Offline';
            case 1:
                return 'Online';
            case 2:
                return 'Busy'
            case 3:
                return 'Away';
            case 4:
                return 'Snooze';
            case 5:
                return 'Looking_to_trade'
            case 6:
                return 'Looking_to_play';
            default:
                return 'Offline';
        }
    }
    const state = returnStateString(profile.profilestate);
    const fullCountryName = findCountry(profile.loccountrycode);
    return (  
        <Row className="pb-4 mt-3 border-bottom">
            <Col>
                <Row>
                    <Col md={2}>
                        <Image className={state.toLocaleLowerCase()} src={profile.avatarfull} fluid/>
                    </Col>
                    <Col md={10}>
                        <h1 className="profile_name">{profile.personaname}</h1>
                        <ul className="list-inline">
                            <li className="list-inline-item"><a href={profile.profileurl} target="_blank" rel="noopener noreferrer" className="text-dark"><Image src={process.env.PUBLIC_URL + 'images/other_icons/steam-icon_8.png'} width="25px" height="25px"/> Steam profile</a></li>
                            <li className="list-inline-item">{profile.realname}</li>
                            <li className="list-inline-item">{profile.loccountrycode ? <Image src={process.env.PUBLIC_URL + 'images/flags/' + profile.loccountrycode + '.png'} /> : null}</li>
                            <li className="list-inline-item">{fullCountryName ? fullCountryName : null}</li>
                        </ul>
                        <p id="state" className={state.toLocaleLowerCase()}>{state.replaceAll('_', ' ')}</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
 
export default ProfileData;