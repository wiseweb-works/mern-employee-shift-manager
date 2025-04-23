export const BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATH = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  USERS: {
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
    UPDATE_USER_BY_ID: (userId) => `/api/users/${userId}`,
    UPDATE_USER_PASSWORD: "/api/users",
    DELETE_USER_BY_ID: (userId) => `/api/users/${userId}`,
  },
  SHIFTS: {
    GET_SHIFTS: "/api/shifts/",
    GET_SHIFTS_BY_ID: (shiftId) => `/api/shifts/${shiftId}`,
    CREATE_SHIFTS: "/api/shifts/",
    UPDATE_SHIFTS: (shiftId) => `/api/shifts/${shiftId}`,
    DELETE_SHIFTS: (shiftId) => `/api/shifts/${shiftId}`,
    DELETE_SHIFTS_BY_MONTH: (month, year) =>
      `/api/shifts?month=${month}&year=${year}`,
  },
};
