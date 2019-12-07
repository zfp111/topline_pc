<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form ref="form" :model="form" label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label>全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="region">
          <channel v-model="form.channel_id"></channel>
        </el-form-item>
        <el-form-item label="时间" prop="region">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.date"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="doSearch">筛选</el-button>
      </el-form>
    </div>
    <p>共找到{{total}}条符合条件的数据</p>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="cover.images[0]" label="封面" width="260">
        <template slot-scope="scope">
          <img
            :src="item"
            v-for="(item,index) in scope.row.cover.images"
            :key="index"
            alt
            style="width:50px;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="success">{{scope.row.status | formateStaus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="$router.push(`/edit/${scope.row.id}`)">修改</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:0 auto; text-align:center ">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager,next,total"
        :total="total"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
import channel from "../components/channel";
export default {
  name: "artic",
  components: {
    channel
  },
  data() {
    return {
      form: {
        status: "",
        channel_id: "",
        date: ""
      },
      tableData: [],
      total: 0
    };
  },
  methods: {
    async del(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          type: "warning"
        });
        try {
          await this.$axios.delete(`/mp/v1_0/articles/${id}`);
          this.loadArticle(this.page);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        } catch (error) {
          this.$message("删除失败！");
        }
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },
    handleCurrentChange(page) {
      this.loadArticle(page);
    },
    loadArticle(page) {
      //获取文章列表
      this.$axios
        .get("/mp/v1_0/articles", {
          params: {
            status: this.form.status === "" ? undefined : this.form.status,
            channel_id:
              this.form.channel_id === "" ? undefined : this.form.channel_id,
            begin_pubdate: this.form.date[0],
            end_pubdate: this.form.date[1],
            page,
            per_page: 10
          }
        })
        .then(res => {
          this.tableData = res.data.data.results;
          this.total = res.data.data.total_count;
        });
    },
    doSearch() {
      this.page = 1;
      this.loadArticle(1);
    }
  },
  created() {
    this.loadArticle(1);
  },
  filters: {
    formateStaus(val) {
      switch (val) {
        case 0:
          return "草稿";
        case 1:
          return "待审核";
        case 2:
          return "审核通过";
        case 3:
          return "审核失败";
      }
    }
  }
};
</script>

<style >
.el-main {
  padding: 0;
}
</style>