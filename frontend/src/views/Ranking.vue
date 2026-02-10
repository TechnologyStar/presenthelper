<template>
  <div class="ranking-page">
    <el-card class="header-card">
      <h2>积分排行榜</h2>
      <p class="subtitle">查看用户积分排名</p>
    </el-card>

    <el-card>
      <el-table :data="rankings" v-loading="loading">
        <el-table-column label="排名" width="80">
          <template #default="{ $index }">
            <el-tag v-if="$index === 0" type="danger" effect="dark">🥇</el-tag>
            <el-tag v-else-if="$index === 1" type="warning" effect="dark">🥈</el-tag>
            <el-tag v-else-if="$index === 2" type="success" effect="dark">🥉</el-tag>
            <span v-else class="rank-number">{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="150" />
        <el-table-column prop="points" label="积分" width="120">
          <template #default="{ row }">
            <el-text type="warning" size="large">
              <strong>{{ row.points }}</strong>
            </el-text>
          </template>
        </el-table-column>
        <el-table-column prop="quiz_count" label="答题次数" width="120" />
        <el-table-column prop="card_count" label="卡片数量" width="120" />
        <el-table-column prop="checkin_days" label="签到天数" width="120" />
      </el-table>
      <el-empty v-if="!loading && rankings.length === 0" description="暂无排名数据" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const rankings = ref([]);

const loadRankings = async () => {
  loading.value = true;
  try {
    // TODO: 调用实际的 API
    // const res = await getRankings();
    // rankings.value = res.data;

    // 模拟数据
    rankings.value = [
      { username: 'user1', points: 1000, quiz_count: 50, card_count: 30, checkin_days: 20 },
      { username: 'user2', points: 950, quiz_count: 48, card_count: 28, checkin_days: 19 },
      { username: 'user3', points: 900, quiz_count: 45, card_count: 25, checkin_days: 18 }
    ];
  } catch (error) {
    ElMessage.error('获取排行榜失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadRankings();
});
</script>

<style scoped>
.ranking-page {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
  text-align: center;
}

.header-card h2 {
  margin: 0 0 10px 0;
  color: #303133;
}

.subtitle {
  color: #909399;
  margin: 0;
}

.rank-number {
  font-size: 16px;
  font-weight: bold;
  color: #909399;
}
</style>
