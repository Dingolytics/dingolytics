import { get, includes } from "@lodash";
import axiosLib from "axios";
import axiosAuthRefreshInterceptor from "axios-auth-refresh";
import queryString from "query-string";

import defines from "@/config/defines";
import { Auth } from "@/services/auth";
import { restoreSession } from "@/services/restoreSession";

export const axios = axiosLib.create({
  baseURL: defines.apiBaseURL,
  xsrfCookieName: defines.apiXSRFCookieName,
  xsrfHeaderName: defines.apiXSRFHeaderName,
  paramsSerializer: {
    serialize: (
      params: Record<string, any>,
      // options?: ParamsSerializerOptions
    ) => queryString.stringify(params),
    // Array indexes format:
    // - null = no brackets
    // - false (default) = empty brackets
    // - true = brackets with indexes
    indexes: false
  }
});

export const csrfRefreshInterceptor = axiosAuthRefreshInterceptor(
  axios,
  error => {
    const message = get(error, "response.data.message");
    if (error.isAxiosError && includes(message, "CSRF")) {
      return axios.get("/ping");
    } else {
      return Promise.reject(error);
    }
  },
  { statusCodes: [400] }
);

export const sessionRefreshInterceptor = axiosAuthRefreshInterceptor(
  axios,
  error => {
    const status = parseInt(get(error, "response.status"));
    const message = get(error, "response.data.message");
    // TODO: In axios@0.9.1 this check could be replaced with { skipAuthRefresh: true } flag. See axios-auth-refresh docs
    const requestUrl = get(error, "config.url");
    if (error.isAxiosError && (status === 401 || includes(message, "Please login")) && requestUrl !== "api/session") {
      return restoreSession();
    }
    return Promise.reject(error);
  },
  {
    statusCodes: [401, 404],
    pauseInstanceWhileRefreshing: false, // According to docs, `false` is default value, but in fact it's not :-)
  }
);

axios.interceptors.request.use(config => {
  const apiKey = Auth.getApiKey();
  if (apiKey) {
    config.headers.Authorization = `Key ${apiKey}`;
  }
  return config;
});

axios.interceptors.response.use(response => response.data);
