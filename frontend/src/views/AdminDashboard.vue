<template>
  <div class="dashboard-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #409EFF;">
              <el-icon :size="30"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.users?.total || 0 }}</div>
              <div class="stat-label">总用户数</div>
              <div class="stat-sub">今日新增: {{ stats.users?.today || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #67C23A;">
              <el-icon :size="30"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.quiz?.total || 0 }}</div>
              <div class="stat-label">答题总数</div>
              <div class="stat-sub">今日: {{ stats.quiz?.today || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #E6A23C;">
              <el-icon :size="30"><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.checkIn?.total || 0 }}</div>
              <div class="stat-label">签到总数</div>
              <div class="stat-sub">今日: {{ stats.checkIn?.today || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #F56C6C;">
              <el-icon :size="30"><Collection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.cards?.collected || 0 }}</div>
              <div class="stat-label">卡片收集数</div>
              <div class="stat-sub">收集者: {{ stats.cards?.collectors || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>答题通过率</span>
            </div>
          </template>
          <div class="pass-rate-content">
            <el-progress
              type="circle"
              :percentage="parseFloat(stats.quiz?.passRate || 0)"
              :width="200"
              :stroke-width="15"
            >
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}%</span>
                <span class="percentage-label">通过率</span>
              </template>
            </el-progress>
            <div class="pass-rate-detail">
              <p>总答题数: {{ stats.quiz?.total || 0 }}</p>
              <p>通过数: {{ stats.quiz?.passed || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>题目难度分布</span>
            </div>
          </template>
          <div class="difficulty-chart">
            <div
              v-for="item in stats.questions?.byDifficulty || []"
              :key="item.difficulty"
              class="difficulty-item"
            >
              <div class="difficulty-label">
                <el-tag :type="getDifficultyType(item.difficulty)">
                  {{ getDifficultyText(item.difficulty) }}
                </el-tag>
              </div>
              <el-progress
                :percentage="(item.count / stats.questions?.total * 100).toFixed(1)"
                :stroke-width="20"
              >
                <span>{{ item.count }} 题</span>
              </el-progress>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近7天答题趋势</span>
            </div>
          </template>
          <div class="trend-chart">
            <div
              v-for="item in stats.trends?.quiz || []"
              :key="item.date"
              class="trend-item"
            >
              <div class="trend-bar" :style="{ height: getTrendHeight(item.count) + 'px' }">
                <span class="trend-value">{{ item.count }}</span>
              </div>
              <div class="trend-label">{{ formatDate(item.date) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统概况</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="题目总数">
              {{ stats.questions?.total || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="卡片总数">
              {{ stats.cards?.total || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="用户总数">
              {{ stats.users?.total || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="答题总数">
              {{ stats.quiz?.total || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="签到总数">
              {{ stats.checkIn?.total || 0 }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/admin/questions')">
              <el-icon><Document /></el-icon>
              管理题目
            </el-button>
            <el-button type="success" @click="$router.push('/admin/cardsets')">
              <el-icon><Collection /></el-icon>
              管理卡组
            </el-button>
            <el-button type="info" @click="refreshStats">
              <el-icon><Refresh /></el-icon>
              刷新数据
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { User, Document, Calendar, Collection, Refresh } from '@element-plus/icons-vue';
import { getStatistics } from '@/api/admin';

const stats = ref({});
const loading = ref(false);

const loadStats = async () => {
  loading.value = true;
  try {
    const res = await getStatistics();
    stats.value = res.data;
  } catch (error) {
    ElMessage.error(error.message || '获取统计数据失败');
  } finally {
    loading.value = false;
  }
};

const refreshStats = () => {
  loadStats();
  ElMessage.success('数据已刷新');
};

const getDifficultyType = (difficulty) => {
  const types = { easy: 'success', medium: 'warning', hard: 'danger' };
  return types[difficulty] || 'info';
};

const getDifficultyText = (difficulty) => {
  const texts = { easy: '简单', medium: '中等', hard: '困难' };
  return texts[difficulty] || difficulty;
};

const getTrendHeight = (count) => {
  const maxCount = Math.max(...(stats.value.trends?.quiz || []).map(t => t.count), 1);
  return Math.max((count / maxCount) * 150, 20);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const getStatistics = async () => {
  const response = await fetch('/api/admin/statistics', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
};

onMounted(() => {
  loadStats();
});
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-sub {
  font-size: 12px;
  color: #C0C4CC;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.pass-rate-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
}

.percentage-value {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
}

.percentage-label {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.pass-rate-detail {
  text-align: left;
}

.pass-rate-detail p {
  margin: 10px 0;
  font-size: 16px;
  color: #606266;
}

.difficulty-chart {
  padding: 20px;
}

.difficulty-item {
  margin-bottom: 20px;
}

.difficulty-label {
  margin-bottom: 10px;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 20px;
}

.trend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.trend-bar {
  width: 60px;
  background: linear-gradient(to top, #409EFF, #66B1FF);
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5px;
  transition: all 0.3s;
}

.trend-bar:hover {
  background: linear-gradient(to top, #337ECC, #5599DD);
}

.trend-value {
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.trend-label {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
}

.quick-actions .el-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
}
</style>
