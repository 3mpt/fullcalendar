<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card" style="margin-top: 20px; height: 85vh">
      <div>
        <!-- 分栏间隔 -->
        <el-row :gutter="20">
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <el-input
                placeholder="请输入用户名"
                v-model="queryInfo.query"
                clearable
                @clear="getUserList"
              >
                <template #append>
                  <el-button @click="getUserList">搜索</el-button>
                </template>
              </el-input>
            </div></el-col
          >

          <el-col :span="6"
            ><div class="grid-content bg-purple">
              <el-button type="primary" @click="addDialogVisible = true"
                >添加用户</el-button
              >
            </div></el-col
          >
        </el-row>
        <!-- 用户列表区 -->
        <el-table stripe border :data="userlist" style="width: 100%">
          <el-table-column
            type="index"
            label="索引"
            width="90"
          ></el-table-column>
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column
            prop="roleShow"
            label="角色"
            :formatter="roleShow"
          ></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            :formatter="createTimeShow"
          >
          </el-table-column>
          <el-table-column
            prop="last_time"
            label="最后一次登陆时间"
            :formatter="lastTimeShow"
          >
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
                >修改信息</el-button
              >
              <!-- 删除按钮 -->
              <el-switch
                v-model="scope.row.status"
                @change="StateChanged(scope.row.id)"
                active-text="激活"
                inactive-text="禁用"
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 弹出框 -->
      <el-dialog
        title="添加用户"
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
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改用户"
        v-model="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="editForm.role" :placeholder="roleLabel">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { ElMessage,  } from "element-plus";
const checkEmail = (rule, value, cb) => {
  const regEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regEmail.test(value)) {
    return cb();
  }
  cb(new Error("请输入合法邮箱"));
};
const queryInfo = ref({
  query: "",
});
const userlist = ref([]);
const addDialogVisible = ref(false);
const addForm = ref({
  username: "",
  password: "",
  email: "",
});
const options = ref([
  {
    value: 0,
    label: "普通用户",
  },
  {
    value: 1,
    label: "管理员",
  },
]);
const addFormRules = ref({
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
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      validator: checkEmail,
      trigger: "blur",
    },
  ],
});
const editDialogVisible = ref(false);
const editForm = ref({});
const editFormRules = ref({
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
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      validator: checkEmail,
      trigger: "blur",
    },
  ],
});
const UserInfo = ref({});
const rolesList = ref([]);
const selectedRoleId = ref("");
const getUserList = async () => {
  if (queryInfo.value.query == "") {
    //调用请求，第一个参数是请求地址
    const { data: res } = await axios.get("/get_user");
    if (res.code !== 200) {
      return ElMessage.error("获取用户列表失败");
    }
    ElMessage.success("获取用户列表成功");
    userlist.value = res.data;
  } else {
    const { data: res } = await axios.post("/get_user", {
      username: queryInfo.value.query,
    });
    queryInfo.value.query = "";
    if (res.code !== 200) {
      return ElMessage.error("获取用户列表失败");
    }
    ElMessage.success("获取用户列表成功");

    userlist.value = res.data;
  }
  userlist.value.forEach((item) => {
    if (item.status === 0) {
      item.status = false;
      // 返回false
    } else if (item.status === 1) {
      item.status = true;
      // 返回true
    }
  });
};
const addFormRef = ref(null);
const addDialogClosed = () => {
  addFormRef.value.resetFields();
};
const addUser = () => {
  addFormRef.value.validate(async (valid) => {
    if (!valid) return;
    //可以发起添加用户的网络请求
    const { data: res } = await axios.post("/register", addForm.value);
    if (res.code !== 200) {
      return ElMessage.error("添加用户失败");
    }
    ElMessage.success("添加用户成功");
    addDialogVisible.value = false;
    getUserList();
  });
};
//显示编辑用户的对话框
const showEditDialog = (id) => {
  const selectedItem = userlist.value.find((item) => item.id === id);
  if (selectedItem) {
    editForm.value = { ...selectedItem, user_id: selectedItem.id };
    // 打开编辑对话框或执行其他操作
  } else {
    console.log("Item not found with id:", id);
  }
  // console.log(this.editForm)
  /* =this.editForm.role */
  editDialogVisible.value = true;
};
const editFormRef = ref(null);
const editDialogClosed = () => {
  editFormRef.value.resetFields();
};
const editUserInfo = () => {
  editFormRef.value.validate(async (valid) => {
    if (!valid) return;
    // this.editForm.status = this.editForm.status ? 1 : 0;
    // console.log('编辑表单提交', this.editForm)
    //可以发起添加用户的网络请求
    const { data: res } = await axios.post("/update_user", editForm.value);

    if (res.code !== 200) {
      return ElMessage.error("更新用户信息失败");
    }
    ElMessage.success("更新用户信息成功");
    editDialogVisible.value = false;
    getUserList();
  });
};
const StateChanged = async (id) => {
  const selectedItem = userlist.value.find((item) => item.id == id);
  // console.log(selectedItem.status)
  if (selectedItem) {
    editForm.value = { ...selectedItem, user_id: selectedItem.id };

    // 打开编辑对话框或执行其他操作
  } else {
    console.log("Item not found with id:", id);
  }

  editForm.value.status = editForm.value.status ? 1 : 0;
  // console.log('666', this.editForm)
  const { data: res } = await axios.post("/update_user", editForm.value);
  if (res.code !== 200) {
    return ElMessage.error("禁用失败");
  }
  ElMessage.success("修改成功");
  // console.log(this.editForm)
  getUserList();
};
const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const roleShow = (row) => {
  return row.role === 1 ? "管理员" : "普通用户";
};
const createTimeShow = (row) => {
  return formatDate(row.create_time);
};
const lastTimeShow = (row) => {
  return formatDate(row.last_time);
};
const roleLabel = computed(() => {
  const role = editForm.value.role; // 假设这是从数据库获取的用户角色值
  const option = options.value.find((item) => item.value === role);
  return option ? option.label : "";
});
onMounted(() => {
  getUserList();
});
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 20px;
}
</style>