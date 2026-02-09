<template>
  <div class="quiz-page">
    <el-card class="quiz-header">
      <h2>每日答题</h2>
      <p class="subtitle">答对8题及以上可获得卡片奖励</p>
    </el-card>

    <el-card v-if="!quizStarted" class="quiz-intro">
      <div class="intro-content">
        <el-icon :size="60" color="#409EFF"><Document /></el-icon>
        <h3>今日答题任务</h3>
        <p>共10道题，每题10分，答对8题及以上即可获得卡片奖励</p>
        <el-button type="primary" size="large" @click="startQuiz" :loading="loading">
          开始答题
        </el-button>
      </div>
    </el-card>

    <div v-else-if="!quizCompleted" class="quiz-content">
      <el-card class="progress-card">
        <el-progress
          :percentage="Math.round((currentQuestionIndex / questions.length) * 100)"
          :stroke-width="10"
        />
        <p class="progress-text">第 {{ currentQuestionIndex + 1 }} / {{ questions.length }} 题</p>
      </el-card>

      <el-card class="question-card" v-if="currentQuestion">
        <div class="question-header">
          <el-tag :type="getDifficultyType(currentQuestion.difficulty)">
            {{ getDifficultyText(currentQuestion.difficulty) }}
          </el-tag>
          <el-tag v-for="tag in currentQuestion.tags" :key="tag" type="info">
            {{ tag }}
          </el-tag>
        </div>

        <h3 class="question-content">{{ currentQuestion.content }}</h3>

        <el-radio-group
          v-if="currentQuestion.type === 'single'"
          v-model="currentAnswer"
          class="answer-options"
          :disabled="answerSubmitted"
        >
          <el-radio
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            :label="String.fromCharCode(65 + index)"
            class="answer-option"
          >
            {{ String.fromCharCode(65 + index) }}. {{ option }}
          </el-radio>
        </el-radio-group>

        <el-checkbox-group
          v-else-if="currentQuestion.type === 'multiple'"
          v-model="currentAnswer"
          class="answer-options"
          :disabled="answerSubmitted"
        >
          <el-checkbox
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            :label="String.fromCharCode(65 + index)"
            class="answer-option"
          >
            {{ String.fromCharCode(65 + index) }}. {{ option }}
          </el-checkbox>
        </el-checkbox-group>

        <div v-if="answerSubmitted" class="answer-result">
          <el-alert
            :type="answerCorrect ? 'success' : 'error'"
            :title="answerCorrect ? '回答正确！' : '回答错误'"
            :closable="false"
          >
            <template v-if="!answerCorrect">
              正确答案：{{ correctAnswer }}
            </template>
          </el-alert>
        </div>

        <div class="question-actions">
          <el-button
            v-if="!answerSubmitted"
            type="primary"
            @click="submitCurrentAnswer"
            :disabled="!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)"
            :loading="submitting"
          >
            提交答案
          </el-button>
          <el-button
            v-else
            type="primary"
            @click="nextQuestion"
          >
            {{ currentQuestionIndex < questions.length - 1 ? '下一题' : '完成答题' }}
          </el-button>
        </div>
      </el-card>
    </div>

    <el-card v-else class="quiz-result">
      <div class="result-content">
        <el-icon :size="80" :color="result.isPassed ? '#67C23A' : '#F56C6C'">
          <component :is="result.isPassed ? 'CircleCheck' : 'CircleClose'" />
        </el-icon>
        <h2>{{ result.isPassed ? '恭喜通过！' : '继续加油！' }}</h2>
        <div class="score-display">
          <span class="score">{{ result.score }}</span>
          <span class="score-label">分</span>
        </div>
        <p class="result-detail">答对 {{ result.correctCount }} / {{ result.totalCount }} 题</p>

        <div v-if="result.isPassed && result.rewardCards.length > 0" class="reward-section">
          <h3>获得卡片奖励</h3>
          <div class="reward-cards">
            <div v-for="card in result.rewardCards" :key="card.id" class="reward-card">
              <el-tag :type="getRarityType(card.rarity)" size="large">
                {{ card.name }}
              </el-tag>
            </div>
          </div>
          <p class="points-earned">+ {{ result.pointsEarned }} 积分</p>
        </div>

        <el-button type="primary" size="large" @click="goToHome">
          返回首页
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Document, CircleCheck, CircleClose } from '@element-plus/icons-vue';
import { getDailyQuiz, submitAnswer, completeQuiz } from '@/api/quiz';

