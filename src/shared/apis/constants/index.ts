export const ResponseCode = {
  SUCCESS: 'SU',
  VALIDATION_ERROR: 'VE',
  UNAUTHORIZED: 'UA',
  LOGIN_ERROR: 'LGE',
  FORBIDDEN: 'FB',
  RESOURCE_NOT_FOUND: 'RNF',
  ENDPOINT_NOT_FOUND: 'ENF',
  DUPLICATE_RESOURCE: 'DR',
  CONFLICT: 'CF',
  INTERNAL_SERVER_ERROR: 'ISE',
} as const;

export type ResponseCode = typeof ResponseCode[keyof typeof ResponseCode];