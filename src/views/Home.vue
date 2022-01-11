<template>
    <el-container class='home-container'>
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="../assets/logo.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type='info' @click='logout'>退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollsapse ? '64px' : '200px'">
            <div class='toggle-button' @click='toggleCollapse'><i class="el-icon-more"></i></div>
            <el-menu
              :collapse='isCollsapse'
              :collapse-transition='false'
              :default-active='avtivePath'
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF"
              unique-opened
              router>
              <!-- 一级菜单 -->
              <el-submenu :index="item.id + ''" v-for='item in menuList' :key='item.id'>
                <template slot="title">
                  <i :class="iconObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item
                  :index="'/' + subItem.path"
                  v-for='subItem in item.children'
                  :key='subItem.id'
                  @click="saveNavState('/' + subItem.path)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                    <!-- <span>{{subItem.authName}}</span> -->
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollsapse: false,
      avtivePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.avtivePath = sessionStorage.getItem('avtivePath')
  },
  methods: {
    logout () {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 折叠菜单
    toggleCollapse () {
      this.isCollsapse = !this.isCollsapse
    },
    // 保存链接的激活状态
    saveNavState (avtivePath) {
      sessionStorage.setItem('avtivePath', avtivePath)
      this.avtivePath = avtivePath
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    img {
      width: 45px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  color: #fff;
  box-sizing: border-box;
  user-select: none;
  .toggle-button {
    color: #fff;
    line-height: 24px;
    background-color: #4A5064;
    text-align: center;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
  .iconfont {
    margin-right: 10px;
  }
}
.el-main {
  background-color: #EAEDF1;
}
</style>
