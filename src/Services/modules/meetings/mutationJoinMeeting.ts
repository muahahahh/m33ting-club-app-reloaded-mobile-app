import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<null, { id: string; isPublic: boolean }>({
    query: arg => {
      const { id } = arg
      return {
        method: 'POST',
        url: `meetings/${id}/join`,
      }
    },
    invalidatesTags: (_result, _error, { isPublic }) => {
      if (isPublic && !_error) {
        return [
          'MeetingDetails',
          'MeetingsOwn',
          'MeetingsExplore',
          'Applications',
        ]
      } else {
        return ['MeetingDetails', 'MeetingsOwn', 'Applications']
      }
    },
  })
