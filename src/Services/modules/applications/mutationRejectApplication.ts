import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<null, { meetingId: string; userId: string }>({
    query: arg => {
      const { meetingId, userId } = arg
      return {
        method: 'PATCH',
        url: `applications/${meetingId}/user/${userId}/reject`,
      }
    },
    invalidatesTags: ['Applications'],
  })
