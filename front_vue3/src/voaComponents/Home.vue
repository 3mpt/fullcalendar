<template>
  <el-container class="el-cont">
    <el-header>
      <div>
        <i class="el-icon-edit"></i>
        <span>电子日历系统</span>
      </div>
      <div>
        <el-button type="info" @click="logout">登出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-sub-menu
            :index="item.id + ''"
            v-for="item in filteredMenuList"
            :key="item.id"
          >
            <!-- 模板 -->
            <template #title>
              <el-icon :size="20">
                <component :is="iconObj[item.id]" />
              </el-icon>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->

            <el-menu-item
              v-for="subItem in filteredSubItems(item.children)"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template #title>
                <el-icon :size="20">
                <Menu/>
              </el-icon>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [
        {
          authName: "电子日历",
          id: "145",
          role: [1, 0],
          children: [
            {
              authName: "日历查看",
              path: "welcome",
            },
          ],
        },
        {
          authName: "用户管理",
          role: [1],
          id: "125",
          children: [
            {
              authName: "用户列表",
              path: "user",
            },
          ],
        },
        {
          authName: "事件管理",
          role: [1],
          id: "103",
          children: [
            {
              authName: "事件列表",
              path: "even",
            },
          ],
        },
      ],
      iconObj: {
        125: "UserFilled",
        103: "Notebook",
        101: "UserFilled",
        102: "UserFilled",
        145: "Calendar",
        110: "UserFilled",
      },
      isCollapse: false,
      //被激活的链接地址
      activePath: "",
      userid: NaN,
      userInfo: {},
      username: "",
      role: 0,
    };
  },
  created() {
    this.getUserId();
    this.filteredSubList;
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    getUserId() {
      this.userid = this.$store.getters.getUserId;
      this.role = this.$store.getters.getUserRole;
    },
    logout() {
      this.$notify.closeAll();
      this.$message.success("成功退出登录");
      window.sessionStorage.clear();
      this.$store.commit("setUserRole", "");
      this.$store.commit("setUserId", "");
      this.$router.push("/login");
    },
    /* 点击按钮切换折叠和展开 */
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      this.$notify.closeAll();
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },

    filteredSubItems(children) {
      // return children.filter(subItem => this.checkRole(subItem.role));
      return children;
    },
  },

  mounted() {},
  computed: {
    filteredMenuList() {
      return this.menulist.filter((item) => item.role.includes(this.role));
    },
  },
};
</script>

<style lang="less" scoped>
.el-cont {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; //左右贴边对齐
  padding-left: 0; //左边距 清空，贴边
  align-items: center; //按钮居中
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px; //图片与文字间距
    }
  }

  //纵向居中
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em; //字体间距
  cursor: pointer; //鼠标放上变小手
}
.userphoto {
  display: flex; //弹性模型
  justify-content: flex-end; //尾部对齐
  float: right;
}
</style>