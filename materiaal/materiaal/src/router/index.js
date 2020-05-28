import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from '../views/Search.vue'
import Details from '../views/Details.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/details/:id',
    name: 'details',
    component: Details,
    props: true,
  },
]

const router = new VueRouter({
  routes
})

router.push("search")

export default router
