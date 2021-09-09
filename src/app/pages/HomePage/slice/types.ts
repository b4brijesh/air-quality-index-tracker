/* --- STATE --- */
export interface AqiState {
  subscribing: boolean;
  // aqiData?: Array<AqiSocketDataPoint & Pick<AqiSocketMessage, 'timestamp'>>;
  cities?: Array<City>;
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
