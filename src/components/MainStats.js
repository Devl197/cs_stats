import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const MainStats = ({stats}) => {
    const calculatePercentage = (numerator, denominator) => (numerator / denominator) * 100;
    const convertSecondsToHours = (seconds) => parseInt(seconds / 3600);
    const timePlayed = convertSecondsToHours(stats.total_time_played);
    const winPercentage = calculatePercentage(stats.total_wins, stats.total_rounds_played).toFixed(2);
    const kdRatio = (stats.total_kills / stats.total_deaths).toFixed(2);
    const accuracy = calculatePercentage(stats.total_shots_hit, stats.total_shots_fired,  ).toFixed(2);
    const headshotPercentage = calculatePercentage(stats.total_kills_headshot, stats.total_kills).toFixed(2);

    return (  
        <Row>
            <Col md={3}>
                <p>Kills: {stats.total_kills}</p>
                <p>Time: {timePlayed}h</p>
                <p>Win: {winPercentage}%</p>
            </Col>
            <Col md={6}>
                <p>{kdRatio}</p>
            </Col>
            <Col md={3}>
                <p>Accuracy: {accuracy}%</p>
                <p>Headshot: {headshotPercentage}%</p>
                <p>MVP's: {stats.total_mvps}</p>  
            </Col>
        </Row>
    );
}
 
export default MainStats;