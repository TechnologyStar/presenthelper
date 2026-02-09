<template>
  <div class="home-container">
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <h2>爱国红色答题系统</h2>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><User /></el-icon>
              {{ userStore.userInfo?.username }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px" class="sidebar">
          <el-menu
            :default-active="activeMenu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="quiz">
              <el-icon><Edit /></el-icon>
              <span>每日答题</span>
            </el-menu-item>
            <el-menu-item index="cards">
              <el-icon><Collection /></el-icon>
              <span>我的卡册</span>
            </el-menu-item>
            <el-menu-item index="checkin">
              <el-icon><Calendar /></el-icon>
              <span>每日签到</span>
            </el-menu-item>
            <el-menu-item index="stories">
              <el-icon><Reading /></el-icon>
              <span>红色故事</span>
            </el-menu-item>
            <el-menu-item index="rewards">
              <el-icon><Gift /></el-icon>
              <span>奖励兑换</span>
            </el-menu-item>
            <el-menu-item index="invite">
              <el-icon><Share /></el-icon>
              <span>邀请好友</span>
            </el-menu-item>
            <el-menu-item v-if="userStore.userInfo?.role === 'admin'" index="admin">
              <el-icon><Setting /></el-icon>
              <span>管理后台</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="main-content">
          <el-card class="welcome-card">
            <h3>欢迎回来，{{ userStore.userInfo?.username }}！</h3>
            <div class="stats">
              <div class="stat-item">
                <div class="stat-value">{{ userStore.userInfo?.points || 0 }}</div>
                <div class="stat-label">我的积分</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStore.userInfo?.inviteCode }}</div>
                <div class="stat-label">我的邀请码</div>
              </div>
            </div>
          </el-card>

          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="8">
              <el-card class="feature-card" shadow="hover" @click="handleMenuSelect('quiz')">
                <div class="feature-icon">
                  <el-icon :size="40" color="#409eff"><Edit /></el-icon>
                </div>
                <h4>每日答题</h4>
                <p>学习红色文化知识，答题赢取卡片</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="feature-card" shadow="hover" @click="handleMenuSelect('cards')">
                <div class="feature-icon">
                  <el-icon :size="40" color="#67c23a"><Collection /></el-icon>
                </div>
                <h4>我的卡册</h4>
                <p>查看收集的卡片，集齐卡组兑换奖励</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="feature-card" shadow="hover" @click="handleMenuSelect('rewards')">
                <div class="feature-icon">
                  <el-icon :size="40" color="#f56c6c"><Gift /></el-icon>
                </div>
                <h4>奖励兑换</h4>
                <p>使用积分或卡组兑换丰富奖励</p>
              </el-card>
            </el-col>
          </el-row>

          <el-card style="margin-top: 20px">
            <template #header>
              <div class="card-header">
                <span>功能说明</span>
              </div>
            </template>
            <el-timeline>
              <el-timeline-item timestamp="每日答题" placement="top">
                <p>每天完成10道题目，得分80分以上即可获得1-3张随机卡片</p>
              </el-timeline-item>
              <el-timeline-item timestamp="每日签到" placement="top">
                <p>每天签到获得1张卡片，连续签到7天额外获得稀有卡片</p>
              </el-timeline-item>
              <el-timeline-item timestamp="邀请好友" placement="top">
                <p>邀请好友注册并完成首次答题，您将获得2张卡片奖励</p>
              </el-timeline-item>
              <el-timeline-item timestamp="红色故事" placement="top">
                <p>阅读红色故事并跳转学习强国深度学习，获得1张卡片</p>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const activeMenu = ref('quiz');

onMounted(async () => {
  if (!userStore.userInfo) {
    try {
      await userStore.fetchUserInfo();
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }
});

const handleMenuSelect = (index) => {
  activeMenu.value = index;

  const routes = {
    'quiz': '/quiz',
    'cards': '/cards',
    'checkin': '/checkin',
    'admin': '/admin/dashboard'
  };

  if (routes[index]) {
    router.push(routes[index]);
  } else {
    ElMessage.info(`${index} 功能开发中，敬请期待`);
  }
};

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      userStore.logout();
      ElMessage.success('已退出登录');
      router.push('/login');
    } catch {
      // 用户取消
    }
  } else if (command === 'profile') {
    ElMessage.info('个人中心功能开发中');
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.header-left h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #606266;
}

.user-info:hover {
  color: #409eff;
}

.sidebar {
  background-color: #fff;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

.main-content {
  background-color: #f5f5f5;
  padding: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.welcome-card h3 {
  margin: 0 0 20px 0;
  font-size: 24px;
}

.stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.feature-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  margin-bottom: 15px;
}

.feature-card h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.feature-card p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.card-header {
  font-weight: bold;
}
</style>
