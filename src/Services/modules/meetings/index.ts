import mutationAddMeeting from './mutationAddMeeting'
import {
  api,
  GenericPaginatedAPIRequestQueryParams,
  GenericPaginatedAPIResponse,
} from '@/Services/api'
import fetchMeetingsOwn from '@/Services/modules/meetings/fetchMeetingsOwn'
import fetchMeeting from '@/Services/modules/meetings/fetchMeeting'
import mutationJoinMeeting from '@/Services/modules/meetings/mutationJoinMeeting'
import mutationCancelMeeting from '@/Services/modules/meetings/mutationCancelMeeting'
import mutationLeaveMeeting from '@/Services/modules/meetings/mutationLeaveMeeting'
import mutationAddMeetingBackground from '@/Services/modules/meetings/mutationAddMeetingBackground'
import fetchMeetingsFeed from '@/Services/modules/meetings/fetchMeetingsFeed'
import mutationEditMeeting from '@/Services/modules/meetings/mutationEditMeeting'

export const meetingsApi = api.injectEndpoints({
  endpoints: build => ({
    fetchMeetingsOwn: fetchMeetingsOwn(build),
    fetchMeeting: fetchMeeting(build),
    fetchMeetingsFeed: fetchMeetingsFeed(build),
    addMeetingMutation: mutationAddMeeting(build),
    editMeetingMutation: mutationEditMeeting(build),
    addMeetingBackgroundMutation: mutationAddMeetingBackground(build),
    cancelMeetingMutation: mutationCancelMeeting(build),
    requestToJoinMeetingMutation: mutationJoinMeeting(build),
    leaveMeetingMutation: mutationLeaveMeeting(build),
    getMeetings: build.query<
      GetMeetingsAPIResponse,
      GetMeetingAPIRequestQueryParams
    >({
      query: (
        params: GetMeetingAPIRequestQueryParams = {
          limit: 2,
        },
      ) => ({
        url: 'meetings',
        params,
      }),
      providesTags: ['MeetingsExplore'],
    }),
  }),
  overrideExisting: false,
})

export interface GetMeetingAPIRequestQueryParams
  extends GenericPaginatedAPIRequestQueryParams {
  tags?: string[]
  longitude?: number
  latitude?: number
}

export type GetMeetingsAPIResponse =
  GenericPaginatedAPIResponse<GetMeetingsSingleMeetingAPIResponse>

export interface GetMeetingsSingleMeetingAPIResponse {
  id: string
  name: string
  imageId: string
  description: string
  tags: string[]
  startDate: string
  endDate: string
  distance: number
  isPublic: boolean
}
export const {
  useFetchMeetingsOwnQuery,
  useFetchMeetingQuery,
  useFetchMeetingsFeedQuery,
} = meetingsApi
