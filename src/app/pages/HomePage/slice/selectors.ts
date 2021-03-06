import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.aqi || initialState;

export const selectCities = createSelector(
  [selectSlice],
  state => state.cities,
);

export const selectSubscriptionState = createSelector(
  [selectSlice],
  state => state.subscribing,
);

export const selectCurrentCityName = createSelector(
  [selectSlice],
  state => state.currentCityName,
);
