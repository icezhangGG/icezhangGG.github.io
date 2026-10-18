/* ============================================================
   页面组件定义（免构建版：模板在 index.html 的 text/x-template 中）
   - HomePage：首页（Bio + 动态 + 论文，单页滚动锚点）
   - 其余为独立路由页面
   ============================================================ */

/* ---------- 滚动出现动画 + 技能条（路由切换后对当前页面生效） ---------- */
function initReveal(scope) {
  const root = scope || document;

  // 技能条：先记录目标宽度，再归零（配合 CSS transition 展开）
  root.querySelectorAll(".bar i").forEach(function (bar) {
    if (!bar.dataset.target) {
      bar.dataset.target = bar.style.width || "0%";
      bar.style.width = "0%";
    }
  });

  const els = root.querySelectorAll(".reveal:not(.visible)");
  if (!els.length) return;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          entry.target.querySelectorAll(".bar i").forEach(function (bar) {
            bar.style.width = bar.dataset.target;
          });
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("visible"); });
    root.querySelectorAll(".bar i").forEach(function (bar) {
      bar.style.width = bar.dataset.target;
    });
  }
}

/* 所有页面共用的 mounted：挂载后初始化本页的滚动动画 */
const RevealMixin = {
  mounted: function () {
    const self = this;
    this.$nextTick(function () { initReveal(self.$el); });
  },
};

/* ---------- 首页（Bio + 动态 + 论文 + 项目） ---------- */
const HomePage = {
  template: "#tpl-home",
  mixins: [RevealMixin],
  data: function () {
    return {
      avatarOk: true,
      /* 论文分类筛选 */
      filter: "all",
      filters: [
        { value: "all", label: "全部" },
        { value: "conference", label: "会议" },
        { value: "journal", label: "期刊" },
        { value: "preprint", label: "预印本" },
      ],
      /* 论文列表：复制一个对象即可添加新论文
         type 取值：conference / journal / preprint
         authors 支持 HTML（如 <strong> 加粗自己的名字） */
      pubs: [
        {
          type: "journal",
          badge: "期刊",
          title: "Rumor Detection Based on Attention Graph Adversarial Dual Contrast Learning",
          authors: "<strong>Zhang Bing（张冰）</strong>, Liu T, Ke Z, et al.",
          venue: "PLOS ONE, 2024, 19(4): e0290291",
          note: "（SCI 二区 · 第一作者）",
          links: [
            { label: "论文页面", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0290291" },
            { label: "DOI", url: "https://doi.org/10.1371/journal.pone.0290291" },
          ],
          abs: "提出注意力图对抗双对比学习谣言检测方法：BERT 增强文本语义表征，Attention-GRU 降噪优化，GAT 建模传播结构，结合对抗训练与双对比学习（Double_CL）提升模型鲁棒性，达到 SOTA 性能。",
        },
        {
          type: "preprint",
          badge: "工作论文",
          title: "Rumor Detection Based on Dynamic Knowledge Distillation",
          authors: "<strong>Zhang Bing（张冰）</strong>, et al.",
          venue: "已完成撰写（纳入硕士毕业论文），未投稿",
          note: "",
          links: [],
          abs: "在多教师知识蒸馏框架中引入动态选择模块，逐 batch 选取当前最优教师模型传递知识，在 Twitter16 数据集上取得 94.6% 的准确率，完成对比实验与消融实验。",
        },
      ],
    };
  },
  computed: {
    filteredPubs: function () {
      if (this.filter === "all") return this.pubs;
      return this.pubs.filter((p) => p.type === this.filter);
    },
  },
};

/* ---------- Projects 研究项目（独立路由页） ---------- */
const ProjectsPage = {
  template: "#tpl-projects",
  mixins: [RevealMixin],
};

/* ---------- Experience 教育与工作经历 ---------- */
const ExperiencePage = {
  template: "#tpl-experience",
  mixins: [RevealMixin],
};

/* ---------- Awards 获奖与荣誉 ---------- */
const AwardsPage = {
  template: "#tpl-awards",
  mixins: [RevealMixin],
};

/* ---------- Skills 技能 ---------- */
const SkillsPage = {
  template: "#tpl-skills",
  mixins: [RevealMixin],
};

/* ---------- Contact 联系方式 ---------- */
const ContactPage = {
  template: "#tpl-contact",
  mixins: [RevealMixin],
};
