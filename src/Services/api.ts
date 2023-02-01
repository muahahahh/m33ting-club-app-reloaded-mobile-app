import { Config } from '@/Config'
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { RootState } from '@/Store'
import auth from '@react-native-firebase/auth'
const queryString = require('query-string')

export const baseQuery = fetchBaseQuery({
  baseUrl: Config.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const authState = (getState() as RootState).auth
    const userToken = authState.user?.token
    headers.set('Authorization', `Bearer ${userToken}`)
    return headers
  },
  paramsSerializer: params => queryString.stringify(params),
})

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  console.log(
    `[${new Date().toISOString()}] [${result.meta?.request.method}] ${
      result.meta?.request.url
    }`,
  )

  // console.log(result.meta?.request)

  console.log(result?.data)
  if (result.error) {
    console.log(`[${new Date().toISOString()}]`, result.error)
    if (result.error.status === 401) {
      await auth().signOut()
    }
  }
  return result
}

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
}).enhanceEndpoints({
  addTagTypes: [
    'MeetingDetails',
    'MeetingsOwn',
    'MeetingFeed',
    'MeetingsExplore',
    'UserFollowers',
    'UserFollowings',
    'User',
    'UserMe',
    'Applications',
    'MeetingNotifications',
  ],
})

export interface GenericPaginatedAPIRequestQueryParams {
  limit: number
  offset?: number
}

export interface GenericPaginatedAPIResponse<T> {
  records: T[]
  numberOfRecords: number
  totalNumberOfRecords: number
}
