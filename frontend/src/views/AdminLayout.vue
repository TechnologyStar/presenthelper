<template>
  <div class="admin-layout">
    <el-container>
      <el-aside width="200px" class="admin-aside">
        <div class="admin-logo">
          <h2>管理后台</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          class="admin-menu"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <span>数据统计</span>
          </el-menu-item>
          <el-menu-item index="/admin/questions">
            <el-icon><Document /></el-icon>
            <span>题目管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/cardsets">
            <el-icon><Collection /></el-icon>
            <span>卡组管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/stories">
            <el-icon><Reading /></el-icon>
            <span>故事管理</span>
          </el-menu-item>
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>
            <span>返回首页</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="admin-header">
          <div class="header-content">
            <h3>{{ pageTitle }}</h3>
            <div class="header-actions">
              <span class="username">{{ username }}</span>
              <el-button text @click="handleLogout">退出登录</el-button>
            </div>
          </div>
        </el-header>

        <el-main class="admin-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Document, Collection, HomeFilled, DataAnalysis, Reading } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const username = computed(() => userStore.user?.username || '管理员');

const activeMenu = computed(() => route.path);

const pageTitle = computed(() => {
  const titles = {
    '/admin/dashboard': '数据统计',
    '/admin/questions': '题目管理',
    '/admin/cardsets': '卡组管理',
    '/admin/stories': '故事管理'
  };
  return titles[route.path] || '管理后台';
});

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    userStore.logout();
    router.push('/login');
    ElMessage.success('已退出登录');
  } catch {
    // 用户取消
  }
};

onMounted(() => {
  // 检查是否有管理员权限
  if (!userStore.user || userStore.user.role !== 'admin') {
    ElMessage.error('无管理员权限');
    router.push('/home');
  }
});
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.el-container {
  height: 100%;
}

.admin-aside {
  background-color: #304156;
  color: white;
}

.admin-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1f2d3d;
}

.admin-logo h2 {
  margin: 0;
  font-size: 18px;
  color: white;
}

.admin-menu {
  border-right: none;
  background-color: #304156;
}

.admin-menu :deep(.el-menu-item) {
  color: #bfcbd9;
}

.admin-menu :deep(.el-menu-item:hover) {
  background-color: #263445;
  color: white;
}

.admin-menu :deep(.el-menu-item.is-active) {
  background-color: #409EFF;
  color: white;
}

.admin-header {
  background-color: white;
  border-bottom: 1px solid #EBEEF5;
  padding: 0 20px;
}

.header-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  color: #606266;
}

.admin-main {
  background-color: #F5F7FA;
  overflow-y: auto;
}
</style>
