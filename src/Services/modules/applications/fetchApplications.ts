import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Array<MeetingApplication>, { id: string }>({
    query: arg => {
      const { id } = arg
      return {
        url: `applications/${id}`,
      }
    },
    providesTags: ['Applications'],
  })

export type MeetingApplication = {
  userId: string
  meetingId: string
  status: string
  name: string
  imageId: string
}
