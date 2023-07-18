const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请输入账号";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "请填写密码";
  }
});

const from = $(".user-form");
from.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validator(
    loginIdValidator,
    loginPwdValidator
  );
  console.log(result);
  if (!result) {
    console.log("验证未通过");
    return; // 验证未通过
  }

  const formData = new FormData(from);
  const data = Object.fromEntries(formData.entries());
  //   const data = {
  //     loginId: loginIdValidator.input.value,
  //     loginPwd: loginPwdValidator.input.value,
  //     nickname: nicknameValidator.input.value,
  //   };

  const resp = await API.login(data);
  console.log(resp);
  if (resp.code === 0) {
    alert("登录成功，点击确定跳转到首页");
    location.href = "./index.html";
  } else {
    loginIdValidator.p.innerText = "账号或密码错误";
    loginPwdValidator.input.value = "";
  }
};
