import moment from 'moment';
import { Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useAqiSlice } from './slice';
import { AirQualityStandards, City } from './slice/types';

export const getLatestAqi = (city: City) =>
  Math.round(city.aqiReadings[city.aqiReadings.length - 1].value * 100) / 100;

const getAqiStandards = (city: City) => {
  const aqi = getLatestAqi(city);
  if (aqi <= 50) return AirQualityStandards.GOOD;
  else if (aqi <= 100) return AirQualityStandards.SATISFACTORY;
  else if (aqi <= 200) return AirQualityStandards.MODERATE;
  else if (aqi <= 300) return AirQualityStandards.POOR;
  else if (aqi <= 400) return AirQualityStandards.VERY_POOR;
  else return AirQualityStandards.SEVERE;
};

export interface LiveAqiTableProps {
  cities: City[];
}

export function LiveAqiTable({ cities }: LiveAqiTableProps) {
  const dispatch = useDispatch();
  const { actions } = useAqiSlice();

  return (
    <Table bordered hover size="sm" className="text-center">
      <thead>
        <tr>
          <th>City</th>
          <th>Live AQI</th>
          <th>Last updated</th>
        </tr>
      </thead>
      <tbody>
        {cities.map(city => (
          <ColoredTableRow
            key={city.name}
            color={getAqiStandards(city).toString()}
            onClick={() => dispatch(actions.setCurrentCityName(city.name))}
          >
            <td>{city.name}</td>
            <td>{getLatestAqi(city)}</td>
            <td>
              {moment
                .unix(
                  city.aqiReadings[city.aqiReadings.length - 1].timestamp /
                    1000,
                )
                .fromNow()}
            </td>
          </ColoredTableRow>
        ))}
      </tbody>
    </Table>
  );
}

const ColoredTableRow = styled.tr`
  cursor: pointer;
  ${props =>
    props.color === AirQualityStandards.GOOD.toString() &&
    `background: rgb(0, 176, 80);`}
  ${props =>
    props.color === AirQualityStandards.SATISFACTORY.toString() &&
    `background: rgb(146, 208, 80);`}
  ${props =>
    props.color === AirQualityStandards.MODERATE.toString() &&
    `background: rgb(255, 255, 0);`}
  ${props =>
    props.color === AirQualityStandards.POOR.toString() &&
    `background: rgb(255, 153, 0);`}
  ${props =>
    props.color === AirQualityStandards.VERY_POOR.toString() &&
    `background: rgb(255, 0, 0);`}
  ${props =>
    props.color === AirQualityStandards.SEVERE.toString() &&
    `background: rgb(192, 0, 0);`}
`;
