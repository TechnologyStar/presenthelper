<template>
  <div class="callback-container">
    <el-card class="callback-card">
      <div class="loading-content">
        <el-icon class="is-loading" :size="50" color="#409eff">
          <Loading />
        </el-icon>
        <h3>正在处理 Linux Do 登录...</h3>
        <p>请稍候</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

onMounted(async () => {
  const code = route.query.code;

  if (!code) {
    ElMessage.error('授权失败，缺少授权码');
    router.push('/login');
    return;
  }

  try {
    await userStore.linuxdoLogin(code);
    ElMessage.success('Linux Do 登录成功');
    router.push('/home');
  } catch (error) {
    console.error('Linux Do login failed:', error);
    ElMessage.error('Linux Do 登录失败，请重试');
    router.push('/login');
  }
});
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.callback-card {
  width: 400px;
  max-width: 90%;
}

.loading-content {
  text-align: center;
  padding: 40px 20px;
}

.loading-content h3 {
  margin: 20px 0 10px 0;
  color: #303133;
}

.loading-content p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
</style>
