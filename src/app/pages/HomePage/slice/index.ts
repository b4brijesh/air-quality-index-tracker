import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { aqiSaga } from './saga';
import { AqiSocketDataPoint, AqiState, City } from './types';

export const initialState: AqiState = {
  subscribing: false,
};

const slice = createSlice({
  name: 'aqi',
  initialState,
  reducers: {
    subscribe(state) {
      state.subscribing = true;
    },
    updateData(state, action: PayloadAction<AqiSocketDataPoint[]>) {
      state.subscribing = false;
      const timestamp = new Date().getTime();
      for (const dataPoint of action.payload) {
        if (!state.cities) {
          state.cities = [];
        }
        const cityInState = state.cities.find(
          city => city.name === dataPoint.city,
        );
        if (cityInState) {
          cityInState.aqiReadings.push({
            value: dataPoint.aqi,
            timestamp,
          });
        } else {
          const city: City = {
            name: dataPoint.city,
            aqiReadings: [{ value: dataPoint.aqi, timestamp }],
          };
          state.cities.push(city);
        }
      }
    },
    setCurrentCityName(state, action: PayloadAction<string>) {
      state.currentCityName = action.payload;
    },
  },
});

export const { actions: aqiActions } = slice;

export const useAqiSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: aqiSaga });
  return { actions: slice.actions };
};
