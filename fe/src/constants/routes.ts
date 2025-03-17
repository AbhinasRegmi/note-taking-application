export const ROUTES = {
  backend: {
    // baseUrl: 'http://localhost:8000/api/v1',
    baseUrl: '/api/v1',
    endpoints: {
      signup_POST: '/auth/signup',
      login_POST: '/auth/login',
      logout_GET: '/auth/logout',
      profile_GET: '/users/profile',
    }
  }
} as const;