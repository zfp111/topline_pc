<template>
  <el-form
    ref="form"
    :model="form"
    label-width="60px"
    :rules="rules"
    style="background-color:#fff;height:100%"
  >
    <div class="main">
      <h3>{{text}}</h3>
    </div>
    <el-form-item prop="title" label="标题">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <quillEditor v-model="form.content"></quillEditor>
    </el-form-item>
    <el-form-item label="封面">
      <el-radio-group v-model="form.cover.type">
        <el-radio :label="1">单图</el-radio>
        <el-radio :label="3">三图</el-radio>
        <el-radio :label="0">无图</el-radio>
        <el-radio :label="-1">自动</el-radio>
      </el-radio-group>
      <el-row :gutter="5" v-if="form.cover.type > 0">
        <el-col :span="4" v-for="(item,index) in form.cover.type" :key="index">
          <!-- <cover :url="form.cover.images[index]" @image-change='form.cover.images[index] = $event'></cover> -->
          <cover v-model="form.cover.images[index]" ></cover>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="频道">
      <channel v-model="form.channel_id"></channel>
    </el-form-item>
    <el-form-item>
      <el-button size="mini" @click="send(true)">存为草稿</el-button>
      <el-button type="primary" size="mini" @click="send(false)">发布</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import channel from "../components/channel";
import cover from "./components/cover";
export default {
  name: "publish",
  components: {
    quillEditor,
    channel,
    cover
  },
  data() {
    return {
      form: {
        title: "",
        content: "",
        channel_id: "",
        cover: {
          type: 0,
          images: []

        }
      },
      oldForm: {
        title: "",
        content: "",
        channel_id: "",
        cover: {
          type: 0,
          images: []
        }
      },
      text: "发布文章",
      isSend: false,
      rules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    send(flag) {
      this.$refs["form"].validate(v => {
        if (v) {
          this.form.cover.images.length = this.form.cover.type;

          if (this.$route.name == "add") {
            this.$axios
              .post("/mp/v1_0/articles", this.form, {
                params: {
                  draft: flag
                }
              })
              .then(() => {
                // 进来.then都代表发表成功
                this.$message.success("新增成功！");
                (this.isSend = true), this.$router.push("/article");
                this.form = "";
              })
              .catch(() => {
                this.$message.error("新增失败！");
              });
          } else {
            const id = this.$route.params.id;
            this.$axios
              .put(`/mp/v1_0/articles/${id}`, this.form)
              .then(() => {
                this.$message.success("修改成功");
                (this.isSend = true), this.$router.push("/article");
              })
              .catch(() => {
                this.$message.error("发布失败!");
              });
          }
        }
      });
    },
    loadData() {
      const id = this.$route.params.id;
      this.$axios.get(`/mp/v1_0/articles/${id}`).then(res => {
        window.console.log(res);
        // 其中就有频道id
        this.form = res.data.data;

        // 保存初始值
        this.oldForm.title = this.form.title;
        this.oldForm.content = this.form.content;
      });
    }
  },
  watch: {
    "$route.params.id"() {
      if (this.$route.name === "edit") {
        this.text = "编辑文章";
        this.loadData();
      } else if (this.$route.name === "add") {
        this.text = "发表文章";
        this.form.title = this.form.content = "";
        this.oldForm.title = this.oldForm.content = "";
      }
    }
  },
  created() {
    if (this.$route.name === "edit") {
      this.text = "编辑文章";
      this.loadData();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSend) {
      next();
    } else {
      if (
        this.form.title != this.oldForm.title ||
        this.form.content != this.oldForm.content
      ) {
        this.$confirm("页面内容有改动,你确定要离开?", "提示").then(() => {
          next();
        }).catch(() =>{
           next(from.path);
        })
      } else {
        next();
      }
    }
    // window.console.log(to)
    // window.console.log(from)
    // window.console.log(next)
  }
};
</script>

<style>
.main {
  background-color: antiquewhite;
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  margin-bottom: 20px;
}
.ql-editor {
  height: 300px;
}
</style>