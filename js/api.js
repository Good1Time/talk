var API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  /**
   *这是一个再 fatch 基础上封装，发送 GET 请求的函数
   * @param {*} path Url 路径
   * @param {*} bodyObj 请求体，对象
   */

  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }

  /**
   *这是一个再 fatch 基础上封装，发送 POST 请求的函数
   * @param {*} path Url 路径
   * @param {*} bodyObj 请求体，对象
   */
  function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj),
    });
  }
  // 注册
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  }
  // 登录
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    if (result.code === 0) {
      // 登录成功，将响应头中的token保存起来（localStorage）
      const token = resp.headers.get("Authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }
  // 验证账号
  async function exists(loginId) {
    const result = await get("/api/user/exists?loginId=" + loginId);
    return await result.json();
  }
  // 当前登录的用户信息
  async function profile() {
    const result = await get("/api/user/profile");
    return result.json();
  }
  // 发送聊天消息
  async function sendChat(content) {
    const result = await post("/api/chat", { content });
    return await result.json();
  }
  // 获取聊天记录
  async function getHistory() {
    const result = await get("/api/chat/history");
    return await result.json();
  }
  // 退出登录
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
