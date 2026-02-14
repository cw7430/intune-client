export const ResponseCode = {
  SUCCESS: 'SU',
  VALIDATION_ERROR: 'VE',
  CUSTOM_VALIDATION_ERROR: 'CVE',
  UNAUTHORIZED: 'UA',
  LOGIN_ERROR: 'LGE',
  FORBIDDEN: 'FB',
  RESOURCE_NOT_FOUND: 'RNF',
  ENDPOINT_NOT_FOUND: 'ENF',
  DUPLICATE_RESOURCE: 'DR',
  CUSTOM_DUPLICATE_RESOURCE: 'CDR',
  CONFLICT: 'CF',
  INTERNAL_SERVER_ERROR: 'ISE',
} as const;

export type ResponseCode = (typeof ResponseCode)[keyof typeof ResponseCode];
