<template>
  <div class="questions-page">
    <el-card>
      <div class="page-header">
        <h3>题目列表</h3>
        <el-button type="primary" @click="showCreateDialog">
          <el-icon><Plus /></el-icon>
          新增题目
        </el-button>
      </div>

      <div class="filter-bar">
        <el-input
          v-model="filters.keyword"
          placeholder="搜索题目内容"
          clearable
          style="width: 300px"
          @change="loadQuestions"
        />
        <el-select
          v-model="filters.type"
          placeholder="题目类型"
          clearable
          @change="loadQuestions"
        >
          <el-option label="单选题" value="single" />
          <el-option label="多选题" value="multiple" />
        </el-select>
        <el-select
          v-model="filters.difficulty"
          placeholder="难度"
          clearable
          @change="loadQuestions"
        >
          <el-option label="简单" value="easy" />
          <el-option label="中等" value="medium" />
          <el-option label="困难" value="hard" />
        </el-select>
      </div>

      <el-table :data="questionList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="content" label="题目内容" min-width="300" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            {{ row.type === 'single' ? '单选题' : '多选题' }}
          </template>
        </el-table-column>
        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="{ row }">
            <el-tag :type="getDifficultyType(row.difficulty)">
              {{ getDifficultyText(row.difficulty) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="200">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 5px">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="showEditDialog(row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="total > pageSize"
        class="pagination"
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑题目' : '新增题目'"
      width="700px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="题目内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="题目类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="single">单选题</el-radio>
            <el-radio label="multiple">多选题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项" prop="options">
          <div v-for="(option, index) in form.options" :key="index" class="option-item">
            <el-input v-model="form.options[index]" placeholder="输入选项内容">
              <template #prepend>{{ String.fromCharCode(65 + index) }}</template>
              <template #append>
                <el-button @click="removeOption(index)" :disabled="form.options.length <= 2">
                  删除
                </el-button>
              </template>
            </el-input>
          </div>
          <el-button @click="addOption" style="margin-top: 10px">添加选项</el-button>
        </el-form-item>
        <el-form-item label="正确答案" prop="correctAnswer">
          <el-input v-model="form.correctAnswer" placeholder="如：A 或 ABC" />
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="form.tags" multiple placeholder="选择或输入标签" allow-create filterable>
            <el-option label="党史" value="党史" />
            <el-option label="国史" value="国史" />
            <el-option label="军史" value="军史" />
            <el-option label="改革开放" value="改革开放" />
            <el-option label="新时代" value="新时代" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '@/api/admin';

const loading = ref(false);
const questionList = ref([]);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);

const filters = reactive({
  keyword: '',
  type: '',
  difficulty: ''
});

const dialogVisible = ref(false);
const isEdit = ref(false);
const submitting = ref(false);
const formRef = ref(null);

const form = reactive({
  id: null,
  content: '',
  type: 'single',
  options: ['', '', '', ''],
  correctAnswer: '',
  difficulty: 'medium',
  tags: []
});

const rules = {
  content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
  type: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
  correctAnswer: [{ required: true, message: '请输入正确答案', trigger: 'blur' }],
  difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }]
};

const loadQuestions = async () => {
  loading.value = true;
  try {
    const res = await getQuestions({
      page: page.value,
      limit: pageSize.value,
      ...filters
    });
    questionList.value = res.data.data;
    total.value = res.data.total;
  } catch (error) {
    ElMessage.error(error.message || '获取题目列表失败');
  } finally {
    loading.value = false;
  }
};

const showCreateDialog = () => {
  isEdit.value = false;
  resetForm();
  dialogVisible.value = true;
};

const showEditDialog = (row) => {
  isEdit.value = true;
  Object.assign(form, {
    id: row.id,
    content: row.content,
    type: row.type,
    options: [...row.options],
    correctAnswer: row.correctAnswer,
    difficulty: row.difficulty,
    tags: [...row.tags]
  });
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    submitting.value = true;

    const data = {
      content: form.content,
      type: form.type,
      options: form.options.filter(o => o.trim()),
      correctAnswer: form.correctAnswer,
      difficulty: form.difficulty,
      tags: form.tags
    };

    if (isEdit.value) {
      await updateQuestion(form.id, data);
      ElMessage.success('更新成功');
    } else {
      await createQuestion(data);
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    loadQuestions();
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message);
    }
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这道题目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await deleteQuestion(id);
    ElMessage.success('删除成功');
    loadQuestions();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

const handlePageChange = (newPage) => {
  page.value = newPage;
  loadQuestions();
};

const addOption = () => {
  form.options.push('');
};

const removeOption = (index) => {
  form.options.splice(index, 1);
};

const resetForm = () => {
  Object.assign(form, {
    id: null,
    content: '',
    type: 'single',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'medium',
    tags: []
  });
  formRef.value?.clearValidate();
};

const getDifficultyType = (difficulty) => {
  const types = { easy: 'success', medium: 'warning', hard: 'danger' };
  return types[difficulty] || 'info';
};

const getDifficultyText = (difficulty) => {
  const texts = { easy: '简单', medium: '中等', hard: '困难' };
  return texts[difficulty] || difficulty;
};

onMounted(() => {
  loadQuestions();
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

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.option-item {
  margin-bottom: 10px;
}
</style>
