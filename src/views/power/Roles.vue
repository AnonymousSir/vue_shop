<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary'>添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data='rolesList' border stripe>
        <!-- 展开列 -->
        <el-table-column type='expand'>
          <template slot-scope="scope">
            <el-row v-for='(item1) in scope.row.children' :key='item1.id' class='expand-row vcenter'>
              <!-- 一级权限 -->
              <el-col :span='5'>
                <el-tag closable @close='removeRightById(scope.row, item1.id)' class='expand-tag'>{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span='19'>
                <el-row v-for="(item2) in item1.children" :key='item2.id' class='expand-row2 vcenter'>
                  <!-- 二级权限 -->
                  <el-col :span='6'>
                    <el-tag closable @close='removeRightById(scope.row, item2.id)' class='expand-tag' type='success'>{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span='18'>
                    <el-tag closable @close='removeRightById(scope.row, item3.id)' type='warning' v-for="(item3) in item2.children" :key='item3.id' class="expand-tag">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label='#' type='index'></el-table-column>
        <el-table-column label='角色名称' prop='roleName'></el-table-column>
        <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
        <el-table-column label='操作' width='300px'>
          <template slot-scope="scope">
            <el-button size='mini' type="primary" icon="el-icon-eidt">编辑</el-button>
            <el-button size='mini' type="danger" icon="el-icon-delete">删除</el-button>
            <el-button @click='showSetRightsDialog(scope.row)' size='mini' type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      @close='defKeys=[]'
      width="50%">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key='id'
        ref='treeRef'
        :default-checked-keys='defKeys'
        default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色数据列表
      rolesList: [],
      // 控制分配权限对话框的显示
      setRightsDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // tree默认勾选的节点id值
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolesList = res.data
    },
    // 根据id删除相应的权限
    async removeRightById (role, rightsId) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightsId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败!')
        }
        this.$message.success('删除成功!')
        // 重新获取数据会导致整个列表的刷新
        // this.getRolesList()
        role.children = res.data
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 分配权限dialog
    async showSetRightsDialog (role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限数据失败!')
      this.rightsList = res.data
      // 获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightsDialogVisible = true
    },
    // 通过递归，获取角色的三级权限
    getLeafKeys (node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败!')
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.expand-tag {
  margin: 7px;
}
.expand-row {
  border-top: 1px solid #eee;
}
.expand-row:first-child {
  border-top: 1px solid #eee;
}
.expand-row2 {
  border-top: 1px solid #eee;
}
.expand-row2:first-child {
  border-top: none;
}
</style>
