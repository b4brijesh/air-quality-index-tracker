import moment from 'moment';
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
import { getLatestAqi } from './LiveAqiTable';
import { City } from './slice/types';

export interface AqiHistoryChartProps {
  city: City;
}

export function AqiHistoryChart({ city }: AqiHistoryChartProps) {
  const getMinMaxAqi = (city: City) => {
    const values = city.aqiReadings.map(aqi => aqi.value);
    return [Math.floor(Math.min(...values)), Math.ceil(Math.max(...values))];
  };

  const getMinMaxTimestamp = (city: City) => {
    const values = city.aqiReadings.map(aqi => aqi.timestamp);
    return [Math.floor(Math.min(...values)), Math.ceil(Math.max(...values))];
  };

  return (
    <>
      <h4 className="text-center p-2">Previous AQI readings of {city.name}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={city.aqiReadings}
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
            domain={[getMinMaxTimestamp(city)[0], getMinMaxTimestamp(city)[1]]}
            hide
          />
          <YAxis
            domain={[getMinMaxAqi(city)[0] - 5, getMinMaxAqi(city)[1] + 5]}
          />
          <Tooltip
            formatter={value => [value, 'AQI']}
            labelFormatter={label => [moment.unix(label / 1000).fromNow()]}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export interface AqiComparisonChartProps {
  cities: City[];
}

export function AqiComparisonChart({ cities }: AqiComparisonChartProps) {
  const latestCityData = cities?.map(city => ({
    city: city.name,
    aqi: getLatestAqi(city),
  }));

  return (
    <ResponsiveContainer width={650} height="100%">
      <BarChart data={latestCityData} margin={{ bottom: 100 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="city" interval={0} angle={-45} textAnchor="end" />
        <YAxis domain={[0, 500]} />
        <Tooltip formatter={(value: number) => [value, 'AQI']} />
        <Legend verticalAlign="top" />
        <Bar dataKey="aqi" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
