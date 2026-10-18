/* ============================================================
   学术个人主页 · Vue 应用入口 + 全局交互
   1. 深色模式切换（记忆用户选择 / 跟随系统）
   2. 导航栏滚动样式
   3. 移动端菜单（路由跳转后自动收起）
   4. 首页锚点导航（Bio/动态/论文 平滑滚动 + 高亮）
   5. 返回顶部
   6. 页脚年份与更新日期
   ============================================================ */

(function () {
  "use strict";

  /* 首页内的锚点区块（与 index.html 中 section 的 id 对应） */
  const HOME_SECTIONS = ["bio", "news", "papers"];

  /* ---------- 根组件（模板为 index.html 中 #app 的内容） ---------- */
  const App = {
    data: function () {
      return {
        menuOpen: false,
        scrolled: false,
        activeSection: "bio",
        year: "",
        lastUpdate: "",
      };
    },
    computed: {
      onHome: function () {
        return this.$route.path === "/";
      },
    },
    watch: {
      /* 进入独立页面后再回到首页时，高亮复位到 Bio */
      "$route.path": function () {
        this.activeSection = "bio";
      },
    },
    methods: {
      /* 深色模式 */
      toggleTheme: function () {
        const next =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        applyTheme(next);
      },
      closeMenu: function () {
        this.menuOpen = false;
      },

      /* ---------- 首页锚点导航 ---------- */
      goSection: function (id) {
        this.closeMenu();
        if (this.$route.path !== "/") {
          // 从独立页面返回首页：先切换路由，等首页渲染后再滚动
          const self = this;
          this.$router.push("/").then(function () {
            setTimeout(function () { self.scrollToSection(id); }, 60);
          });
        } else {
          this.scrollToSection(id);
        }
      },
      scrollToSection: function (id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      },

      /* ---------- 滚动状态 ---------- */
      onScroll: function () {
        this.scrolled = window.scrollY > 8;
        backTop.classList.toggle("show", window.scrollY > 480);

        // scroll-spy：仅在首页时更新锚点区块高亮
        if (this.onHome) {
          const pos = window.scrollY + 140;
          let current = "bio";
          HOME_SECTIONS.forEach(function (id) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= pos) current = id;
          });
          this.activeSection = current;
        }
      },
    },
    mounted: function () {
      const now = new Date();
      this.year = now.getFullYear();
      this.lastUpdate = now.getFullYear() + " 年 " + (now.getMonth() + 1) + " 月";
      window.addEventListener("scroll", this.onScroll, { passive: true });
      this.onScroll();
    },
    beforeUnmount: function () {
      window.removeEventListener("scroll", this.onScroll);
    },
  };

  /* ---------- 深色模式工具 ---------- */
  function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  // 先应用主题，避免挂载时闪烁
  applyTheme(getPreferredTheme());

  /* ---------- 返回顶部（在 #app 外部，纯原生） ---------- */
  const backTop = document.getElementById("backTop");
  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 创建并挂载应用 ---------- */
  const app = Vue.createApp(App);
  app.use(router);
  app.mount("#app");
})();
