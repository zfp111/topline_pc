<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%;padding:20px;height:100%">
      <el-table-column prop="title" label="标题" width="220"></el-table-column>
      <el-table-column prop="comment_status" label="评论状态" width="220">
        <template slot-scope="scope">{{ scope.row.comment_status ? '正常' : '关闭' }}</template>
      </el-table-column>
      <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
      <el-table-column prop="fans_comment_count" label="总评粉丝数"></el-table-column>
      <el-table-column prop="comment_status" label="允许评论">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus($event,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="操作" >
        <el-button type="primary" size="mini" plain>修改</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      class="paga"
      @size-change="pagSize"
      @current-change="loadPage"
      :page-sizes="[10, 20, 30, 40]"
      :current-page.sync="page"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 1,
      page: 1
    };
  },
  created() {
    this.loadComent();
  },
  methods: {
    async changeStatus(status, id) {
      try {
        await this.$axios.put(
          "/mp/v1_0/comments/status",
          { allow_comment: status },
          { params: { article_id: "" + id } }
        );
        this.$message.success("修改成功");
      } catch {
        this.$message.error("修改失败");
      }
    },
    async loadComent(page = 1, size = 10) {
      try {
        let res = await this.$axios.get("/mp/v1_0/articles", {
          params: {
            response_type: "comment",
            page,
            per_page: size
          }
        });
        window.console.log(res);
        this.tableData = res.data.data.results;
        this.total = res.data.data.total_count;
      } catch (error) {
        window.console.log(error);
      }
    },
    loadPage(page) {
      this.loadComent(page);
    },
    pagSize(size) {
      this.page = 1;
      this.loadComent(1, size);
    }
  }
};
</script>

<style>
.paga {
  display: block;
  margin: 0 auto;
  text-align: center;
 
}
</style>