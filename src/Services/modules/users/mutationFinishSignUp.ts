import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<string, UsersFinishSignUpAPIRequest>({
    query: ({ ...body }) => ({
      url: 'users/sign-up',
      method: 'POST',
      body,
    }),
  })

export type UsersFinishSignUpAPIRequest = {
  name: string
  birthday: string
  gender: string
  imageId?: string
}
