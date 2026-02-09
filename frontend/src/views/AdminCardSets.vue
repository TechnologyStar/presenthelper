<template>
  <div class="cardsets-page">
    <el-card>
      <div class="page-header">
        <h3>卡组列表</h3>
        <el-button type="primary" @click="showCreateDialog">
          <el-icon><Plus /></el-icon>
          新增卡组
        </el-button>
      </div>

      <div v-loading="loading" class="cardsets-list">
        <el-empty v-if="cardSets.length === 0" description="暂无卡组" />
        <el-collapse v-else v-model="activeNames">
          <el-collapse-item
            v-for="set in cardSets"
            :key="set.id"
            :name="set.id"
          >
            <template #title>
              <div class="set-title">
                <h4>{{ set.name }}</h4>
                <el-tag :type="set.theme" size="small">{{ set.theme }}</el-tag>
                <span class="card-count">{{ set.totalCards }} 张卡片</span>
              </div>
            </template>

            <div class="set-content">
              <p class="set-description">{{ set.description }}</p>

              <div class="cards-grid">
                <el-card
                  v-for="card in set.cards"
                  :key="card.id"
                  class="card-item"
                  shadow="hover"
                >
                  <div class="card-image">
                    <img v-if="card.imageUrl" :src="card.imageUrl" :alt="card.name" />
                    <div v-else class="card-placeholder">
                      <el-icon :size="40"><Picture /></el-icon>
                    </div>
                  </div>
                  <div class="card-info">
                    <h5>{{ card.name }}</h5>
                    <el-tag :type="getRarityType(card.rarity)" size="small">
                      {{ getRarityText(card.rarity) }}
                    </el-tag>
                    <p class="card-desc">{{ card.description }}</p>
                    <el-button text type="primary" @click="showEditCardDialog(card)">
                      编辑
                    </el-button>
                  </div>
                </el-card>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="新增卡组"
      width="700px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="卡组名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="卡组描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="主题" prop="theme">
          <el-select v-model="form.theme">
            <el-option label="党史" value="党史" />
            <el-option label="国史" value="国史" />
            <el-option label="军史" value="军史" />
            <el-option label="改革开放" value="改革开放" />
            <el-option label="新时代" value="新时代" />
          </el-select>
        </el-form-item>
        <el-form-item label="卡片列表">
          <div v-for="(card, index) in form.cards" :key="index" class="card-form-item">
            <el-card>
              <div class="card-form-header">
                <span>卡片 {{ index + 1 }}</span>
                <el-button text type="danger" @click="removeCard(index)">删除</el-button>
              </div>
              <el-form-item label="卡片名称">
                <el-input v-model="card.name" />
              </el-form-item>
              <el-form-item label="卡片描述">
                <el-input v-model="card.description" type="textarea" :rows="2" />
              </el-form-item>
              <el-form-item label="图片URL">
                <el-input v-model="card.imageUrl" placeholder="可选" />
              </el-form-item>
              <el-form-item label="稀有度">
                <el-select v-model="card.rarity">
                  <el-option label="普通" value="common" />
                  <el-option label="稀有" value="rare" />
                  <el-option label="史诗" value="epic" />
                  <el-option label="传说" value="legendary" />
                </el-select>
              </el-form-item>
            </el-card>
          </div>
          <el-button @click="addCard" style="margin-top: 10px">添加卡片</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="cardDialogVisible"
      title="编辑卡片"
      width="500px"
    >
      <el-form :model="cardForm" ref="cardFormRef" label-width="100px">
        <el-form-item label="卡片名称">
          <el-input v-model="cardForm.name" />
        </el-form-item>
        <el-form-item label="卡片描述">
          <el-input v-model="cardForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="cardForm.imageUrl" />
        </el-form-item>
        <el-form-item label="稀有度">
          <el-select v-model="cardForm.rarity">
            <el-option label="普通" value="common" />
            <el-option label="稀有" value="rare" />
            <el-option label="史诗" value="epic" />
            <el-option label="传说" value="legendary" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cardDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateCard" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Picture } from '@element-plus/icons-vue';
