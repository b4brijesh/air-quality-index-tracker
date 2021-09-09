/* --- STATE --- */
export interface AqiState {
  subscribing: boolean;
  cities?: City[];
  currentCityName?: string;
}

export interface City {
  name: string;
  aqiReadings: {
    value: number;
    timestamp: number;
  }[];
}

export interface AqiSocketDataPoint {
  city: string;
  aqi: number;
}

export enum AirQualityStandards {
  GOOD,
  SATISFACTORY,
  MODERATE,
  POOR,
  VERY_POOR,
  SEVERE,
}
