import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<UsersMeAPIResponse, undefined>({
    query: () => 'users/me',
    providesTags: ['UserMe'],
  })

export type UsersMeAPIResponse = {
  id: string
  firebaseUid: string
  name: string
  birthday: string
  gender: string
}
