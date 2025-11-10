import { BlockAuth, Property } from '@openops/blocks-framework';
import axios, { AxiosError } from 'axios';
import { makeGetRequest } from './callRestApi';

export const hyperglanceAuth = BlockAuth.CustomAuth({
  authProviderKey: 'hyperglance',
  authProviderDisplayName: 'Hyperglance',
  authProviderLogoUrl: 'https://static.openops.com/blocks/hyperglance.svg',
  description: `Configure your Hyperglance connection. For more information, visit the [Hyperglance API documentation](https://support.hyperglance.com/knowledge/getting-started-with-the-hyperglance-api).`,
  required: true,
  props: {
    instanceUrl: Property.ShortText({
      displayName: 'Instance URL',
      description: 'The instance URL for Hyperglance',
      required: true,
    }),
    authToken: Property.SecretText({
      displayName: 'Auth Token',
      description: 'The API auth token. E.g BASIC fhdhdhdbfbdb= ',
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      await makeGetRequest(auth.instanceUrl + '/hgapi/', auth.authToken);
      return { valid: true };
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.statusText ||
          axiosError.message ||
          axiosError.code ||
          'Axios error';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {
        valid: false,
        error: errorMessage,
      };
    }
  },
});

export type HGAuth = {
  instanceUrl: string;
  authToken: string;
};
