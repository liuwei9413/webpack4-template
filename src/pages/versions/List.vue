<template>
  <div class="list-wrap">
    <div class="title">版本管理列表</div>
    <div class="form-wrap clearfix">
      <div class="filter-wrap">
        <div class="item">
          <span class="label">发布平台</span>
          <el-checkbox-group class="value" v-model="platformTypeCheckList" @change="platformChange">
            <el-checkbox label="iOS">iOS</el-checkbox>
            <el-checkbox label="Android">Android</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="item">
          <span class="label">是否强制升级</span>
          <el-checkbox-group class="value" v-model="forceUpgradeCheckList" @change="updateChange">
            <el-checkbox label="0">非强制升级</el-checkbox>
            <el-checkbox label="1">强制升级</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <el-button class="add-btn" type="primary" @click="jumpToAddPage">创建新版本</el-button>
    </div>
    <div class="table-wrap" v-loading="loading">
      <el-table
        :data="tableData"
        style="width: 100%"
        @sort-change="sortChange"
        >
        <el-table-column
          prop="platformType"
          label="平台"
          width="80">
        </el-table-column>
        <el-table-column
          prop="code"
          label="版本代码"
          width="100"
          sortable="custom">
        </el-table-column>
        <el-table-column
          prop="versionInfo"
          width="100"
          label="版本号">
        </el-table-column>
        <el-table-column
          prop="needUpdate"
          label="是否强制升级"
          width="120"
          :formatter="upgradeFormatter">
        </el-table-column>
        <el-table-column
          prop="appHash"
          label="校验Hash">
        </el-table-column>
        <el-table-column
          prop="description"
          label="版本描述">
          <template slot-scope="scope">
            <div class="description" v-html="scope.row.description"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="packageUrl"
          label="升级URL">
        </el-table-column>
        <el-table-column
          prop="channel"
          label="渠道"
          width="80">
        </el-table-column>
        <el-table-column
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editItem(scope.row.id)"
              type="text">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrap" v-if="tableDataLength > 0">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getVersionsList } from '@/service.js'

export default {
  components: {
  },
  data () {
    return {
      platformTypeCheckList: ['iOS', 'Android'],
      forceUpgradeCheckList: ['0', '1'],
      order: 'desc',
      tableData: [],
      tableDataLength: 0,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      loading: false
    }
  },
  created () {
  },
  mounted  () {
    this.getList()
  },
  methods: {
    getList () {
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        update: this.forceUpgradeCheckList.join(),
        platform: this.platformTypeCheckList.join(),
        order: this.order
      }
      this.loading = true
      getVersionsList(params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.rows
          this.tableDataLength = res.data.rows.length
          this.total = res.data.count
        })
        .catch(error => {
          this.loading = false
          console.log(error)
        })
    },
    upgradeFormatter (row, column) {
      return row.needUpdate ? '强制升级' : '非强制升级'
    },
    sortChange (args) {
      this.order = args.order === 'ascending' ? 'asc' : args.order === 'descending' ? 'desc' : ''
      this.getList()
      console.log(args)
    },
    handleCurrentChange () {
      this.getList()
    },
    jumpToAddPage () {
      this.$router.push({ path: '/versions/add' })        
    },
    platformChange (checkList) {
      this.platformTypeCheckList = checkList
      this.getList()
    },
    updateChange (checkList) {
      this.forceUpgradeCheckList = checkList
      this.getList()
    },
    editItem (id) {
      this.$router.push({ path: `/versions/edit?id=${id}` })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.list-wrap {
  .title {
    margin-bottom: 35px;
  }
  .form-wrap {
    margin-bottom: 16px;
    .filter-wrap {
      float: left;
      .item {
        margin-bottom: 20px;
        .label {
          display: inline-block;
          margin-right: 30px;
          width: 100px;
          text-align: right;
        }
        .value {
          display: inline-block;
        }
      }
    }
    .add-btn {
      float: right;
    }
  }
  .table-wrap {
    margin-bottom: 30px;
  }
  .pagination-wrap {
    .el-pagination {
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.description {
  p {
    margin: 0;
  }
}
</style>