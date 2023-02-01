import { Config } from '@/Config'

const userImageUri = (imageId: string) => {
  return imageId ? `${Config.S3_AVATARS_BUCKET_URl}/${imageId}.jpg` : undefined
}

export default userImageUri
