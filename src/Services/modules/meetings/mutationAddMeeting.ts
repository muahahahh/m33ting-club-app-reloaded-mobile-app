import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<AddMeetingAPIResponse, AddMeetingRequest>({
    query: ({ ...body }) => ({
      url: 'meetings',
      method: 'POST',
      body,
    }),
    invalidatesTags: ['MeetingsOwn', 'MeetingDetails'],
  })

export type AddMeetingAPIResponse = {
  id: string
}

export type AddMeetingRequest = {
  name: string
  description: string
  confidentialInfo: string
  participantsLimit: number | null
  startDate: string
  endDate: string
  imageId?: string
  locationName: string
  locationDescription: string
  longitude: number
  latitude: number
  tags: string[]
  isPublic: boolean
}
