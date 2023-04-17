export default {
  apiBaseURL: process.env.API_BASE_URL || '/',
  apiXSRFCookieName: "csrf_token",
  apiXSRFHeaderName: "X-CSRF-TOKEN",
  // xsrfHeaderName: 'X-XSRF-TOKEN', // default
  // xsrfCookieName: 'XSRF-TOKEN', // default
}