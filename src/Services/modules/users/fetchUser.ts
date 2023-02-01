import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<UserAPIResponse, { id: string }>({
    query: ({ id }) => `users/${id}`,
    providesTags: ['User'],
  })

export type UserAPIResponse = {
  id: string
  firebaseUid: string
  name: string
  birthday: string
  gender: string
  imageId: string
  isFollowedByYou: boolean
  isFollowingYou: boolean
}
