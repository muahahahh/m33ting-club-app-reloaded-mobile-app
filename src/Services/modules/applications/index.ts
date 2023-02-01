import { api } from '@/Services/api'
import fetchApplications from '@/Services/modules/applications/fetchApplications'
import mutationAcceptApplication from '@/Services/modules/applications/mutationAcceptApplication'
import mutationRejectApplication from '@/Services/modules/applications/mutationRejectApplication'

export const applicationsApi = api.injectEndpoints({
  endpoints: build => ({
    fetchApplications: fetchApplications(build),
    acceptApplicationMutation: mutationAcceptApplication(build),
    rejectApplicationMutation: mutationRejectApplication(build),
  }),
  overrideExisting: false,
})

export const { useFetchApplicationsQuery } = applicationsApi
