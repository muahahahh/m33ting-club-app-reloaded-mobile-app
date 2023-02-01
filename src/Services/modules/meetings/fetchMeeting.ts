import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Meeting, { id: string }>({
    query: arg => {
      const { id } = arg
      return {
        url: `meetings/${id}`,
      }
    },
    providesTags: ['MeetingDetails'],
  })

export type Meeting = {
  id: string
  name: string
  description: string
  confidentialInfo: string
  participantsLimit: number
  startDate: string
  endDate: string
  imageId: string
  locationName: string
  locationDescription: string
  longitude: number
  latitude: number
  distance: number
  status: string
  tags: Array<string>
  participants: Array<Participant>
  isPublic: boolean
}

export type Participant = {
  userId: string
  meetingRole: string
  name: string
  imageId: string
}