const router = useRouter();

const loading = ref(false);
const quizStarted = ref(false);
const quizCompleted = ref(false);
const sessionId = ref(null);
const questions = ref([]);
const currentQuestionIndex = ref(0);
const currentAnswer = ref(null);
const answerSubmitted = ref(false);
const answerCorrect = ref(false);
const correctAnswer = ref('');
const submitting = ref(false);
const result = ref(null);

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value];
});

const startQuiz = async () => {
  loading.value = true;
  try {
    const res = await getDailyQuiz();
    sessionId.value = res.data.session.id;
    questions.value = res.data.questions;

    if (res.data.session.completedAt) {
      ElMessage.info('今日已完成答题');
      router.push('/home');
      return;
    }

    quizStarted.value = true;
  } catch (error) {
    ElMessage.error(error.message || '获取答题任务失败');
  } finally {
    loading.value = false;
  }
};

const submitCurrentAnswer = async () => {
  submitting.value = true;
  try {
    const answer = Array.isArray(currentAnswer.value)
      ? currentAnswer.value.sort().join('')
      : currentAnswer.value;

    const res = await submitAnswer({
      sessionId: sessionId.value,
      questionId: currentQuestion.value.id,
      answer
    });

    answerSubmitted.value = true;
    answerCorrect.value = res.data.isCorrect;
    correctAnswer.value = res.data.correctAnswer;
  } catch (error) {
    ElMessage.error(error.message || '提交答案失败');
  } finally {
    submitting.value = false;
  }
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    currentAnswer.value = null;
    answerSubmitted.value = false;
    answerCorrect.value = false;
    correctAnswer.value = '';
  } else {
    finishQuiz();
  }
};

const finishQuiz = async () => {
  try {
    const res = await completeQuiz({
      sessionId: sessionId.value
    });

    result.value = res.data;
    quizCompleted.value = true;
  } catch (error) {
    ElMessage.error(error.message || '完成答题失败');
  }
};

const goToHome = () => {
  router.push('/home');
};

const getDifficultyType = (difficulty) => {
  const types = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  };
  return types[difficulty] || 'info';
};

const getDifficultyText = (difficulty) => {
  const texts = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };
  return texts[difficulty] || difficulty;
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

onMounted(() => {
  // 页面加载时不自动开始，等待用户点击
});
</script>

<style scoped>
.quiz-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.quiz-header {
  text-align: center;
  margin-bottom: 20px;
}

.quiz-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
}

.subtitle {
  margin: 0;
  color: #909399;
}

.quiz-intro {
  margin-top: 40px;
}

.intro-content {
  text-align: center;
  padding: 40px 20px;
}

.intro-content h3 {
  margin: 20px 0 10px 0;
  color: #303133;
}

.intro-content p {
  margin: 0 0 30px 0;
  color: #606266;
}

.progress-card {
  margin-bottom: 20px;
}

.progress-text {
  text-align: center;
  margin: 10px 0 0 0;
  color: #606266;
  font-weight: bold;
}

.question-card {
  margin-bottom: 20px;
}

.question-header {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.question-content {
  margin: 0 0 30px 0;
  color: #303133;
  font-size: 18px;
  line-height: 1.6;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.answer-option {
  padding: 15px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  transition: all 0.3s;
}

.answer-option:hover {
  border-color: #409EFF;
  background-color: #F5F7FA;
}

.answer-result {
  margin-bottom: 20px;
}

.question-actions {
  display: flex;
  justify-content: center;
}

.quiz-result {
  margin-top: 40px;
}

.result-content {
  text-align: center;
  padding: 40px 20px;
}

.result-content h2 {
  margin: 20px 0;
  color: #303133;
}

.score-display {
  margin: 30px 0;
}

.score {
  font-size: 72px;
  font-weight: bold;
  color: #409EFF;
}

.score-label {
  font-size: 24px;
  color: #606266;
  margin-left: 10px;
}

.result-detail {
  margin: 0 0 30px 0;
  color: #606266;
  font-size: 16px;
}

.reward-section {
  margin: 30px 0;
  padding: 20px;
  background-color: #F5F7FA;
  border-radius: 4px;
}

.reward-section h3 {
  margin: 0 0 20px 0;
  color: #303133;
}

.reward-cards {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.points-earned {
  margin: 0;
  color: #67C23A;
  font-size: 18px;
  font-weight: bold;
}
</style>
