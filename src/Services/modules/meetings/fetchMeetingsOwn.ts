import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<
    Array<MeetingOwn>,
    { role: string; statuses: Array<string>; limit: number; offset: number }
  >({
    query: arg => {
      const { role, statuses, limit, offset } = arg
      return {
        url: 'meetings/own',
        params: { role, statuses, limit, offset },
      }
    },
    providesTags: ['MeetingsOwn'],
  })

export type MeetingOwn = {
  id: string
  name: string
  startDate: string
  distance: number
  imageId: string
}
