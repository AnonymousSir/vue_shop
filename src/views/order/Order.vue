<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data='orderList' border stripe>
        <el-table-column type='index' label='#'></el-table-column>
        <el-table-column label='订单编号' prop="order_number"></el-table-column>
        <el-table-column label='订单价格' prop="order_price"></el-table-column>
        <el-table-column label='是否付款' prop="pay_status">
          <template slot-scope="scope">
            <el-tag type='success' v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type='danger' v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label='是否发货' prop="is_send"></el-table-column>
        <el-table-column label='下单时间' prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label='操作'>
          <template>
            <!-- 修改地址 -->
            <el-button @click="showAddressBox" type="primary" size='mini' icon="el-icon-edit"></el-button>
            <!-- 位置 -->
            <el-button @click="showProgreessBox" type="success" size='mini' icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
       <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
    <!-- 修改的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      @close="address1DialogClosed"
      width="50%">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '@/components/citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      addressDialogVisible: false,
      addressForm: {
        address1: '',
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$axios.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败!')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // 分页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    // 修改第地址按钮
    showAddressBox () {
      this.addressDialogVisible = true
    },
    // 修改对话框关闭
    address1DialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 展示物流进度的对话框
    async showProgreessBox () {
      const id = 1106975712662
      const { data: res } = await this.$axios.get(`/kuaidi/${id}`)
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败!')
      this.progressInfo = res.data
      this.progressDialogVisible = true
    }
  }
}
</script>

<style lang='less' scoped>

</style>
