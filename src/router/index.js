import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/thread/post",
    name: "PostEdit",
    component: PostEdit,
    props: true,
    meta: { title: 'Editing Post' }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
