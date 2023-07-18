/**
 * 对某个表单进行验证的构造函数
 */

class FieldValidator {
  /**
   * 构造器
   * @param {String} textId 文本框的 Id
   * @param {Function} validatorFunc 验证规则函数，当需要对文本框进行验证时，会调用该函数，
   */
  constructor(textId, validatorFunc) {
    this.input = $("#" + textId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;

    this.input.onblur = () => {
      this.validator();
    };
  }

  /**
   * 验证，成功返回 true，失败返回 false
   */
  async validator() {
    const err = await this.validatorFunc(this.input.value);
    // console.log(err);
    if (err) {
      // 有错误
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   * 这是一个静态方法
   *对传入的所有验证器进行统一的验证，如果所有验证其均通过，则返回 true，否则返回 false
   * @param  {FieldValidator[]} validators
   */
  static async validator(...validators) {
    const promise = validators.map((v) => v.validator());
    // console.log(promise);
    const result = await Promise.all(promise);
    // console.log(result);
    return result.every((v) => v);
  }
}
