import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<null, { id: string }>({
    query: arg => {
      const { id } = arg
      return {
        method: 'PATCH',
        url: `meetings/${id}/cancel`,
      }
    },
    invalidatesTags: ['MeetingDetails', 'MeetingsOwn'],
  })
