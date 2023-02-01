import { Config } from '@/Config'

export const postMeetingBackground = async (
  body: FormData,
  userToken: string,
): Promise<PostMeetingBackgroundAPIResponse> => {
  const response = await fetch(`${Config.API_URL}meetings/backgrounds`, {
    method: 'POST',
    body,
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    },
  })

  if (response.ok) {
    const result = await response.json()
    return result
  }

  throw Error('Data fetch error')
}

export type PostMeetingBackgroundAPIResponse = {
  id: string
}
