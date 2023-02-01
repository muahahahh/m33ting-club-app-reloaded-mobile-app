import { Config } from '@/Config'

const backgroundImageBigUri = (imageId: string) => {
  return `${Config.S3_BACKGROUND_BUCKET_URl}/${imageId}-big.jpg`
}

export default backgroundImageBigUri
