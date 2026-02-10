<template>
  <div class="rewards-page">
    <el-card class="header-card">
      <div class="header-content">
        <h2>奖励商城</h2>
        <div class="user-points">
          <el-icon><Coin /></el-icon>
          <span>我的积分: {{ userPoints }}</span>
        </div>
      </div>
    </el-card>

    <el-tabs v-model="activeTab" class="rewards-tabs">
      <el-tab-pane label="可兑换奖励" name="available">
        <el-row :gutter="20" v-loading="loading">
          <el-col :span="8" v-for="item in shopItems" :key="item.id">
            <el-card class="reward-card" shadow="hover">
              <div class="reward-icon">
                <el-icon :size="60" :color="getRewardColor(item.type)">
                  <component :is="getRewardIcon(item.type)" />
                </el-icon>
              </div>
              <h3>{{ item.name }}</h3>
              <p class="reward-desc">{{ item.description }}</p>
              <div class="reward-info">
                <el-tag type="warning">{{ item.points_required }} 积分</el-tag>
                <el-tag v-if="item.stock !== null" :type="item.stock > 0 ? 'success' : 'danger'">
                  库存: {{ item.stock }}
                </el-tag>
              </div>
              <el-button
                type="primary"
                :disabled="userPoints < item.points_required || (item.stock !== null && item.stock <= 0)"
                @click="handleRedeem(item)"
                class="redeem-btn"
              >
                立即兑换
              </el-button>
            </el-card>
          </el-col>
          <el-empty v-if="!loading && shopItems.length === 0" description="暂无可兑换奖励" />
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="我的兑换记录" name="history">
        <el-table :data="redemptions" v-loading="loading">
          <el-table-column prop="reward_name" label="奖励名称" />
          <el-table-column prop="points_spent" label="消耗积分" />
          <el-table-column prop="redemption_code" label="兑换码">
            <template #default="{ row }">
              <el-text type="primary" copyable>{{ row.redemption_code }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="redeemed_at" label="兑换时间">
            <template #default="{ row }">
              {{ formatDate(row.redeemed_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === 'redeemed' ? 'success' : 'info'">
                {{ row.status === 'redeemed' ? '已兑换' : '待使用' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="!loading && redemptions.length === 0" description="暂无兑换记录" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Coin, Gift, ShoppingCart, Trophy } from '@element-plus/icons-vue';
import { getShopItems, redeemItem, getMyRedemptions } from '@/api/shop';
import { getUserProfile } from '@/api/user';

const activeTab = ref('available');
const loading = ref(false);
const shopItems = ref([]);
const redemptions = ref([]);
const userPoints = ref(0);

const loadUserProfile = async () => {
  try {
    const res = await getUserProfile();
    userPoints.value = res.data.points || 0;
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

const loadShopItems = async () => {
  loading.value = true;
  try {
    const res = await getShopItems();
    shopItems.value = res.data;
  } catch (error) {
    ElMessage.error(error.message || '获取奖励列表失败');
  } finally {
    loading.value = false;
  }
};

const loadRedemptions = async () => {
  loading.value = true;
  try {
    const res = await getMyRedemptions();
    redemptions.value = res.data;
  } catch (error) {
    ElMessage.error(error.message || '获取兑换记录失败');
  } finally {
    loading.value = false;
  }
};

const handleRedeem = async (item) => {
  try {
    await ElMessageBox.confirm(
      `确定要花费 ${item.points_required} 积分兑换 ${item.name} 吗？`,
      '确认兑换',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    const res = await redeemItem(item.id);
    ElMessage.success('兑换成功！');
    ElMessageBox.alert(
      `兑换码: ${res.data.redemption_code}`,
      '兑换成功',
      {
        confirmButtonText: '确定',
        type: 'success'
      }
    );

    await loadUserProfile();
    await loadShopItems();
    await loadRedemptions();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '兑换失败');
    }
  }
};

const getRewardIcon = (type) => {
  const icons = {
    'jd_card': ShoppingCart,
    'phone_credit': Coin,
    'gift': Gift,
    'default': Trophy
  };
  return icons[type] || icons.default;
};

const getRewardColor = (type) => {
  const colors = {
    'jd_card': '#E6A23C',
    'phone_credit': '#67C23A',
    'gift': '#F56C6C',
    'default': '#409EFF'
  };
  return colors[type] || colors.default;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-CN');
};

onMounted(() => {
  loadUserProfile();
  loadShopItems();
  loadRedemptions();
});
</script>

<style scoped>
.rewards-page {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0;
  color: #303133;
}

.user-points {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #E6A23C;
}

.rewards-tabs {
  margin-top: 20px;
}

.reward-card {
  margin-bottom: 20px;
  text-align: center;
  transition: transform 0.3s;
}

.reward-card:hover {
  transform: translateY(-5px);
}

.reward-icon {
  margin: 20px 0;
}

.reward-card h3 {
  margin: 10px 0;
  color: #303133;
}

.reward-desc {
  color: #909399;
  margin: 10px 0;
  min-height: 40px;
}

.reward-info {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
}

.redeem-btn {
  width: 100%;
  margin-top: 10px;
}
</style>