import { getCardSetsAdmin, createCardSet, updateCard } from '@/api/admin';

const loading = ref(false);
const cardSets = ref([]);
const activeNames = ref([]);

const dialogVisible = ref(false);
const submitting = ref(false);
const formRef = ref(null);

const form = reactive({
  name: '',
  description: '',
  theme: '党史',
  cards: []
});

const rules = {
  name: [{ required: true, message: '请输入卡组名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入卡组描述', trigger: 'blur' }],
  theme: [{ required: true, message: '请选择主题', trigger: 'change' }]
};

const cardDialogVisible = ref(false);
const cardFormRef = ref(null);
const cardForm = reactive({
  id: null,
  name: '',
  description: '',
  imageUrl: '',
  rarity: 'common'
});

const loadCardSets = async () => {
  loading.value = true;
  try {
    const res = await getCardSetsAdmin();
    cardSets.value = res.data.cardSets;
  } catch (error) {
    ElMessage.error(error.message || '获取卡组列表失败');
  } finally {
    loading.value = false;
  }
};

const showCreateDialog = () => {
  resetForm();
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    if (form.cards.length === 0) {
      ElMessage.warning('请至少添加一张卡片');
      return;
    }

    submitting.value = true;
    await createCardSet(form);
    ElMessage.success('创建成功');
    dialogVisible.value = false;
    loadCardSets();
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message);
    }
  } finally {
    submitting.value = false;
  }
};

const showEditCardDialog = (card) => {
  Object.assign(cardForm, {
    id: card.id,
    name: card.name,
    description: card.description,
    imageUrl: card.imageUrl,
    rarity: card.rarity
  });
  cardDialogVisible.value = true;
};

const handleUpdateCard = async () => {
  submitting.value = true;
  try {
    await updateCard(cardForm.id, {
      name: cardForm.name,
      description: cardForm.description,
      imageUrl: cardForm.imageUrl,
      rarity: cardForm.rarity
    });
    ElMessage.success('更新成功');
    cardDialogVisible.value = false;
    loadCardSets();
  } catch (error) {
    ElMessage.error(error.message || '更新失败');
  } finally {
    submitting.value = false;
  }
};

const addCard = () => {
  form.cards.push({
    name: '',
    description: '',
    imageUrl: '',
    rarity: 'common'
  });
};

const removeCard = (index) => {
  form.cards.splice(index, 1);
};

const resetForm = () => {
  Object.assign(form, {
    name: '',
    description: '',
    theme: '党史',
    cards: []
  });
  formRef.value?.clearValidate();
};

const getRarityType = (rarity) => {
  const types = { common: 'info', rare: 'success', epic: 'warning', legendary: 'danger' };
  return types[rarity] || 'info';
};

const getRarityText = (rarity) => {
  const texts = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' };
  return texts[rarity] || rarity;
};

onMounted(() => {
  loadCardSets();
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h3 {
  margin: 0;
}

.cardsets-list {
  min-height: 400px;
}

.set-title {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.set-title h4 {
  margin: 0;
}

.card-count {
  color: #909399;
  font-size: 14px;
}

.set-content {
  padding: 20px 0;
}

.set-description {
  margin: 0 0 20px 0;
  color: #606266;
  line-height: 1.6;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.card-item {
  transition: transform 0.3s;
}

.card-item:hover {
  transform: translateY(-3px);
}

.card-image {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F5F7FA;
  border-radius: 4px;
  margin-bottom: 10px;
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

.card-info h5 {
  margin: 0 0 8px 0;
  color: #303133;
}

.card-desc {
  margin: 8px 0;
  color: #909399;
  font-size: 12px;
  line-height: 1.4;
}

.card-form-item {
  margin-bottom: 15px;
}

.card-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: bold;
}
</style>
