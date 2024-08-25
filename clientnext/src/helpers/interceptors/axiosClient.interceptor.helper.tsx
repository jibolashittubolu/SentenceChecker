import axios, { AxiosResponse } from 'axios';

// Define the type for the Axios response headers
interface CustomHeaders {
  'x-version'?: string; // optional, as headers might not always include this field
}

const axiosClientInterceptor = axios.create()
// Add the response interceptor
axiosClientInterceptor.interceptors.response.use(
  function (response: AxiosResponse) {
    const versionHeader = response?.headers['x-version'] as string | undefined;
    const currentVersion = process.env.APP_VERSION || '';

    if (versionHeader && versionHeader > currentVersion) {
      window.localStorage.setItem('version-update-needed', 'true'); // Set version update item
    }

    return response; // Continue with response
  },
  function (error) {
    // Handle errors if needed
    return Promise.reject(error);
  }
);

export {axiosClientInterceptor}
