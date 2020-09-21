import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import './WeaponAndMapStats.css';
const WeaponAndMapStats = ({weapons, maps}) => {
    const weaponKeys = Object.keys(weapons);
    const mapKeys = Object.keys(maps);
    const sortedWeaponKeys = weaponKeys.sort((a,b) =>  weapons[b].total_kills - weapons[a].total_kills);
    const sortedMapKeys = mapKeys.sort((a, b) => maps[b].total_rounds - maps[a].total_rounds);

    const calculatePercentage = (numerator, denominator) => ((numerator / denominator) * 100).toFixed(2);
    return (
        <Row>
            <Col md="6" sm="12">
                <Table hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Weapon: </th>
                            <th>Kills: </th>
                            <th>Shots: </th>
                            <th>Hits: </th>
                            <th>Accuracy: </th>
                        </tr>
                    </thead>
                    <tbody>
                        { sortedWeaponKeys.slice(0,5).map((key, index) => (
                        <tr key={index}>
                            <th>{index + 1}</th>
                            <th className="d-none d-md-table-cell"><Image src={process.env.PUBLIC_URL + 'images/weapon_icons/' + key + '.png'} alt="" width='96px' height='32px' fluid/></th>
                            <th className="d-table-cell d-md-none">{key}</th>
                            <th>{weapons[key].total_kills}</th>
                            <th>{weapons[key].total_shots}</th>
                            <th>{weapons[key].total_hits}</th>
                            <th>{ calculatePercentage(weapons[key].total_hits, weapons[key].total_shots) }%</th>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
            <Col md="6" sm="12">
                <Table hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name: </th>
                            <th>Rounds played: </th>
                            <th>Rounds won: </th>
                            <th>Win rate: </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMapKeys.slice(0,5).map((key, index) => (
                        <tr key={index}>
                            <th>{index + 1}</th>
                            <th className="d-none d-md-table-cell"><Image src={process.env.PUBLIC_URL + 'images/map_icons/collection_icon_' + key + '.png'} width="45px" height="45px" fluid/></th>
                            <th className="d-table-cell d-md-none">{key}</th>
                            <th>{maps[key].total_rounds}</th>
                            <th>{maps[key].total_wins}</th>
                            <th>{calculatePercentage(maps[key].total_wins, maps[key].total_rounds, )}%</th>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
        );
}
 
export default WeaponAndMapStats;