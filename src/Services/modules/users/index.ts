import { api } from '@/Services/api'
import fetchUserMe from '@/Services/modules/users/fetchUsersMe'
import mutationFinishSignUp from '@/Services/modules/users/mutationFinishSignUp'
import fetchUser from '@/Services/modules/users/fetchUser'
import fetchFollowing from '@/Services/modules/users/fetchFollowing'
import fetchFollowers from '@/Services/modules/users/fetchFollowers'
import mutationFollow from '@/Services/modules/users/mutationFollow'
import mutationUnfollow from '@/Services/modules/users/mutationUnfollow'
import mutationDelete from '@/Services/modules/users/mutationDelete'

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    fetchUsersMe: fetchUserMe(build),
    usersFinishSignUp: mutationFinishSignUp(build),
    fetchUser: fetchUser(build),
    fetchFollowing: fetchFollowing(build),
    fetchFollowers: fetchFollowers(build),
    mutationFollow: mutationFollow(build),
    mutationUnfollow: mutationUnfollow(build),
    mutationDelete: mutationDelete(build),
  }),
  overrideExisting: false,
})

export const {
  useLazyFetchUsersMeQuery,
  useUsersFinishSignUpMutation,
  useFetchFollowingQuery,
  useFetchFollowersQuery,
} = userApi
