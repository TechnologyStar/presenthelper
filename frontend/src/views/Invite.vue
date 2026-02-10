<template>
  <div class="invite-page">
    <el-card class="header-card">
      <h2>邀请好友</h2>
      <p class="subtitle">邀请好友注册，双方都可获得奖励</p>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="invite-card">
          <h3>我的邀请码</h3>
          <div class="invite-code-box">
            <div class="invite-code">{{ inviteCode }}</div>
            <el-button type="primary" @click="copyInviteCode">
              <el-icon><CopyDocument /></el-icon>
              复制邀请码
            </el-button>
          </div>

          <el-divider />

          <h3>邀请链接</h3>
          <div class="invite-link-box">
            <el-input v-model="inviteLink" readonly>
              <template #append>
                <el-button @click="copyInviteLink">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </template>
            </el-input>
          </div>

          <el-divider />

          <div class="invite-rewards">
            <h3>邀请奖励</h3>
            <el-space direction="vertical" :size="10" style="width: 100%">
              <div class="reward-item">
                <el-icon color="#67C23A"><Check /></el-icon>
                <span>好友注册成功，你获得 <strong>50 积分</strong></span>
              </div>
              <div class="reward-item">
                <el-icon color="#67C23A"><Check /></el-icon>
                <span>好友首次答题，你获得 <strong>1 张随机卡片</strong></span>
              </div>
              <div class="reward-item">
                <el-icon color="#67C23A"><Check /></el-icon>
                <span>好友获得 <strong>30 积分</strong> 新人奖励</span>
              </div>
            </el-space>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="stats-card">
          <h3>邀请统计</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ inviteStats.total }}</div>
              <div class="stat-label">累计邀请</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ inviteStats.successful }}</div>
              <div class="stat-label">成功注册</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ inviteStats.points_earned }}</div>
              <div class="stat-label">获得积分</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ inviteStats.cards_earned }}</div>
              <div class="stat-label">获得卡片</div>
            </div>
          </div>
        </el-card>

        <el-card class="invitees-card">
          <h3>邀请记录</h3>
          <el-table :data="invitees" v-loading="loading" max-height="400">
            <el-table-column prop="invitee_username" label="用户名" />
            <el-table-column prop="registered_at" label="注册时间">
              <template #default="{ row }">
                {{ formatDate(row.registered_at) }}
              </template>
            </el-table-column>
            <el-table-column prop="reward_given" label="奖励状态">
              <template #default="{ row }">
                <el-tag :type="row.reward_given ? 'success' : 'info'">
                  {{ row.reward_given ? '已发放' : '待发放' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="!loading && invitees.length === 0" description="暂无邀请记录" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { CopyDocument, Check } from '@element-plus/icons-vue';
import { getMyInvites } from '@/api/invite';
import { getUserProfile } from '@/api/user';
import { useClipboard } from '@/utils/clipboard';

const loading = ref(false);
const inviteCode = ref('');
const invitees = ref([]);
const userProfile = ref(null);

const inviteLink = computed(() => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/register?invite=${inviteCode.value}`;
});

const inviteStats = computed(() => {
  return {
    total: invitees.value.length,
    successful: invitees.value.filter(i => i.reward_given).length,
    points_earned: invitees.value.filter(i => i.reward_given).length * 50,
    cards_earned: invitees.value.filter(i => i.reward_given).length
  };
});

const loadUserProfile = async () => {
  try {
    const res = await getUserProfile();
    userProfile.value = res.data;
    inviteCode.value = res.data.invite_code || '';
  } catch (error) {
    ElMessage.error('获取用户信息失败');
  }
};

const loadInvites = async () => {
  loading.value = true;
  try {
    const res = await getMyInvites();
    invitees.value = res.data;
  } catch (error) {
    ElMessage.error(error.message || '获取邀请记录失败');
  } finally {
    loading.value = false;
  }
};

const copyInviteCode = () => {
  useClipboard(inviteCode.value);
  ElMessage.success('邀请码已复制到剪贴板');
};

const copyInviteLink = () => {
  useClipboard(inviteLink.value);
  ElMessage.success('邀请链接已复制到剪贴板');
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-CN');
};

onMounted(() => {
  loadUserProfile();
  loadInvites();
});
</script>

<style scoped>
.invite-page {
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

.invite-card h3,
.stats-card h3,
.invitees-card h3 {
  margin-top: 0;
  color: #303133;
}

.invite-code-box {
  text-align: center;
  padding: 20px;
}

.invite-code {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  letter-spacing: 4px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.invite-link-box {
  margin: 20px 0;
}

.invite-rewards {
  margin-top: 20px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.stats-card {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.invitees-card {
  margin-top: 20px;
}
</style>
