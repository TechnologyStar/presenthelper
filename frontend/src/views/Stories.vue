<template>
  <div class="stories-page">
    <el-card class="header-card">
      <h2>红色故事</h2>
      <p class="subtitle">学习红色历史，传承革命精神</p>
    </el-card>

    <el-row :gutter="20" v-loading="loading">
      <el-col :span="8" v-for="story in stories" :key="story.id">
        <el-card class="story-card" shadow="hover" @click="viewStory(story)">
          <div class="story-cover">
            <el-icon :size="80" color="#F56C6C"><Reading /></el-icon>
          </div>
          <h3>{{ story.title }}</h3>
          <p class="story-summary">{{ story.summary }}</p>
          <div class="story-meta">
            <el-tag size="small">{{ story.category }}</el-tag>
            <el-tag size="small" type="success" v-if="story.is_read">
              <el-icon><Check /></el-icon>
              已阅读
            </el-tag>
          </div>
          <div class="story-reward">
            <el-icon color="#E6A23C"><Coin /></el-icon>
            <span>阅读奖励: {{ story.reward_points }} 积分</span>
          </div>
        </el-card>
      </el-col>
      <el-empty v-if="!loading && stories.length === 0" description="暂无红色故事" />
    </el-row>

    <el-dialog
      v-model="dialogVisible"
      :title="currentStory?.title"
      width="800px"
      @close="handleDialogClose"
    >
      <div class="story-detail" v-if="currentStory">
        <div class="story-info">
          <el-tag>{{ currentStory.category }}</el-tag>
          <span class="story-date">{{ formatDate(currentStory.created_at) }}</span>
        </div>

        <div class="story-content">
          {{ currentStory.content }}
        </div>

        <el-divider />

        <div class="story-actions">
          <el-button
            type="primary"
            :icon="Reading"
            @click="goToXuexi"
            v-if="currentStory.xuexi_link"
          >
            前往学习强国深度学习
          </el-button>

          <el-button
            type="success"
            :icon="Check"
            @click="markAsRead"
            :disabled="currentStory.is_read"
            :loading="marking"
          >
            {{ currentStory.is_read ? '已阅读' : '标记为已读' }}
          </el-button>
        </div>

        <div class="story-reward-info" v-if="!currentStory.is_read">
          <el-alert
            title="阅读奖励"
            :description="`标记为已读后可获得 ${currentStory.reward_points} 积分奖励`"
            type="success"
            :closable="false"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Reading, Check, Coin } from '@element-plus/icons-vue';
import { getStories, getStoryDetail, markStoryRead } from '@/api/story';

const loading = ref(false);
const marking = ref(false);
const stories = ref([]);
const dialogVisible = ref(false);
const currentStory = ref(null);

const loadStories = async () => {
  loading.value = true;
  try {
    const res = await getStories();
    stories.value = res.data;
  } catch (error) {
    ElMessage.error(error.message || '获取故事列表失败');
  } finally {
    loading.value = false;
  }
};

const viewStory = async (story) => {
  try {
    const res = await getStoryDetail(story.id);
    currentStory.value = res.data;
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error(error.message || '获取故事详情失败');
  }
};

const markAsRead = async () => {
  if (!currentStory.value || currentStory.value.is_read) return;

  marking.value = true;
  try {
    await markStoryRead(currentStory.value.id);
    ElMessage.success(`阅读完成！获得 ${currentStory.value.reward_points} 积分`);
    currentStory.value.is_read = true;

    const index = stories.value.findIndex(s => s.id === currentStory.value.id);
    if (index !== -1) {
      stories.value[index].is_read = true;
    }
  } catch (error) {
    ElMessage.error(error.message || '标记失败');
  } finally {
    marking.value = false;
  }
};

const goToXuexi = () => {
  if (currentStory.value?.xuexi_link) {
    window.open(currentStory.value.xuexi_link, '_blank');
  }
};

const handleDialogClose = () => {
  currentStory.value = null;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

onMounted(() => {
  loadStories();
});
</script>

<style scoped>
.stories-page {
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

.story-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.story-card:hover {
  transform: translateY(-5px);
}

.story-cover {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
  border-radius: 8px;
  margin-bottom: 15px;
}

.story-card h3 {
  margin: 10px 0;
  color: #303133;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.story-summary {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin: 10px 0;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.story-meta {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.story-reward {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #E6A23C;
  font-size: 14px;
  margin-top: 10px;
}

.story-detail {
  padding: 10px;
}

.story-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.story-date {
  color: #909399;
  font-size: 14px;
}

.story-content {
  line-height: 2;
  color: #303133;
  font-size: 16px;
  text-align: justify;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.story-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

.story-reward-info {
  margin-top: 20px;
}
</style>
