import { boot } from "quasar/wrappers";
import { createRouter, createWebHistory } from "vue-router";
import routes from "src/router/routes.js";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default boot(({ app }) => {
  app.use(router);
});

export { router };
