import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Note the camelCase 'jwtDecode'
import api from "./api";

const API_URL = "https://sacredstore.onrender.com/api/auth/";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  email: string; // Changed from username to email
  roles: string[];
  tokenType: string;
}

interface RegisterResponse {
  message: string;
}

interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

interface DecodedToken {
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  sub: string; // Subject (now email)
  // ... other claims
}

const register = (
  fullname: string,
  email: string,
  password: string,
  roles: string[] = ["user"]
) => {
  return axios.post<RegisterResponse>(API_URL + "signup", {
    fullname,
    email,
    password,
    role: roles,
  });
};

const login = (email: string, password: string) => {
  return axios
    .post<LoginResponse>(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = (): LoginResponse | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const isAccessTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.refreshToken) {
    logout();
    return null;
  }

  try {
    const response = await axios.post<TokenRefreshResponse>(
      API_URL + "refreshtoken",
      {
        refreshToken: currentUser.refreshToken,
      }
    );

    const newAccessToken = response.data.accessToken;
    const updatedUser = { ...currentUser, accessToken: newAccessToken };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    logout();
    return null;
  }
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAccessTokenExpired,
  refreshAccessToken,
};

export default AuthService;
