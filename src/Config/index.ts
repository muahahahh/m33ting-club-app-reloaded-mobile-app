import RNConfig from 'react-native-config'

export type ConfigType = {
  APP_ENV: string
  API_URL: string
  GOOGLE_AUTH_WEB_CLIENT_ID: string
  GOOGLE_MAPS_API_KEY: string
  S3_BACKGROUND_BUCKET_URl: string
  S3_AVATARS_BUCKET_URl: string
  TERMS_AND_CONDITIONS_URI: string
}

const StagingConfig: ConfigType = {
  APP_ENV: 'STAGING',
  API_URL: 'https://staging.api.m33ting.club/',
  GOOGLE_AUTH_WEB_CLIENT_ID:
    '13516832442-tugmj0b64ogvdb1155ov00hi6aht84d3.apps.googleusercontent.com',
  GOOGLE_MAPS_API_KEY: 'AIzaSyC0Bu7sH1NGuf3QOPbD3qZ3lMRdjAnoLuc',
  S3_BACKGROUND_BUCKET_URl:
    'https://meeting-club-staging-uploads-bucket.s3.eu-central-1.amazonaws.com/backgrounds',
  S3_AVATARS_BUCKET_URl:
    'https://meeting-club-staging-uploads-bucket.s3.eu-central-1.amazonaws.com/userImages',
  TERMS_AND_CONDITIONS_URI: 'https://www.m33ting.club/terms-of-service',
}

const ProductionConfig: ConfigType = {
  APP_ENV: 'PRODUCTION',
  API_URL: 'https://api.m33ting.club/',
  GOOGLE_AUTH_WEB_CLIENT_ID:
    '345864979805-c788fl8lffc9lkegr9616g21big0onrb.apps.googleusercontent.com',
  GOOGLE_MAPS_API_KEY: 'AIzaSyBiABGTLTxouZk0FED743LsZnyK2i24ro0',
  S3_BACKGROUND_BUCKET_URl:
    'https://m33-prod-uploads-bucket.s3.eu-central-1.amazonaws.com/backgrounds',
  S3_AVATARS_BUCKET_URl:
    'https://m33-prod-uploads-bucket.s3.eu-central-1.amazonaws.com/userImages',
  TERMS_AND_CONDITIONS_URI: 'https://www.m33ting.club/terms-of-service',
}

export const Config: ConfigType =
  RNConfig.APP_ENV === 'PRODUCTION' ? ProductionConfig : StagingConfig
