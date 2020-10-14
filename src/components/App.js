import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Header from './Header';
import MainStats from './MainStats';
import WeaponAndMapStats from './WeaponAndMapStats';
import ProfileData from './ProfileData';
import Loading from './Loading';
import Alert from './Alert';

function App() {
  const [weaponData, setWeaponData] = useState({});
  const [mapData, setMapData] = useState({});
  const [mainStats, setMainStats] = useState({});
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState(0);
  const [loading, setLoading] = useState(false);

  // The function which populates initial webpage data
  useEffect(() => {
    const fetchProfileData = async () => {
      fetchProfileDataById('76561198047422083');
    }
    fetchProfileData();
  },[]);

  // The function that rerenders page upon loading new data
  useEffect(() => {
    console.log('Loading...');
  },[loading, profileData]);

  // The function which fetches and sets profile and stats state for the given id
  const fetchProfileDataById = async (id) => {
    try {
      console.log('fetchingProfileData');
      const url = `/api/csgo/user/${id}`;
      setLoading(true);
      const response = await axios(url);
      const data = response.data;
      resetStates();
      setProfileData(data);
      if(data.communityvisibilitystate !== 3){
        setError(1);
      } else if(await doesntOwnGame(id)) {
        setError(2);
      } else {
        fetchStatsData(id);
      }
    } catch (error) {
      setError(3);
    } finally {
      setLoading(false);
    }
  }

  // The function which fetches and sets stats data for the given id
  const fetchStatsData = async (id) => {
    try{
      const url = `/api/csgo/user/stats/${id}`;
      setLoading(true);
      const response = await axios(url);
      const data = response.data;
      setStatsData(data);
    } catch(e){
      setError(1);
    } finally {
      setLoading(false);
    }
  }

  // The function which fetches id for the given custom url
  const fetchProfileDataByURL = async (URL) => {
    try {
      const url = `/api/csgo/user/vanityurl/${URL}`;
      resetStates();
      setLoading(true);
      const response = await axios(url);
      const id = response.data.id;
      fetchProfileDataById(id);
    } catch (err) {
      resetStates();
      setError(3);
    } finally {
      setLoading(false);
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
      const url = `/api/csgo/user/${id}/ownsgame`;
      const response = await axios(url);
      const data = response.data;
      return !data.response;

    } catch (error) {
        console.log(error);
    }
  }

  // The function which sets weapons,maps and main stats data
  const setStatsData = (data) => {
    setMainStats(data.mainStats);
    setMapData(data.maps);
    setWeaponData(data.weapons);
  }

  return (
    <div className="App">
      <Header getProfileDataById={fetchProfileDataById} getProfileDataByUrl={fetchProfileDataByURL}/>
      <Container>
        { !isObjectEmpty(profileData) ? <ProfileData profile={profileData}/> : null}
        {error !== 0 ? <Alert error={error}/> : null}
        {loading ? <Loading/> : null}
        { !isObjectEmpty(mainStats) ? <MainStats stats={mainStats}/> : null} 
        { !isObjectEmpty(weaponData) ? <WeaponAndMapStats weapons={weaponData} maps={mapData}/> : null}
      </Container>
    </div>
  );
}

export default App;
