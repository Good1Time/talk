const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请输入账号";
  }
  //   账号已存在
  const resp = await API.exists(val);
  //   console.log(resp);
  if (resp.data) {
    return "该账号已被占用，请选择新的账号名";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", async function (
  val
) {
  if (!val) {
    return "请填写昵称";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "请填写密码";
  }
});
const loginPwdConfirm = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "两次密码不一致";
    }
  }
);

const from = $(".user-form");
from.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validator(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirm
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

  const resp = await API.reg(data);
  console.log(resp);
  if (resp.code === 0) {
    alert("注册成功，点击确定跳转到登录页");
    location.href = "./login.html";
  }
};
