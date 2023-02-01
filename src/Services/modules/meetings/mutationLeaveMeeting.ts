import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<null, { id: string }>({
    query: arg => {
      const { id } = arg
      return {
        method: 'POST',
        url: `meetings/${id}/leave`,
      }
    },
    invalidatesTags: (_result, _error) => {
      if (!_error) {
        return [
          'MeetingDetails',
          'MeetingsOwn',
          'MeetingsExplore',
          'Applications',
        ]
      }
      return []
    },
  })
