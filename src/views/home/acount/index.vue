<template>
  <el-container style="background-color:#fff;height:100%">
    <el-aside style="width:50%;padding:20px">
      <el-form ref="form" :model="form" label-width="80px" label-position="top">
        <el-form-item label="媒体名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="媒体简介">
          <el-input type="textarea" v-model="form.intro"></el-input>
        </el-form-item>
        <el-form-item label="头条号id">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="绑定手机">
          <el-input v-model="form.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存更新</el-button>
        </el-form-item>
      </el-form>
    </el-aside>
    <el-main style="padding:20px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
        :show-file-list="false"
        :http-request="upLoad"
      >
        <img v-if="form.photo" :src="form.photo" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        intro: "",
        id: "",
        mobile: "",
        email: "",
        photo: ""
      },

      head: {
        Authorization: `Bearer `
      }
    };
  },
  methods: {
    async upLoad(config) {
      let fd = new FormData();
      fd.append("photo", config.file);
      try {
        let res = await this.$axios.patch("mp/v1_0/user/photo", fd);
        this.form.photo = res.data.data.photo;
      } catch (error) {
        window.console.log(error);
      }
    },
    async save(){
        try {
            let res = await this.$axios.patch('/mp/v1_0/user/profile',this.form
            )
            window.console.log(res)
            this.$store.commit('updata',this.form)
        } catch (error) {
            window.console.log(error)
        }
    }
  },
  async created() {
    try {
      let res = await this.$axios.get("/mp/v1_0/user/profile");
      window.console.log(res);
      this.form = res.data.data;
      this.photo = res.data.data.photo;
    } catch (error) {
      window.console.log(error);
    }
  }
};
</script>

<style>
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