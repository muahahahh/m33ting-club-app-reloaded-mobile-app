import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<string, FollowUserAPIRequest>({
    query: ({ id }) => ({
      url: `users/${id}/follow`,
      method: 'POST',
    }),
    invalidatesTags: ['UserFollowers', 'UserFollowings', 'User', 'UserMe'],
  })

export type FollowUserAPIRequest = {
  id: string
}
