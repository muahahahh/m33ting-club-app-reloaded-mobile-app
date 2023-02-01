import { Config } from '@/Config'

export const postUserAvatar = async (
  body: FormData,
  userToken: string,
): Promise<PostMeetingBackgroundAPIResponse> => {
  const response = await fetch(`${Config.API_URL}users/avatar`, {
    method: 'POST',
    body,
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    },
  })

  if (response.ok) {
    return await response.json()
  }

  console.log(await response.json())
  throw Error('Data fetch error')
}

export type PostMeetingBackgroundAPIResponse = {
  id: string
}
