<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 5314 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click='shwoAddCateDialog'>添加分类</el-button>
        </el-col>
      </el-row>
      <!-- vue-table-with-tree-grid -->
      <tree-table
        class="tree-table"
        :data='cateList'
        :columns='columns'
        :expand-type='false'
        :selection-type='false'
        :show-row-hover='false'
        index-text='#'
        show-index
        border>
        <!-- 是否有效 -->
        <template slot='isok' slot-scope='scope'>
          <i class="el-icon-success" v-if='scope.row.cat_deleted === false' style='color: lightgreen;'></i>
          <i class="el-icon-error" v-else style='color: red;'></i>
        </template>
        <!-- 排序 -->
        <template slot='order' slot-scope='scope'>
          <el-tag size='mini' v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size='mini' type='success' v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size='mini' type='warning' v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot='opt'>
          <el-button size='mini' type='primary' class='el-icon-edit'>编辑</el-button>
          <el-button size='mini' type='danger' class='el-icon-detele'>删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='queryInfo.pagenum'
        :page-sizes='[3, 5, 10, 15]'
        :page-size='queryInfo.pagesize'
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        @close='addCateDialogClosed'
        width="50%">
        <el-form
          :model="addCateForm"
          :rules="addCateRules"
          ref="addCateFormRef"
          label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
             <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取数据的条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      cateList: [],
      total: 0,
      // tree-table列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示这一列使用模板
          type: 'template',
          // 模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据列表
      parentCateList: [],
      // 级联选择器的配置
      cascaderProps: {
        // 默认只能选择最子级的节点，开启后可以选择父节点
        checkStrictly: 'true',
        // 鼠标hover显示子节点
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$axios.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$axios.get('categories', { params: 2 })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败!')
      this.parentCateList = res.data
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 添加分类对话框
    shwoAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    parentCateChanged () {
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$axios.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        console.log(this.addCateForm.cat_pid)
        this.addCateDialogVisible = false
      })
    },
    // 添加分类对话框关闭
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.addCateDialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.tree-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
