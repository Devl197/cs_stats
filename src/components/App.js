import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Header from './Header';
import MainStats from './MainStats';
import WeaponAndMapStats from './WeaponAndMapStats';
import ProfileData from './ProfileData';
import Alert from './Alert';
import './App.css';

function App() {
  const [weaponData, setWeaponData] = useState({});
  const [mapData, setMapData] = useState({});
  const [mainStats, setMainStats] = useState({});
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState(0);
  const key = process.env.REACT_APP_API_KEY;

  // The function which populates initial webpage data
  useEffect(() => {
    const fetchProfileData = async () => {
      fetchProfileDataById('76561198047422083');
    }
    fetchProfileData();
  },[]);

  // The function which fetches and sets profile and stats state for the given id
  const fetchProfileDataById = async (id) => {
    try {
      console.log('fetchingProfileData');
      const url = `/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${id}`;
      const response = await fetch(url);
      const data = await response.json();
      resetStates();
      setProfileData(data.response.players[0]);
      if(data.response.players[0].communityvisibilitystate !== 3){
        setError(1);
      } else if(await doesntOwnGame(id)) {
        setError(2);
      } else {
        fetchStatsData(id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // The function which fetches and sets stats data for the given id
  const fetchStatsData = async (id) => {
    try{
      const url = `/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${key}&steamid=${id}`;
      const response = await fetch(url);
      if(response.ok){
        const data = await response.json();
        setStatsData(data);
      } else {
        setError(1);
      }
    } catch(e){
      console.log(e);
    }
  }

  // The function which fetches id for the given custom url
  const fetchProfileDataByURL = async (URL) => {
    try {
      const url = `/ISteamUser/ResolveVanityURL/v0001/?key=${key}&vanityurl=${URL}`;
      const response = await fetch(url);
      const data = await response.json();
      // code 42 means that there is no match
      if(data.response.success !== 42){
        const id = data.response.steamid;
        fetchProfileDataById(id);
      } else {
        resetStates();
        setError(3);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // The function which resets states to their initial value 
  const resetStates = () => {
    setProfileData({});
    setMapData({});
    setWeaponData({});
    setMainStats({});
    setError(0);
  }

  // The function which checks if the given object is empty
  const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  // The function which checks if the profile with a certain id doesn't own a game
  const doesntOwnGame = async (id) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'  
      };
      const response = await fetch(`/IPlayerService/GetOwnedGames/v0001/?key=${key}&format=json&input_json={"steamid":${id}, "appids_filter":[730]}`, requestOptions);
      const data = await response.json();
      return isObjectEmpty(data.response);

    } catch (error) {
        console.log(error);
    }
  }

  // The function which sets weapons,maps and main stats data
  const setStatsData = (data) => {
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

  }

  // The function which filters and transforms a name-value pair into a weapon object
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
  
  // The function which filters and transforms a name-value pair into a map object
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
        { !isObjectEmpty(profileData) ? <ProfileData profile={profileData}/> : null}
        {error !== 0 ? <Alert error={error}/> : null}
        { !isObjectEmpty(mainStats) ? <MainStats stats={mainStats}/> : null} 
        { !isObjectEmpty(weaponData) ? <WeaponAndMapStats weapons={weaponData} maps={mapData}/> : null}
      </Container>
    </div>
  );
}

export default App;
