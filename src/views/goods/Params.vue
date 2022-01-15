<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert type='warning' title='注意: 只允许为第三级分类设置相关参数!' show-icon :closable='false'></el-alert>
      <el-row class='cat_opt'>
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="cascaderHandleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model='tabsName' @tab-click='tabsHandleClick'>
        <el-tab-pane label='动态参数' name='many'>
          <el-button type='primary' size='mini' :disabled='isBtnDisabled' @click='addDialogVisible = true'>添加参数</el-button>
          <!-- 动态参数面板 -->
          <el-table :data='manyTableData' border stripe>
            <!-- 展开行 -->
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <el-tag
                  closable
                  @close="handleClose(index, scope.row)"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-show="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-show="!scope.row.inputVisible"
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)">添加标签</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index' label='#'></el-table-column>
            <el-table-column label='参数名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作'>
              <template slot-scope="scope">
                <el-button @click='shwoEditCateDialog(scope.row)' size='mini' type='primary' icon='el-icon-edit'>编辑</el-button>
                <el-button @click='deleteParams(scope.row.attr_id)' size='mini' type='danger' icon='el-icon-delete'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label='静态属性' name='only'>
          <el-button type='primary' size='mini' :disabled='isBtnDisabled' @click='addDialogVisible = true'>添加属性</el-button>
          <!-- 静态属性面板 -->
          <el-table :data='onlyTableData' border stripe>
            <!-- 展开行 -->
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <el-tag
                  closable
                  @close="handleClose(index, scope.row)"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-show="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-show="!scope.row.inputVisible"
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)">添加标签</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index' label='#'></el-table-column>
            <el-table-column label='属性名称' prop='attr_name'></el-table-column>
            <el-table-column label='操作'>
              <template slot-scope="scope">
                <el-button @click='shwoEditCateDialog(scope.row)' size='mini' type='primary' icon='el-icon-edit'>编辑</el-button>
                <el-button @click='deleteParams(scope.row.attr_id)' size='mini' type='danger' icon='el-icon-delete'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      @close='addDialogClosed'
      width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑的对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      @close='editDialogClosed'
      width="50%">
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      tabsName: 'many',
      manyTableData: [],
      onlyTableData: [],
      // 添加的对话框
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改
      editDialogVisible: false,
      editForm: {
        attr_name: ''
      }
    }
  },
  computed: {
    // 如果需要按钮禁用就返回true
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 添加按钮的标题
    titleText () {
      if (this.tabsName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败!')
      this.cateList = res.data
    },
    // 获取参数的数据列表
    async getParamsData () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return 0
      }
      // 根据所选分类的id和当前所处的面板，获取对应的参数
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.tabsName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败!')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.tabsName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    async cascaderHandleChange () {
      this.getParamsData()
    },
    // 切换tab-pane时触发
    tabsHandleClick () {
      this.getParamsData()
    },
    // 添加参数的对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加参数
    addParams () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$axios.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.tabsName
        })
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 显示编辑dialog
    async shwoEditCateDialog (scope) {
      // 查询当前参数的信息
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes/${scope.attr_id}`, {
        params: { attr_sel: this.tabsName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 编辑dialog关闭
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 确定
    editParams () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.tabsName
        })
        if (res.meta.status !== 200) return this.$message.error('修改参数失败!')
        this.$message.success('修改参数成功!')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除
    deleteParams (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${this.cateId}/attributes/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除参数失败!')
        this.getParamsData()
        this.$message.success('删除参数成功!')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 文本框失去焦点或enter触发
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return 0
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals (row) {
      const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) return this.$message.error('添加参数失败!')
      this.$message.success('修改参数成功')
    },
    showInput (row) {
      // 当点击按钮时显示文本框(按钮的v-show = !xxx)
      // $nextTick 方法的作用是，当页面上元素被重新渲染之后，才会指定回调函数中的代码
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除标签
    handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>

<style lang='less' scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 7px;
}
.input-new-tag {
  margin: 7px;
  width: 120px;
}
.button-new-tag {
  margin: 7px;
}
</style>
