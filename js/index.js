// 验证是否登录，如果没有登录，跳转到登录页面，如果有登录，获取用户信息
(async function () {
  const resp = await API.profile();
  const user = resp.data;
  // console.log(user);
  if (!user) {
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }

  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  // console.log(doms.txtMsg);

  // 下面代码环境，一定是登录状态的
  setUserInfo();
  // 注销事件
  // 推出登录
  doms.close.onclick = () => {
    console.log("退出登录");
    API.loginOut();
    location.href = "./login.html";
  };

  // 设置用户信息
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  // 加载历史记录
  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      // console.log(item);
      addChat(item);
    }
    scrollBottom();
  }

  doms.msgContainer.onsubmit = (e) => {
    e.preventDefault();
    sendChat();
  };

  /**
   *content:"my name is  qiaqia，kla，kla，qia qia qia",
   * createdAt:1652347192389,
   * from:"haha",
   * to:null
   * @param {*} chatInfo
   */
  // 根据消息对象，将其添加到页面中
  function addChat(chatInfo) {
    // 创建 item 元素
    const div = $$$("div");
    doms.chatContainer.appendChild(div);
    div.classList.add("chat-item");
    // 如果 user 有值则说明是用户发送的信息，如果值为 null 则是机器人回答的信息
    if (chatInfo.from) {
      div.classList.add("me");
    }
    // 创建 avatar 元素
    const avatar = $$$("img");
    div.appendChild(avatar);
    avatar.className = "chat-avatar";
    // 判断是自己还机器人，加载不同的头像,如果 iterator.from 则为 div 添加 me 类名
    avatar.src = chatInfo.from
      ? "./asset/avatar.png"
      : "./asset/robot-avatar.jpg";
    // 创建 content 元素
    const content = $$$("div");
    div.appendChild(content);
    content.className = "chat-content";
    content.innerText = chatInfo.content;
    // 创建 date 元素
    const date = $$$("div");
    div.appendChild(date);
    date.className = "chat-date";
    date.innerText = fromentDate(chatInfo.createdAt);
  }

  // 历史记录滚动到底部
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    // console.log(doms.chatContainer.scrollHeight);
  }

  // 时间戳转时间的函数
  function fromentDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear(); // 年份
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份
    const day = date.getDate().toString().padStart(2, "0"); // 日期
    const hours = date.getHours().toString().padStart(2, "0"); // 小时
    const minutes = date.getMinutes().toString().padStart(2, "0"); // 分钟
    const seconds = date.getSeconds().toString().padStart(2, "0"); // 秒
    return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
  }

  // 发送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    // console.log(content);
    addChat({
      from: user.loginId,
      to: null,
      createdAt: new Date(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom();
    const resp = await API.sendChat(content);
    // console.log(resp);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }
  window.sendChat = sendChat;
})();
