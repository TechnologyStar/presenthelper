<template>
  <div class="cards-page">
    <el-card class="page-header">
      <h2>我的卡册</h2>
      <p class="subtitle">收集红色主题卡片，完成卡组挑战</p>
    </el-card>

    <el-tabs v-model="activeTab" class="cards-tabs">
      <el-tab-pane label="我的卡片" name="my-cards">
        <div v-loading="loading" class="cards-container">
          <el-empty v-if="myCards.length === 0" description="还没有收集到卡片，快去答题和签到吧！" />
          <div v-else class="cards-grid">
            <el-card
              v-for="card in myCards"
              :key="card.id"
              class="card-item"
              :class="`rarity-${card.rarity}`"
              shadow="hover"
            >
              <div class="card-image">
                <img v-if="card.imageUrl" :src="card.imageUrl" :alt="card.name" />
                <div v-else class="card-placeholder">
                  <el-icon :size="60"><Picture /></el-icon>
                </div>
              </div>
              <div class="card-info">
                <h3 class="card-name">{{ card.name }}</h3>
                <el-tag :type="getRarityType(card.rarity)" size="small">
                  {{ getRarityText(card.rarity) }}
                </el-tag>
                <p class="card-description">{{ card.description }}</p>
                <div class="card-meta">
                  <span class="card-count">x{{ card.count }}</span>
                  <span class="card-set">{{ card.cardSet.name }}</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="卡组收集" name="card-sets">
        <div v-loading="loading" class="sets-container">
          <el-empty v-if="cardSets.length === 0" description="暂无卡组" />
          <div v-else class="sets-list">
            <el-card
              v-for="set in cardSets"
              :key="set.id"
              class="set-item"
              shadow="hover"
            >
              <div class="set-header">
                <div class="set-info">
                  <h3 class="set-name">{{ set.name }}</h3>
                  <el-tag :type="set.theme" size="small">{{ set.theme }}</el-tag>
                </div>
                <el-tag v-if="set.isComplete" type="success" size="large">
                  已完成
                </el-tag>
              </div>
              <p class="set-description">{{ set.description }}</p>
              <div class="set-progress">
                <el-progress
                  :percentage="set.progress"
                  :status="set.isComplete ? 'success' : undefined"
                  :stroke-width="12"
                />
                <p class="progress-text">
                  已收集 {{ set.collectedCount }} / {{ set.totalCards }} 张
                </p>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Picture } from '@element-plus/icons-vue';
import { getMyCards, getCardSets } from '@/api/card';

const activeTab = ref('my-cards');
const loading = ref(false);
const myCards = ref([]);
const cardSets = ref([]);

const loadMyCards = async () => {
  loading.value = true;
  try {
    const res = await getMyCards();
    myCards.value = res.data.cards;
  } catch (error) {
    ElMessage.error(error.message || '获取卡片失败');
  } finally {
    loading.value = false;
  }
};

const loadCardSets = async () => {
  loading.value = true;
  try {
    const res = await getCardSets();
    cardSets.value = res.data.cardSets;
  } catch (error) {
    ElMessage.error(error.message || '获取卡组失败');
  } finally {
    loading.value = false;
  }
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

const getRarityText = (rarity) => {
  const texts = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  };
  return texts[rarity] || rarity;
};

onMounted(() => {
  loadMyCards();
  loadCardSets();
});
</script>

<style scoped>
.cards-page {
  max-width: 1200px;
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

.cards-tabs {
  margin-top: 20px;
}

.cards-container,
.sets-container {
  min-height: 400px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.card-item {
  transition: transform 0.3s;
}

.card-item:hover {
  transform: translateY(-5px);
}

.card-item.rarity-common {
  border-left: 4px solid #909399;
}

.card-item.rarity-rare {
  border-left: 4px solid #67C23A;
}

.card-item.rarity-epic {
  border-left: 4px solid #E6A23C;
}

.card-item.rarity-legendary {
  border-left: 4px solid #F56C6C;
}

.card-image {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F5F7FA;
  border-radius: 4px;
  margin-bottom: 15px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-placeholder {
  color: #C0C4CC;
}

.card-info {
  text-align: center;
}

.card-name {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 18px;
}

.card-description {
  margin: 10px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #EBEEF5;
}

.card-count {
  font-weight: bold;
  color: #409EFF;
  font-size: 16px;
}

.card-set {
  color: #909399;
  font-size: 12px;
}

.sets-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.set-item {
  transition: transform 0.3s;
}

.set-item:hover {
  transform: translateX(5px);
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.set-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.set-name {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.set-description {
  margin: 0 0 20px 0;
  color: #606266;
  line-height: 1.6;
}

.set-progress {
  margin-top: 20px;
}

.progress-text {
  margin: 10px 0 0 0;
  text-align: center;
  color: #606266;
  font-size: 14px;
}
</style>
