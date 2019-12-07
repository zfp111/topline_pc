<template>
  <el-card class="box-card" style="height:90%">
    <div slot="header" class="clearfix">
      <el-radio-group v-model="menu" @change="search()">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>
      <el-upload
        style="float:right"
        class="upload-demo"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="head"
        name="image"
        :show-file-list="false"
        :on-success="upload"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-row :gutter="20">
      <el-col
        :span="4"
        class="mycol"
        v-for="(item,index) in data"
        :key="index"
        style="margin-bottom:20px;"
      >
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" />
          <div style="padding: 0px;" class="opt">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.is_collected ? '取消收藏' : '收藏'"
              placement="top"
            >
              <el-button
                type="text"
                @click="doClloct(item)"
                :icon="`el-icon-star-${item.is_collected ? 'on':'off'}`"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="text" icon="el-icon-delete" @click="doDel(item)"></el-button>
            </el-tooltip>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="lopage">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="total,prev,pager,next"
        :total="total"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      status: "全部",
      data: {
        url: "",
        is_collected: ""
      },
      total: 1,
      menu: "全部",
      head:{
        Authorization:`Bearer ${this.$store.state.userInfo.token}`
      }
    };
  },
  methods: {
    upload(){
      this.loadImg(1)
    },
    async doClloct(item) {
      try {
        item.is_collected = !item.is_collected;
        await this.$axios.put(`/mp/v1_0/user/images/${item.id}`, {
          collect: item.is_collected
        });
      } catch (error) {
        this.$message.error("收藏失败");
        window.console.log(error);
      }
    },
    async doDel(item) {
      try {
        await this.$axios.delete(`/mp/v1_0/user/images/${item.id}`);
        this.$message.success("删除成功");
        this.loadImg();
      } catch (error) {
        window.console.log(error);
      }
    },

    async loadImg(page = 1) {
      try {
        let res = await this.$axios.get("/mp/v1_0/user/images", {
          params: {
            page,
            per_page: 12,
            collect: !(this.menu == "全部")
          }
        });
        window.console.log(res);
        this.data = res.data.data.results;
        this.total = res.data.data.total_count;
      } catch (error) {
        window.console.log(error);
      }
    },
    handleCurrentChange(page) {
      this.loadImg(page);
    },
    search() {
      this.loadImg();
    }
  },
  created() {
    this.loadImg();
  }
};
</script>

<style lang="less" scoped>
.mycol {
  height: 270px;
  .image {
    width: 100%;
    height: 235px;
  }
  .opt {
    height: 15%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0px;
    background-color: #f4f5f6;
  }
  .lopage {
    margin: 0 auto;
    text-align: center;
    display: block;
  }
}
</style>