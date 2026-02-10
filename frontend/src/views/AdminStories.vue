<template>
  <div class="admin-stories">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>红色故事管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加故事
          </el-button>
        </div>
      </template>

      <el-table :data="stories" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="reward_points" label="奖励积分" width="100" />
        <el-table-column prop="read_count" label="阅读次数" width="100" />
        <el-table-column label="学习强国链接" width="120">
          <template #default="{ row }">
            <el-tag :type="row.xuexi_link ? 'success' : 'info'">
              {{ row.xuexi_link ? '已设置' : '未设置' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入故事标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="革命历史" value="革命历史" />
            <el-option label="英雄人物" value="英雄人物" />
            <el-option label="爱国精神" value="爱国精神" />
            <el-option label="时代楷模" value="时代楷模" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入故事摘要"
          />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="10"
            placeholder="请输入故事内容"
          />
        </el-form-item>
        <el-form-item label="学习强国链接">
          <el-input v-model="form.xuexi_link" placeholder="请输入学习强国链接（选填）" />
        </el-form-item>
        <el-form-item label="奖励积分" prop="reward_points">
          <el-input-number v-model="form.reward_points" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

const loading = ref(false);
const submitting = ref(false);
const stories = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('添加故事');
const formRef = ref(null);

const form = ref({
  id: null,
  title: '',
  category: '',
  summary: '',
  content: '',
  xuexi_link: '',
  reward_points: 10
});

const rules = {
  title: [{ required: true, message: '请输入故事标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  summary: [{ required: true, message: '请输入故事摘要', trigger: 'blur' }],
  content: [{ required: true, message: '请输入故事内容', trigger: 'blur' }],
  reward_points: [{ required: true, message: '请输入奖励积分', trigger: 'blur' }]
};

const loadStories = async () => {
  loading.value = true;
  try {
    // TODO: 调用实际的 API
    // const res = await getAdminStories();
    // stories.value = res.data;

    // 模拟数据
    stories.value = [
      {
        id: 1,
        title: '长征精神',
        category: '革命历史',
        summary: '红军长征的伟大历程',
        reward_points: 10,
        read_count: 150,
        xuexi_link: 'https://www.xuexi.cn/example',
        created_at: new Date()
      }
    ];
  } catch (error) {
    ElMessage.error('获取故事列表失败');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加故事';
  form.value = {
    id: null,
    title: '',
    category: '',
    summary: '',
    content: '',
    xuexi_link: '',
    reward_points: 10
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑故事';
  form.value = { ...row };
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    submitting.value = true;
    try {
      // TODO: 调用实际的 API
      // if (form.value.id) {
      //   await updateStory(form.value.id, form.value);
      // } else {
      //   await createStory(form.value);
      // }

      ElMessage.success(form.value.id ? '更新成功' : '添加成功');
      dialogVisible.value = false;
      await loadStories();
    } catch (error) {
      ElMessage.error(error.message || '操作失败');
    } finally {
      submitting.value = false;
    }
  });
};

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除故事"${row.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    // TODO: 调用实际的 API
    // await deleteStory(row.id);

    ElMessage.success('删除成功');
    await loadStories();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-CN');
};

onMounted(() => {
  loadStories();
});
</script>

<style scoped>
.admin-stories {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
