import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { AddMeetingRequest } from '@/Services/modules/meetings/mutationAddMeeting'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<EditMeetingAPIResponse, EditMeetingRequest>({
    query: ({ ...body }) => ({
      url: 'meetings',
      method: 'PUT',
      body,
    }),
    invalidatesTags: ['MeetingDetails', 'MeetingsOwn'],
  })

export type EditMeetingAPIResponse = {}

export interface EditMeetingRequest extends AddMeetingRequest {
  id: string
}
