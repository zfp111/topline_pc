<template>
  <el-select :value="id" placeholder="请选择频道" @change="$emit('change',$event)">
    <el-option v-for="item in channleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  props: ["id"],
  model: {
    prop: "id",
    event: "change"
  },
  data() {
    return {
      channleList: []
    };
  },
  created() {
    //获取频道列表
    this.$axios.get("/mp/v1_0/channels").then(res => {
      // window.console.log(res);
      this.channleList = res.data.data.channels;
    });
  }
};
</script>

<style>
</style>