import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './Header';
import './App.css';

function App() {
  const [weaponData, setWeaponData] = useState();
  const [mapData, setMapData] = useState();
  const [mainStats, setMainStats] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await fetch('csgo_response.json');
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
    fetchData();
  },[]);

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
