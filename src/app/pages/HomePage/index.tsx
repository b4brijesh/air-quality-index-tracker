import { useEffect } from 'react';
import { Navbar, Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { AqiHistoryChart, AqiComparisonChart } from './Charts';
import { LiveAqiTable } from './LiveAqiTable';
import { useAqiSlice } from './slice';
import {
  selectCities,
  selectCurrentCityName,
  selectSubscriptionState,
} from './slice/selectors';

export function HomePage() {
  const dispatch = useDispatch();

  const { actions } = useAqiSlice();
  const cities = useSelector(selectCities);
  const subscribing = useSelector(selectSubscriptionState);
  const currentCityName = useSelector(selectCurrentCityName);
  const currentCity = cities?.find(city => city.name === currentCityName);

  useEffect(() => {
    console.log('Subscribing to web socket');
    dispatch(actions.subscribe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const selectedCity = cities?.find(city => city.name === currCityName);

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
                <LiveAqiTable cities={cities} />
              </div>
              <div className="col-6 align-middle">
                <AqiComparisonChart cities={cities} />
              </div>
            </div>
            <hr />
            <div className="row p-5">
              <div className="col-12">
                {currentCity ? (
                  <AqiHistoryChart city={currentCity} />
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
