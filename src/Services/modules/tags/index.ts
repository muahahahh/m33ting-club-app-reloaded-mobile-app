import {
  api,
  GenericPaginatedAPIRequestQueryParams,
  GenericPaginatedAPIResponse,
} from '@/Services/api'

export const tagsApi = api.injectEndpoints({
  endpoints: build => ({
    searchTags: build.query<
      GetSearchTagsAPIResponse,
      GetSearchTagsAPIRequestQueryParams
    >({
      query: (params: GetSearchTagsAPIRequestQueryParams = { limit: 2 }) => ({
        url: 'tags/search',
        params,
      }),
    }),
    getTags: build.query<Array<GetSearchTagsSingleAPIResponse>, null>({
      query: () => ({
        url: 'tags',
      }),
    }),
  }),
  overrideExisting: false,
})

export interface GetSearchTagsAPIRequestQueryParams
  extends GenericPaginatedAPIRequestQueryParams {
  phrase?: string
}

export type GetSearchTagsAPIResponse =
  GenericPaginatedAPIResponse<GetSearchTagsSingleAPIResponse>

export interface GetSearchTagsSingleAPIResponse {
  name: string
  id: string
  isOfficial: boolean
}
