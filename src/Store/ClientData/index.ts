import { createSlice } from '@reduxjs/toolkit'
import { LatLng, StorePayload } from '@/Store/utilityTypes'

export const clientDataStore = createSlice({
  name: 'clientData',
  initialState: {
    userLocation: {
      coords: { longitude: 0, latitude: 0 },
      name: 'Unknown location',
    },
  } as ClientDataState,
  reducers: {
    setUserLocation(
      state,
      { payload: { userLocation } }: SetUserLocationPayload,
    ) {
      state.userLocation = userLocation
    },
  },
})

export interface Location {
  coords: LatLng
  name: string
}

export interface ClientDataState {
  userLocation: Location
}

export type SetUserLocationPayload = StorePayload<{
  userLocation: Location
}>
