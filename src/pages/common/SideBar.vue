<template>
  <section class="sidebar">
    <el-menu :default-active="activeIndex" @select="handleSelect">
      <el-submenu index="versions" v-for="(item, index) in layoutRoutes" :key="index">
        <template slot="title">
          <span>{{item.meta.title}}</span>
        </template>
        <el-menu-item :index="item2.path" v-for="(item2, index2) in item.children" :key="index2" v-if="!item2.hidden">{{item2.meta.title}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </section>
</template>

<script>

export default {
  name: 'SideBar',
  components: {
  },
  data () {
    return {
      activeIndex: this.$route.path
    }
  },
  computed: {
    layoutRoutes: function () {
      return this.$router.options.routes[0].children
    }
  },
  watch: {
    '$route': 'changeRoutes'
  },
  created () {
  },
  mounted  () {
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push({ path: key })
    },
    changeRoutes () {
      this.activeIndex = this.$route.path
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.sidebar {
  .el-menu {
    border-right: none;
  }
}
</style>