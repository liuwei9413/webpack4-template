<template>
  <header class="clearfix">
    <div class="title">VeChainThor Wallet 管理平台</div>
    <div class="welcome">
      <span>欢迎管理员</span>
      <span class="logout" @click="logout" v-loading.fullscreen.lock="loading">退出</span>
    </div>   
  </header>
</template>

<script>
import { removeStorage } from '@/util'
import { logout } from '@/service'

export default {
  name: 'Header',
  components: {
  },
  data () {
    return {
      loading: false
    }
  },
  created () {
  },
  mounted  () {
  },
  methods: {
    logout () {
      this.loading = true
      logout()
        .then((res) => {
          this.loading = false
          removeStorage('username')
          this.$router.push({ path: '/login' })
        })
        .catch((error) => {
          this.loading = false
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$bgcolor_header: #409eff;
$color_header: #ffffff;
header {
  position: fixed;
  top: 0;
  z-index: 2;
  width: 100%;
  color: $color_header;
  background-color: $bgcolor_header;
  .title {
    float: left;
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .welcome {
    float: right;
    padding-right: 20px;
    height: 60px;
    line-height: 60px;
    span {
      margin-right: 10px;
    }
    .logout {
      cursor: pointer;
    }
  }
}
</style>