<template>
  <div class="login_container">
    <h1 class="title">电子日历管理系统</h1>
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/rlogo.jpg" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFORMRef"
        :model="loginFORM"
        :rules="loginFORMRules"
        label-width="0px"
        class="login_form"
      >
        <!-- user -->
        <el-form-item prop="username">
          <el-input
            v-model="loginFORM.username"
            prefix-icon="UserFilled"
          ></el-input>
        </el-form-item>
        <i class="el-icon-delete"></i>
        <!-- password -->
        <el-form-item prop="password">
          <el-input
            v-model="loginFORM.password"
            prefix-icon="Key"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="success" @click="addDialogVisible = true"
            >注册</el-button
          >
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginFORM">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 弹出框 -->
    <el-dialog
      title="注册"
      v-model="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { ref } from "vue";
import axios from "axios";
import { useStore } from "vuex"; // 导入 useStore 函数
import { useRouter } from "vue-router"; // 导入 useRouter 函数
const store = useStore(); // 获取 store 对象
const router = useRouter();
var checkEmail = (rule, value, cb) => {
  const regEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regEmail.test(value)) {
    return cb();
  }
  cb(new Error("请输入合法邮箱"));
};
const loginFORM = ref({
  id: "",
  username: "",
  password: "",
});
const loginFORMRules = ref({
  //用户名校验
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 1,
      max: 10,
      message: "长度在 1 到 10 个字符",
      trigger: "blur",
    },
  ],

  //密码校验
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 15,
      message: "长度在 6 到 15 个字符",
      trigger: "blur",
    },
  ],
});
const addFormRules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 1,
      max: 10,
      message: "请输入1-10个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 15,
      message: "请输入6-15个字符",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      validator: checkEmail,
      trigger: "blur",
    },
  ],
});
const loginFORMRef = ref(null);
const resetLoginFORM = () => {
  //console.log(this) //打印主键实例
  ElMessage.success("sdasd");

  loginFORMRef.value.resetFields();
};
const login = () => {
  loginFORMRef.value.validate(async (valid) => {
    if (!valid) return;
    const { data: res } = await axios.post("/login", loginFORM.value);
    // console.log(res)
    if (res.code == 200) {
      // console.log(res);
      ElMessage.success(res.msg);
      // console.log(typeof res.role)
      //1.将登录成功后的token，保存到客户端的sessionStorage中
      //  1.1 项目中除了登录之外的API接口，必须登录成功后才能访问
      //  1.2 token只应在当前网站打开期间生效，所以将token保存在 sessionStorage中
      store.commit("setUserRole", res.role);
      store.commit("setUserId", res.user_id);
      window.sessionStorage.setItem("token", res.token);
      window.sessionStorage.setItem("activePath", "/welcome");

      //2 通过编程式导航跳转到后台主页，路由地址/Home
      router.push("/home");
    } else if (res.code == 500) {
      // console.log(res);
      return ElMessage.error(res.msg);
    }
  });
};
const addForm = ref({
  username: "",
  password: "",
  email: "",
});
const addDialogVisible = ref(false);
const addFormRef = ref(null);
const addUser = () => {
  addFormRef.value.validate(async (valid) => {
    /* console.log(valid) */
    if (!valid) return;
    // console.log(this.addForm)

    //可以发起添加用户的网络请求
    const { data: res } = await axios.post("/register", addForm.value);
    
    if (res.code !== 200) {
      return ElMessage.error(res.msg);
    }
    ElMessage.success(res.msg);
    addDialogVisible.value = false;
  });
};
const addDialogClosed = ()=>{
  addFormRef.value.resetFields();
}
</script>

<style lang="less" scoped>
.login_container {
  background-image: url("../assets/back.jpg");
  background-size: cover; /* 调整图片尺寸以适应容器 */
  background-repeat: no-repeat; /* 禁止图片重复显示 */
  background-position: center; /* 图片在容器中居中 */
  background-color: #2b4b6b; /* 如果图片加载失败，显示的背景颜色 */
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee; //边框线
    border-radius: 50%; //圆角
    padding: 10px; //间距
    box-shadow: 0 0 10px #ddd; //加阴影
    position: absolute; //定位
    left: 50%; //往右移动%50
    transform: translate(-50%, -50%); //往左移动自身50%，往上移动50%
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%; //圆角
      background-color: #eee;
    }
  }
}

.btns {
  display: flex; //弹性模型
  justify-content: flex-end; //尾部对齐
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px; //左
  box-sizing: border-box; //右
}
.title {
  text-align: center; /* 居中显示 */
  font-size: 30px; /* 字体大小 */
  color: white; /* 字体颜色 */
  position: absolute; /* 使用绝对定位 */
  top: 100px; /* 上移 100px */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 往左移动自身宽度的一半 */
  width: 100%; /* 设置宽度为容器的宽度 */
}
</style>