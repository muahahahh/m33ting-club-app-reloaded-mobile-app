import { api } from '@/Services/api'
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export const fetchMeetingNotifications = (
  build: EndpointBuilder<any, any, any>,
) =>
  build.query<
    MeetingNotificationsAPIResponse,
    { types?: MeetingNotificationTypeEnum[] }
  >({
    query: ({ types }) => ({
      url: 'users/meeting-notifications',
      params: { types },
    }),
    providesTags: ['MeetingNotifications'],
  })

export enum MeetingNotificationTypeEnum {
  USER_JOINED = 'UserJoined',
  USER_ASKED_TO_JOIN = 'UserAskedToJoin',
  APPLICATION_ACCEPTED = 'ApplicationAccepted',
}
export type MeetingNotificationsSingleAPIResponse = {
  id: string
  type: MeetingNotificationTypeEnum
  meetingId: string
  occuredOn: Date
  performerId: string
  performerName: string
}

export type MeetingNotificationsAPIResponse =
  Array<MeetingNotificationsSingleAPIResponse>

export const meetingNotificationsMarkAsSeenMutation = (
  build: EndpointBuilder<any, any, any>,
) =>
  build.mutation<undefined, MeetingNotificationsMarkAsSeenAPIRequest>({
    query: ({ ...body }) => ({
      url: 'users/meeting-notifications/mark-as-seen',
      method: 'PATCH',
      body,
    }),
    invalidatesTags: ['MeetingNotifications'],
  })

export type MeetingNotificationsMarkAsSeenAPIRequest = {
  ids: string[]
}

export const meetingNotificationsApi = api.injectEndpoints({
  endpoints: build => ({
    fetchMeetingNotifications: fetchMeetingNotifications(build),
    meetingNotificationsMarkAsSeenMutation:
      meetingNotificationsMarkAsSeenMutation(build),
  }),
  overrideExisting: false,
})
