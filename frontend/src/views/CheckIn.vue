<template>
  <div class="checkin-page">
    <el-card class="page-header">
      <h2>每日签到</h2>
      <p class="subtitle">连续签到获得更多奖励</p>
    </el-card>

    <el-card class="checkin-card" v-loading="loading">
      <div class="checkin-content">
        <div class="checkin-icon">
          <el-icon :size="100" :color="hasCheckedIn ? '#67C23A' : '#409EFF'">
            <component :is="hasCheckedIn ? 'CircleCheck' : 'Calendar'" />
          </el-icon>
        </div>

        <div v-if="!hasCheckedIn" class="checkin-action">
          <h3>今日还未签到</h3>
          <p class="consecutive-days">当前连续签到：{{ consecutiveDays }} 天</p>
          <el-button
            type="primary"
            size="large"
            @click="handleCheckIn"
            :loading="checking"
          >
            立即签到
          </el-button>
          <p class="checkin-tip">连续签到7天可获得稀有卡片奖励</p>
        </div>

        <div v-else class="checkin-success">
          <h3>今日已签到</h3>
          <p class="consecutive-days">连续签到：{{ consecutiveDays }} 天</p>
          <p class="next-checkin">明天再来签到吧</p>
        </div>
      </div>
    </el-card>

    <el-card v-if="rewardCard" class="reward-card-display">
      <h3>签到奖励</h3>
      <div class="reward-content">
        <el-tag
          :type="getRarityType(rewardCard.rarity)"
          size="large"
          class="reward-tag"
        >
          {{ rewardCard.name }}
        </el-tag>
        <p v-if="isSpecialReward" class="special-reward-text">
          连续签到7天奖励！
        </p>
      </div>
    </el-card>

    <el-card class="checkin-calendar">
      <h3>签到日历</h3>
      <div class="calendar-grid">
        <div
          v-for="day in 30"
          :key="day"
          class="calendar-day"
          :class="{ 'checked': isCheckedDay(day) }"
        >
          <span class="day-number">{{ day }}</span>
          <el-icon v-if="isCheckedDay(day)" class="check-icon">
            <Check />
          </el-icon>
        </div>
      </div>
    </el-card>

    <el-card class="checkin-history">
      <div class="history-header">
        <h3>签到历史</h3>
        <el-button text @click="loadHistory">刷新</el-button>
      </div>
      <el-table
        :data="historyList"
        v-loading="historyLoading"
        stripe
      >
        <el-table-column prop="date" label="日期" width="150" />
        <el-table-column prop="consecutiveDays" label="连续天数" width="120">
          <template #default="{ row }">
            <el-tag type="success">{{ row.consecutiveDays }} 天</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default>
            <el-tag type="success">已签到</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="historyTotal > historyPageSize"
        class="history-pagination"
        :current-page="historyPage"
        :page-size="historyPageSize"
        :total="historyTotal"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Calendar, CircleCheck, Check } from '@element-plus/icons-vue';
import { getCheckInStatus, checkIn, getCheckInHistory } from '@/api/checkin';

const loading = ref(false);
const checking = ref(false);
const hasCheckedIn = ref(false);
const consecutiveDays = ref(0);
const rewardCard = ref(null);
const isSpecialReward = ref(false);

const historyLoading = ref(false);
const historyList = ref([]);
const historyPage = ref(1);
const historyPageSize = ref(10);
const historyTotal = ref(0);

const loadStatus = async () => {
  loading.value = true;
  try {
    const res = await getCheckInStatus();
    hasCheckedIn.value = res.data.hasCheckedIn;
    consecutiveDays.value = res.data.consecutiveDays;
  } catch (error) {
    ElMessage.error(error.message || '获取签到状态失败');
  } finally {
    loading.value = false;
  }
};

const handleCheckIn = async () => {
  checking.value = true;
  try {
    const res = await checkIn();
    hasCheckedIn.value = true;
    consecutiveDays.value = res.data.consecutiveDays;
    rewardCard.value = res.data.rewardCard;
    isSpecialReward.value = res.data.isSpecialReward;

    ElMessage.success(res.message || '签到成功');
    loadHistory();
  } catch (error) {
    ElMessage.error(error.message || '签到失败');
  } finally {
    checking.value = false;
  }
};

const loadHistory = async () => {
  historyLoading.value = true;
  try {
    const res = await getCheckInHistory({
      page: historyPage.value,
      limit: historyPageSize.value
    });
    historyList.value = res.data.data;
    historyTotal.value = res.data.total;
  } catch (error) {
    ElMessage.error(error.message || '获取签到历史失败');
  } finally {
    historyLoading.value = false;
  }
};

const handlePageChange = (page) => {
  historyPage.value = page;
  loadHistory();
};

const isCheckedDay = (day) => {
  const today = new Date().getDate();
  return day <= today && hasCheckedIn.value;
};

const getRarityType = (rarity) => {
  const types = {
    common: 'info',
    rare: 'success',
    epic: 'warning',
    legendary: 'danger'
  };
  return types[rarity] || 'info';
};

onMounted(() => {
  loadStatus();
  loadHistory();
});
</script>

<style scoped>
.checkin-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
}

.subtitle {
  margin: 0;
  color: #909399;
}

.checkin-card {
  margin-bottom: 20px;
}

.checkin-content {
  text-align: center;
  padding: 40px 20px;
}

.checkin-icon {
  margin-bottom: 30px;
}

.checkin-action h3,
.checkin-success h3 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 24px;
}

.consecutive-days {
  margin: 0 0 30px 0;
  color: #409EFF;
  font-size: 20px;
  font-weight: bold;
}

.checkin-tip {
  margin: 20px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.next-checkin {
  margin: 20px 0 0 0;
  color: #606266;
  font-size: 16px;
}

.reward-card-display {
  margin-bottom: 20px;
  text-align: center;
}

.reward-card-display h3 {
  margin: 0 0 20px 0;
  color: #303133;
}

.reward-content {
  padding: 20px;
}

.reward-tag {
  font-size: 18px;
  padding: 15px 30px;
}

.special-reward-text {
  margin: 15px 0 0 0;
  color: #E6A23C;
  font-weight: bold;
  font-size: 16px;
}

.checkin-calendar {
  margin-bottom: 20px;
}

.checkin-calendar h3 {
  margin: 0 0 20px 0;
  color: #303133;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background-color: #F5F7FA;
  transition: all 0.3s;
}

.calendar-day.checked {
  background-color: #67C23A;
  border-color: #67C23A;
  color: white;
}

.day-number {
  font-size: 16px;
  font-weight: bold;
}

.check-icon {
  margin-top: 5px;
  font-size: 20px;
}

.checkin-history h3 {
  margin: 0 0 20px 0;
  color: #303133;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
