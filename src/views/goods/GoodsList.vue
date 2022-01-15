<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder="请输入内容">
            <el-button slot='append' icon='el-icon-search'></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary'>添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data='goodsList' border stripe>
        <el-table-column type='index' label='#'></el-table-column>
        <el-table-column label='商品名称' prop='goods_name'></el-table-column>
        <el-table-column label='商品价格(元)' prop='goods_price' width='95px'></el-table-column>
        <el-table-column label='商品重量' prop='goods_weight' width='70px'></el-table-column>
        <el-table-column label='创建时间' prop='add_time' width='140px'>
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label='操作' width='130px'>
          <template >
            <el-button size='mini' type='primary' icon='el-icon-edit'></el-button>
            <el-button size='mini' type='danger' icon='el-icon-delete'></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$axios.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败!')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getGoodsList()
    },
    handleCurrentChange (pageNum) {
      this.queryInfo.pagenum = pageNum
      this.getGoodsList()
    }
  }
}
</script>

<style lang='less' scoped>

</style>
