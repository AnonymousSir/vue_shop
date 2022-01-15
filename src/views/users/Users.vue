<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <el-card class="box-card">
      <el-row :gutter='20'>
        <el-col :span='7'>
          <el-input @clear='getUserList' placeholder="请输入姓名" v-model='queryInfo.query' clearable>
            <el-button @click='getUserList' slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary' @click='addDialogvisible = true'>添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data='userList' border stripe>
        <el-table-column label='#' type='index'></el-table-column>
        <el-table-column label='姓名' prop='username'></el-table-column>
        <el-table-column label='邮箱' prop='email'></el-table-column>
        <el-table-column label='电话' prop='mobile'></el-table-column>
        <el-table-column label='权限' prop='role_name'></el-table-column>
        <el-table-column label='状态'>
          <template slot-scope='scope'>
            <el-switch v-model='scope.row.mg_state' @change='userStateChanged(scope.row)'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='180px'>
          <template slot-scope='scope'>
            <el-button @click='showEditDialog(scope.row.id)' type='primary' icon='el-icon-edit' size='mini'></el-button>
            <el-button @click='removeUserById(scope.row.id)' type='danger' icon='el-icon-delete' size='mini'></el-button>
            <!-- 为按钮加个文字提示 -->
            <el-tooltip :enterable='false' effect="dark" content="分配角色" placement="top">
              <el-button @click='setRole(scope.row)' type='warning' icon='el-icon-setting' size='mini'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total">
      </el-pagination>
    </el-card>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogvisible"
        @close='addDialogClosed'
        width="50%">
        <el-form
          :model="addFrom"
          :rules="addFromRules"
          ref="addFromRef"
          label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addFrom.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogvisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogvisible"
        @close='editDialogClosed'
        width="50%">
        <!-- 前面有定义过邮箱和手机的表单规则，这里直接使用就可以了 -->
        <el-form
          :model="editFrom"
          :rules="addFromRules"
          ref="editFromRef"
          label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogvisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRightsDialogVisible"
        @close='setRoleDialogClosed'
        width="50%">
        <div>
          <p>当前的用户: {{userInfo.username}}</p>
          <p>当前的角色: {{userInfo.role_name}}</p>
          <p>分配新角色:
            <el-select v-model="selectRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    const checkEmail = (rules, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }

      callback(new Error('请输入正确的邮箱'))
    }
    const checkMobile = (rules, value, callback) => {
      // 验证邮箱的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法邮箱
        return callback()
      }

      callback(new Error('请输入正确的手机号'))
    }
    return {
      // 获取用户列表的参数列表
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示
      addDialogvisible: false,
      // 添加用户的表单数据
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单规则
      addFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '用户名长度在5~15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示
      editDialogvisible: false,
      // 获取到的用户信息
      editFrom: {
        username: '',
        email: '',
        mobile: ''
      },
      // 控制分配角色对话框的显示
      setRightsDialogVisible: false,
      // 需要被发分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      selectRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$axios.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // switch状态改变
    async userStateChanged (userinfo) {
      const { data: res } = await this.$axios.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 添加用户对话框的关闭事件
    addDialogClosed () {
      // 通过表单的ref下的resetFields来重置表单状态
      this.$refs.addFromRef.resetFields()
    },
    // 添加用户
    addUser () {
      // 验证表单
      this.$refs.addFromRef.validate(async (valid) => {
        if (!valid) return false
        // 表单格式正确可以提交
        const { data: res } = await this.$axios.post('users', this.addFrom)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功!')
        this.addDialogvisible = false
        this.getUserList()
      })
    },
    // 修改用户信息的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$axios.get(`/users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败!')
      }
      this.editFrom = res.data
      this.editDialogvisible = true
    },
    // 修改表单关闭后重置
    editDialogClosed () {
      this.$refs.editFromRef.resetFields()
    },
    editUserInfo () {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$axios.put(`users/${this.editFrom.id}`, {
          email: this.editFrom.email,
          mobile: this.editFrom.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败!')
        }
        this.editDialogvisible = false
        this.getUserList()
        this.$message.success('更新用户信息成功!')
      })
    },
    // 根据id删除用户
    removeUserById (id) {
      // 弹框确认
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败!')
        }
        this.$message.success('删除成功!')
        this.getUserList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 分配角色的对话框
    async setRole (userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败!')
      this.rolesList = res.data
      this.setRightsDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo () {
      if (!this.selectRoleId) return this.$message.error('请选择要分配的角色!')
      const { data: res } = await this.$axios.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error('更新角色失败!')
      this.$message.success('更新角色成功!')
      this.getUserList()
      this.setRightsDialogVisible = false
    },
    // 角色分配对话框的关闭事件
    setRoleDialogClosed () {
      this.selectRoleId = ''
    }
  }
}
</script>

<style lang='less' scoped>
// .users {
  // text-align: center;
// }
</style>
