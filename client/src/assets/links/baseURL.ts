// 服务端接口的baseURL
export const apiBaseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:3000/api/chat/v1'
    : 'http://81.68.224.194:3000/api/chat/v1';

// 建立websocket的baseURL
export const wsBaseURL =
  process.env.NODE_ENV === 'development'
    ? 'ws://127.0.0.1:3000/api/chat/v1'
    : 'ws://81.68.224.194:3000/api/chat/v1';

// 服务器的地址URL
export const serverURL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:3000'
    : 'http://81.68.224.194:3000';