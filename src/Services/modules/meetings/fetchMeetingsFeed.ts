import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { GenericPaginatedAPIResponse } from '@/Services/api'

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<GetFeedAPIResponse, { limit: number; offset: number }>({
    query: arg => {
      const { limit, offset } = arg
      return {
        url: 'meetings/feed',
        params: { limit, offset },
      }
    },
    providesTags: ['MeetingFeed'],
  })

export type GetFeedAPIResponse = GenericPaginatedAPIResponse<MeetingFeed>

export type MeetingFeed = {
  userId: string
  userName: string
  userImageId: string
  meetingRole: string
  meetingId: string
  meetingName: string
  meetingImageId: string
  occuredOn: string
}
