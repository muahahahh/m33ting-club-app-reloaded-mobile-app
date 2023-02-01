import { createSlice } from '@reduxjs/toolkit'

export const loadingIndicatorSlice = createSlice({
  name: 'loadingIndicator',
  initialState: { isLoading: false } as LoadingIndicatorState,
  reducers: {
    setLoading(state) {
      state.isLoading = true
    },
    setLoaded(state) {
      state.isLoading = false
    },
  },
})

export interface LoadingIndicatorState {
  isLoading: boolean
}
