<template>
  <div class="add-wrap" v-loading="loading">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/versions/list' }">版本管理列表</el-breadcrumb-item>
      <el-breadcrumb-item>版本新建</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="add-form">
      <el-form-item label="平台" prop="platformType">
        <el-radio-group v-model="addForm.platformType" @change="handleplatformTypeChange">
          <el-radio label="iOS"></el-radio>
          <el-radio label="Android"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="版本名称" prop="versionInfo">
        <el-input v-model="addForm.versionInfo" :placeholder="`最新版本号是iOS: v${iOSLatestVersion}，Android: v${AndroidLatestVersion}，请直接输入数字`"></el-input>
      </el-form-item>
      <el-form-item label="版本代号" prop="code">
        <el-input v-model="addForm.code" placeholder="请输入纯数字"></el-input>
      </el-form-item>
      <el-form-item label="渠道" prop="channel">
        <el-radio-group v-model="addForm.channel">
          <el-radio label="appstore"></el-radio>
          <el-radio label="inhouse"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="升级URL" prop="packageUrl">
        <el-input v-model="addForm.packageUrl"></el-input>
      </el-form-item>
      <el-form-item label="校验hash" prop="appHash">
        <el-input type="textarea" v-model="addForm.appHash"></el-input>
      </el-form-item>
      <el-form-item label="版本描述" prop="description" :class="{'is-error': !errorInfo}">
        <div class="edit-container">
          <quill-editor v-model="addForm.description"
            ref="myQuillEditor"
            class="editer"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @ready="onEditorReady($event)">
          </quill-editor>
        </div>
        <div class="el-form-item__error" v-if="!errorInfo">
          请输入版本信息
        </div>
      </el-form-item>
      <el-form-item label="强制升级" prop="needUpdate">
        <el-radio-group v-model="addForm.needUpdate">
          <el-radio :label="1">强制升级</el-radio>
          <el-radio :label="0">非强制升级</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addForm')">{{isAddPage ? '确认新建' : '保存'}}</el-button>
        <el-button type="danger" @click="deleteVersionPopup" v-if="!isAddPage">删除</el-button>
        <el-button @click="resetForm('addForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import { getLatestVersionInfo, addVersion, getVersionInfo, editVersion } from '@/service.js'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      isAddPage: this.$route.path.indexOf('/versions/add') > -1 ? true : false,
      loading: false,
      saveSuccess: false,
      iOSLatestVersion: '暂无',
      AndroidLatestVersion: '暂无',
      editorOption: {
        theme: 'snow', // snow|bubble
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ]
        }
      },
      errorInfo: true,
      addForm: {
        platformType: '',
        versionInfo: '',
        code: '',
        channel: '',
        packageUrl: '',
        appHash: '',
        description: '',
        needUpdate: ''
      },
      originAddForm: Object,
      rules: {
        platformType: [
          { required: true, message: '请选择平台', trigger: 'change' }
        ],
        versionInfo: [
          { required: true, message: '请输入版本名称', trigger: 'blur' },
          { pattern: /^(\d|\.)+$/, message: '仅可输入“数字0~9”与“."', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入版本代号', trigger: 'blur' },
          { pattern: /^(\d)+$/, message: '请输入纯数字的版本代号', trigger: 'blur' }
        ],
        channel: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        packageUrl: [
          { required: true, message: '请输入版本升级url', trigger: 'blur' },
          { pattern: /^(https:\/\/)(.+)$/, message: '请输入https://开头的合法url', trigger: 'blur' }
        ],
        appHash: [
          { required: true, message: '请输入hash值', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{32}$/, message: '请输入长度为32位的hash值', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入版本信息', trigger: 'blur' }
        ],
        needUpdate: [
          { required: true, message: '请选择是否强制升级', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    '$route' (to, from) {
      this.isAddPage = to.path.indexOf('/versions/add') > -1 ? true : false
      location.reload()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.originAddForm === JSON.stringify(this.addForm) || this.saveSuccess) {
      next()
    } else {
      this.$confirm('是否确认放弃编辑？', '提示', {
        confirmButtonText: '确认离开',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
      })
    }
  },
  created () {
  },
  mounted  () {
    this.getLatestVersionInfo()
    if (!this.isAddPage) {
      this.getVersionInfo()
    } else {
      this.originAddForm = JSON.stringify(this.addForm)
    }
  },
  methods: {
    getVersionInfo () {     
      getVersionInfo(this.$route.query.id)
        .then(res => {
          this.loading = false
          this.addForm = res.data
          this.originAddForm = JSON.stringify(this.addForm)
        })
        .catch(error => {
          this.loading = false
          console.log(error)
        })
    },
    getLatestVersionInfo () {
      getLatestVersionInfo()
        .then(res => {
          let result = res.data
          if (result.length > 0) {
            result.forEach((item, index) => {
              if (item.platformType === 'Android') {
                this.AndroidLatestVersion = item.versionInfo
              } else if (item.platformType === 'iOS') {
                this.iOSLatestVersion = item.versionInfo
              }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleplatformTypeChange (value) {
      this.addForm.packageUrl = value === 'iOS' ? 'https://www.vechain.com/ios' : value === 'Android' ? 'https://www.vechain.com/android' : ''
    },
    onEditorBlur (ev) {
      this.errorInfo = !!this.addForm.description
    },
    onEditorReady (ev) {
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(`${this.isAddPage ? '是否确认新建版本信息？' : '是否确认修改版本信息？'}`, '提示', {
            confirmButtonText: `${this.isAddPage ? '确认新建' : '确认修改'}`,
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.addForm = this.addForm
            this.loading = true
            if (this.isAddPage) {
              addVersion(this.addForm)
                .then(res => {
                  this.loading = false
                  this.saveSuccess = true
                  this.$refs[formName].resetFields()
                  this.$router.push({ path: '/versions/list' })
                })
                .catch(error => {
                  this.loading = false
                  console.log(error)
                })
            } else {
              editVersion(this.addForm)
                .then(res => {
                  this.loading = false
                  this.saveSuccess = true
                  this.$router.push({ path: '/versions/list' })
                })
                .catch(error => {
                  this.loading = false
                  console.log(error)
                })
            }         
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },
    resetForm (formName) {
      this.$router.push({path: '/versions/list'})
    },
    deleteVersionPopup () {
      this.$confirm('是否确认删除版本信息？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteVersion()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteVersion () {
      alert('删除')
    }
  }
}
</script>

<!-- element-ui reset -->
<style lang="scss">
  .add-form {
    .el-form-item__label {
      padding: 0 32px 0 0;
    }
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.add-wrap {
  .breadcrumb {
    margin-bottom: 30px;
  }
  .add-form {
    width: 80%;
  }
}
</style>