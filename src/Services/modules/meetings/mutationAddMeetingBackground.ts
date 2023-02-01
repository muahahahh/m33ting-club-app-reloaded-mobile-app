import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<string, FormData>({
    query: ({ ...body }) => ({
      url: 'meetings/backgrounds',
      method: 'POST',
      body,
    }),
  })

export type AddMeetingBackgroundRequest = {
  file: FormData
}
