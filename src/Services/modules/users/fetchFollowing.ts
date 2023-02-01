import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { GenericPaginatedAPIResponse } from '@/Services/api'

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<FollowingAPIResponse, { id: string }>({
    query: ({ id }) => `users/${id}/following`,
    providesTags: ['UserFollowings'],
  })

export type FollowingSingleAPIResponse = {
  userId: string
  userName: string
  userImageId: string
  followingSince: string
}

export type FollowingAPIResponse =
  GenericPaginatedAPIResponse<FollowingSingleAPIResponse>
