import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './Header';
import MainStats from './MainStats';
import WeaponAndMapStats from './WeaponAndMapStats';
import ProfileData from './ProfileData';
import './App.css';

function App() {
  const [weaponData, setWeaponData] = useState();
  const [mapData, setMapData] = useState();
  const [mainStats, setMainStats] = useState();
  const [profileData, setProfileData] = useState();
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
        //fetchProfileDataById('76561198047422083');
    }
    fetchProfileData();
  },[]);

  // Function used for fetching and setting profile and stats state for given id
  const fetchProfileDataById = async (id) => {
    try {
      //const response = await fetch('profile_data.json');
      console.log('fetchingProfileData');
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=6F5F20F0A460975E47AA5614FE4DE924&steamids=${id}`;
      const response = await fetch(proxy + url);
      const data = await response.json();
      // Reseting errors array
      resetErrorState();
      setProfileData(data.response.players[0]);
      if(data.response.players[0].communityvisibilitystate !== 3){
        setErrors([...errors, "Please set your community profile to public and then try again!"]);
      } else if(await doesntOwnGame(id)) {
        setErrors([...errors, "Player doesn't own the game or didn't play it"]);
      } else {
        fetchStatsData(id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function which fetches and sets stats data for given id
  const fetchStatsData = async (id) => {
    try{
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const url = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=6F5F20F0A460975E47AA5614FE4DE924&steamid=${id}`;
      const response = await fetch(proxy + url);
      const data = await response.json();
      const weapons = {};
      const maps = {};
      const mainStats = {};

      data.playerstats.stats.forEach(val => {
        if(val.name === 'total_shots_hit'){
          mainStats['total_shots_hit'] = val.value;
        } else if(val.name === 'total_shots_fired'){
          mainStats['total_shots_fired'] = val.value;
        } else if(val.name === 'total_kills_headshot'){
          mainStats['total_kills_headshot'] = val.value;
        } else if(val.name.includes('total_kills_')
          || val.name.includes('total_shots_')
          || val.name.includes('total_hits_')){
            const weapon = getWeaponData(val.name, val.value);
            if(weapon){
              weapons[weapon.name] = {...weapons[weapon.name], [weapon.property]: weapon.value};
            }
        } else if(val.name.includes('total_rounds_map_')
          || val.name.includes('total_wins_map_')){
            const map = getMapData(val.name, val.value);
            if(map){
            maps[map.name] = {...maps[map.name], [map.property]: map.value};
          } 
        } else {
          mainStats[val.name] = val.value;
        }
      });
      
      setMainStats(mainStats);
      setMapData(maps);
      setWeaponData(weapons);
    } catch(e){
      console.log(e);
    }
  }

  const fetchProfileDataByURL = async (url) => {
    try {
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const _url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=6F5F20F0A460975E47AA5614FE4DE924&vanityurl=${url}`;
      const response = await fetch(proxy + _url);
      const data = await response.json();
      // code 42 means that there is no match
      if(data.response.success !== 42){
        const id = data.response.steamid;
        fetchProfileDataById(id);
      } else {
        resetErrorState();
        setErrors([...errors,'Profile not found!']);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const resetErrorState = () => {
    setErrors(errors.splice(0, errors.length));
  }

  const doesntOwnGame = async (id) => {
    try {
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'  
      };
      const response = await fetch(proxy + `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=6F5F20F0A460975E47AA5614FE4DE924&format=json&input_json={"steamid":${id}, "appids_filter":[730]}`, requestOptions);
      const data = await response.json();
      return Object.keys(data.response).length === 0 && data.response.constructor === Object;

    } catch (error) {
        console.log(error);
    }
  }

  const getWeaponData = (name, value) => {
    const notAllowed = ['against_zoomed_sniper', 'enemy_blinded', 'enemy_weapon', 'knife', 'knife_fight', 'molotov', 'taser', 'hegrenade'];
    let weapon;
    if( (name.includes('total_kills_')
      || name.includes('total_shots_'))
      && !notAllowed.includes(name.substr(12, name.length - 12))){
        weapon = {};
        weapon.name = name.substr(12, name.length - 12);
        weapon.property = name.substr(0,11);
        weapon.value = value;
    } else if(name.includes('total_hits_')) {
      weapon = {};
      weapon.name = name.substr(11, name.length - 11);
      weapon.property = 'total_hits';
      weapon.value = value;
    }
    return weapon;
  }
  const getMapData = (name, value) => {
    const notAllowed = ['ar_baggage', 'ar_monastery', 'ar_shoots', 'de_bank', 'de_house','de_lake', 'de_safehouse', 'de_shorttrain', 'de_stmarc', 'de_sugarcane'];
    let map;
    if(name.includes('total_rounds_map_') && !notAllowed.includes(name.substr(17, name.length - 17))){
      map = {};
      map.name = name.substr(17, name.length - 17);
      map.property = 'total_rounds';
      map.value = value;
    } else if(name.includes('total_wins_map_') && !notAllowed.includes(name.substr(15, name.length - 15))){
      map = {};
      map.name = name.substr(15, name.length - 15);
      map.property = 'total_wins';
      map.value = value;
    }
    return map;
  }
  return (
    <div className="App">
      <Header getProfileDataById={fetchProfileDataById} getProfileDataByUrl={fetchProfileDataByURL}/>
      <Container>
        { profileData ? <ProfileData profile={profileData}/> : null}
        { mainStats ? <MainStats stats={mainStats}/> : null} 
        { weaponData ? <WeaponAndMapStats weapons={weaponData} maps={mapData}/> : null}
      </Container>
    </div>
  );
}

export default App;
