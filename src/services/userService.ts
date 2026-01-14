import api from './http';

// ============ 请求/响应接口定义 ============

export interface RegisterRequest {
  username: string;
  account: string;
  password: string;
}

export interface LoginRequest {
  account: string; // username 或 email
  password: string;
}

export interface UserInfo {
  id: string | number;
  username: string;
  email: string;
  avatarUrl: string | null;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface UpdateUserRequest {
  username?: string | null;
  avatarUrl?: string | null;
}

export interface UsersListResponse {
  list: UserInfo[];
  total: number;
  page: number;
  size: number;
}

// ============ API 请求方法 ============

/**
 * 用户注册
 * @param data 注册信息
 * @returns 注册成功返回用户信息
 */
export const register = (data: RegisterRequest) => {
  return api.post<RegisterResponse>('/auth/register', data);
};

/**
 * 用户登录
 * @param data 登录信息
 * @returns 登录成功返回 token 和用户信息
 */
export const login = (data: LoginRequest) => {
  return api.post<LoginResponse>('/auth/login', data);
};

/**
 * 获取当前用户信息
 * @returns 当前用户信息
 */
export const getCurrentUser = () => {
  return api.get<UserInfo>('/users/me');
};

/**
 * 修改用户信息
 * @param data 要更新的用户信息
 * @returns 更新后的用户信息
 */
export const updateUser = (data: UpdateUserRequest) => {
  return api.put<UserInfo>('/users/me', data);
};

/**
 * 获取用户列表（需要权限）
 * @param page 页码（默认1）
 * @param size 每页数量（默认20）
 * @returns 用户列表
 */
export const getUserList = (page: number = 1, size: number = 20) => {
  return api.get<UsersListResponse>('/users', {
    params: { page, size },
  });
};