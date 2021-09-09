import moment from 'moment';
import { useEffect, useState } from 'react';
import { Navbar, Spinner, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';
import { useAqiSlice } from './slice';
import { selectCities, selectSubscribingState } from './slice/selectors';
import { AirQualityStandards, City } from './slice/types';

export function HomePage() {
  const [currCityName, setCurrCityName] = useState<string | undefined>('');
  const dispatch = useDispatch();

  const { actions } = useAqiSlice();
  const cities = useSelector(selectCities);
  const subscribing = useSelector(selectSubscribingState);

  useEffect(() => {
    console.log('Subscribing to web socket');
    dispatch(actions.subscribe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLatestAqi = (city: City) =>
    Math.round(city.aqiReadings[city.aqiReadings.length - 1].value * 100) / 100;

  const latestCityData = cities?.map(city => ({
    city: city.name,
    aqi: getLatestAqi(city),
  }));

  const getAqiStandards = (city: City) => {
    const aqi = getLatestAqi(city);
    if (aqi <= 50) return AirQualityStandards.GOOD;
    else if (aqi <= 100) return AirQualityStandards.SATISFACTORY;
    else if (aqi <= 200) return AirQualityStandards.MODERATE;
    else if (aqi <= 300) return AirQualityStandards.POOR;
    else if (aqi <= 400) return AirQualityStandards.VERY_POOR;
    else return AirQualityStandards.SEVERE;
  };

  const getMinMaxAqi = (city: City) => {
    const values = city.aqiReadings.map(aqi => aqi.value);
    return [Math.floor(Math.min(...values)), Math.ceil(Math.max(...values))];
  };

  const getMinMaxTimestamp = (city: City) => {
    const values = city.aqiReadings.map(aqi => aqi.timestamp);
    return [Math.floor(Math.min(...values)), Math.ceil(Math.max(...values))];
  };

  const selectedCity = cities?.find(city => city.name === currCityName);

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A live AQI tracker homepage" />
      </Helmet>
      <Navbar className="border mb-5">
        <div className="container">
          <Navbar.Brand className="fw-bold">
            Live Air Quality Index (AQI) Tracker
          </Navbar.Brand>
        </div>
      </Navbar>

      {subscribing && (
        <div className="d-flex justify-content-center">
          <Spinner animation="grow" />
        </div>
      )}

      <div className="container">
        {cities && (
          <>
            <div className="row" style={{ minHeight: '60vh' }}>
              <div className="col-6">
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
                        onClick={() => setCurrCityName(city.name)}
                      >
                        <td>{city.name}</td>
                        <td>{getLatestAqi(city)}</td>
                        <td>
                          {moment
                            .unix(
                              city.aqiReadings[city.aqiReadings.length - 1]
                                .timestamp / 1000,
                            )
                            .fromNow()}
                        </td>
                      </ColoredTableRow>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="col-6 align-middle">
                {latestCityData ? (
                  <ResponsiveContainer width={650} height="100%">
                    <BarChart data={latestCityData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="city"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis domain={[0, 500]} />
                      <Tooltip formatter={(value: number) => [value, 'AQI']} />
                      <Legend verticalAlign="top" />
                      <Bar dataKey="aqi" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <>No data to display</>
                )}
              </div>
            </div>
            <hr />
            <div className="row p-5">
              <div className="col-12">
                {selectedCity ? (
                  <>
                    <h4 className="text-center p-2">
                      Previous AQI readings of {selectedCity.name}
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={selectedCity.aqiReadings}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                      >
                        <Line
                          type="linear"
                          dataKey="value"
                          stroke="#8884d8"
                          isAnimationActive={false}
                        />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis
                          type="number"
                          dataKey="timestamp"
                          domain={[
                            getMinMaxTimestamp(selectedCity)[0],
                            getMinMaxTimestamp(selectedCity)[1],
                          ]}
                          hide
                        />
                        <YAxis
                          domain={[
                            getMinMaxAqi(selectedCity)[0] - 5,
                            getMinMaxAqi(selectedCity)[1] + 5,
                          ]}
                        />
                        <Tooltip
                          formatter={(value, name) => [value, 'AQI']}
                          labelFormatter={(label, payload) => [
                            moment.unix(label / 1000).fromNow(),
                          ]}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="text-center fw-bold">
                    Select a city to see it's AQI history
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
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
