export const isValidNotEmptyArray = (array: any[]): boolean => {
  return !!(array && array?.length && array?.length > 0)
}
