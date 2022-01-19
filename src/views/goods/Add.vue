<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示消息 -->
      <el-alert title="添加商品信息" type="info" :closable='false' center show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="Number(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
        label-width="100px">
        <el-tabs
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
          tab-position="left">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label='商品名称' prop='goods_name'>
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label='商品价格' prop='goods_price'>
              <el-input v-model="addForm.goods_price" type='number'></el-input>
            </el-form-item>
            <el-form-item label='商品重量' prop='goods_weight'>
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label='商品数量' prop='goods_number'>
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label='item.attr_name'>
              <!-- 复选框组 -->
               <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, index) in item.attr_vals"
                  :key="index + cb"
                  :label="cb"
                  border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传的后台api地址 -->
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headerObj"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              v-model="addForm.goods_introduce"
            ></quill-editor>
            <!-- 添加商品 -->
            <el-button @click='add' type='primary' class='btnAdd'>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>

  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      // 表单
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品介绍
        goods_introduce: '',
        // 商品的参数，包括动态参数和静态属性
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      goods_cat: [
        { required: true, message: '请选择商品分类', trigger: 'blur' }
      ],
      // 动态参数列表
      manyTableData: [],
      onlyTableData: [],
      // 图片上传的地址
      uploadUrl: 'http://localhost:8888/api/private/v1/upload',
      // header，因为api需要在header带有token
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      // 预览图片地址
      previewPath: '',
      previewVisible: false
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) return this.$message('获取商品列表失败')
      this.cateList = res.data
    },
    // 级联选择器选择项变化，会触发
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tab标签切换之前触发的钩子
    // return false 会阻止tab标签切换
    beforeLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    // tab切换
    async tabClicked () {
      // 判断访问的是哪个标签，用name判断
      // 1 是商品参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
        return 1
      }
      // 静态属性
      if (this.activeIndex === '2') {
        const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取静态属性数据失败')
        this.onlyTableData = res.data
        return 2
      }
    },
    // el-upload
    // 图片预览
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 移除图片
    handleRemove (file) {
      const filePath = file.response.data.tem_path
      const i = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 上传图片成功
    handleSuccess (response) {
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项!')
        // 表单验证完成，处理需要的参数
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理goods_cat
        // _是ladash包，它里面有和cloneDeep的深拷贝方法
        // 因为级联选择器需要绑定goods_cat，需要是一个数组，所以直接深拷贝出来上传
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 发起请求
        const { data: res } = await this.$axios.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败!')
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
