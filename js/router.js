/* ============================================================
   Vue Router 路由配置
   - hash 模式（createWebHashHistory）：无需服务器配置，
     直接部署到 GitHub Pages / 任意静态托管即可工作
   - 首页（/）内含 Bio/动态/论文 三个锚点区块，
     由导航按钮平滑滚动定位（见 main.js 的 goSection）
   - 项目/经历/荣誉/技能/联系 为独立路由页面
   - 切换独立页面时自动回到顶部，并更新浏览器标题
   ============================================================ */

const routes = [
  { path: "/", component: HomePage, meta: { title: "首页" } },
  { path: "/projects", component: ProjectsPage, meta: { title: "研究项目" } },
  { path: "/experience", component: ExperiencePage, meta: { title: "教育与工作经历" } },
  { path: "/awards", component: AwardsPage, meta: { title: "获奖与荣誉" } },
  { path: "/skills", component: SkillsPage, meta: { title: "技能" } },
  { path: "/contact", component: ContactPage, meta: { title: "联系方式" } },
  /* 未匹配的路径重定向回首页 */
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes,
  scrollBehavior: function () {
    /* 独立页面切换：回到顶部（首页内锚点滚动由 goSection 处理） */
    return { top: 0 };
  },
});

const SITE_NAME = "张冰";

router.afterEach(function (to) {
  document.title = to.meta.title
    ? to.meta.title + " · " + SITE_NAME + " · 学术主页"
    : SITE_NAME + " · 学术主页";
});
