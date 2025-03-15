import { ROUTES } from "@/constants/routes";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      window.location.href = ROUTES.backend.endpoints.login_POST;
      return;
    }

    const data = await response.json();

    if (response.status >= 200 && response.status < 400) {
      return {
        ok: true,
        data,
      };
    } else {
      return {
        ok: false,
        data,
      };
    }
  } catch (e) {
    return {
      ok: false,
      error: e,
    };
  }
}
