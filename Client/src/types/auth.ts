// Auth types and interfaces

export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  username: string;
  profilePicUrl?: string;
  statusText?: string;
  createdAt: string;
  lastActive?: string;
  lastLogin?: string;
  privacySettings?: {
    lastSeen: string;
    profilePhoto: string;
    status: string;
    readReceipts: boolean;
  };
  tutorialCompleted?: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface RegisterRequest {
  idToken: string;
  username?: string;
  fcmToken?: string;
}

export interface LoginRequest {
  idToken: string;
  fcmToken?: string;
}

