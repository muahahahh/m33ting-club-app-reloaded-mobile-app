import { AuthState } from '@/Store/Auth/index'

export const authSelector = (state: { auth: AuthState }) => {
  return state.auth
}
