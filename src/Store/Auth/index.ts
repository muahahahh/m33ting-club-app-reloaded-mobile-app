import { createSlice } from '@reduxjs/toolkit'
import { StorePayload } from '@/Store/utilityTypes'

export const authSlice = createSlice({
  name: 'auth',
  initialState: { user: undefined, token: undefined } as AuthState,
  reducers: {
    setUser(state, { payload: { user } }: SetUserPayload) {
      state.user = user
    },
    setUserToken(state, { payload: { token } }: SetTokenPayload) {
      if (state.user) {
        state.user.token = token
      }
    },
  },
})

export interface AuthStateUser {
  token?: string
  userDetails?: {
    id: string
    name: string
    birthday: string
    gender: string
    firebaseUid: string
    imageId?: string
  }
}

export interface AuthState {
  user?: AuthStateUser
}

type SetUserPayload = StorePayload<{ user?: AuthStateUser }>
type SetTokenPayload = StorePayload<{ token?: string }>
