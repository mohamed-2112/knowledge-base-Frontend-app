import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const cookie of cookies) {
        const [cookieName, ...cookieValueParts] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValueParts.join('='));
        }
    }
    return null;
}

export async function refreshCsrfToken() {
    await apiClient.get('/api/csrf');
    return getCookie('XSRF-TOKEN');
}

export async function ensureCsrfToken() {
  const existingToken = getCookie("XSRF-TOKEN");

  if (existingToken) {
    return existingToken;
  }

  return refreshCsrfToken();
}

function isUnsafeMethod(method) {
    return ["post", "put", "patch", "delete"].includes(method?.toLowerCase());
}


apiClient.interceptors.request.use(
    async (config) => {
        if (isUnsafeMethod(config.method)) {
            const csrfToken = await refreshCsrfToken();
            if (csrfToken) {
                config.headers['X-XSRF-TOKEN'] = csrfToken;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// export {ensureCsrfToken};
export default apiClient;