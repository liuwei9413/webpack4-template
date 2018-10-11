<template>
  <div>
    <div class="header-wrap">
      <v-header></v-header>
    </div>
    <div class="sidebar-wrap">
      <v-sidebar></v-sidebar>
    </div> 
    <section class="main-wrap">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </section>
  </div>
</template>

<script>
import vHeader from './common/Header.vue'
import vSidebar from './common/SideBar.vue'

export default {
  name: 'Home',
  components: {
    vHeader,
    vSidebar
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted  () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.sidebar-wrap {
  position: fixed;
  z-index: 1;
  top: 60px;
  left: 0;
  width: 200px;
  height: 100%;
  overflow: auto;
  background-color: #FFF;
  border-right: 1px solid #f2f2f2;
}
.main-wrap {
  margin: 60px 0 0 200px;
  padding: 20px;
  // background: #f2f2f2;
  height: auto;
}
</style>