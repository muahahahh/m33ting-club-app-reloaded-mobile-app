import { ClientDataState } from '@/Store/ClientData/index'

export const userLocationSelector = (state: { clientData: ClientDataState }) =>
  state.clientData.userLocation
