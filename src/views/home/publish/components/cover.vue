<template>
  <div>
    <div @click="dialogVisible = true" class="mymain">
      <img v-if="url" :src="url" class="myImg" alt />
      <div v-else>
        <h2>点击选择图片</h2>
        <i style="  color: #333;font-size: 100px;" class="el-icon-picture-outline"></i>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="50%">
      <el-tabs v-model="activeName">
        <el-tab-pane label="上传图片" name="first">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers="header"
            name="image"
            :on-success="upload"
          >
            <img v-if="imageUrl"  :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="媒体库" name="second">
          <media  @image-change="imageUrl=$event"></media>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import media from "./media";
export default {
  name: "cover",

  props: ["url"],

  model: {
    prop: "url",
    event: "changeimg"
  },
  components: {
    media
  },
  data() {
    return {
      dialogVisible: false,
      imageUrl: "",
      header: {
        Authorization: `Bearer ${this.$store.state.userInfo.token}`
      },
      activeName: "first"
    };
  },
  methods: {
    upload(res) {
      this.imageUrl = res.data.url;
    },
    doOK() {
      this.dialogVisible = false;
      // this.url = this.imageUrl;
      this.$emit("changeimg", this.imageUrl);
    }
  }
};
</script>

<style lang="less" scoped>
.mymain{
  border: 1px solid #ccc;
  height: 150px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/deep/.myImg{
  width: 150px;
  height: 150px;
}
.imgup {
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>