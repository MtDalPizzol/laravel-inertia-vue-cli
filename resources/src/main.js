import Vue from 'vue'
import { App, plugin } from '@inertiajs/inertia-vue'

Vue.config.productionTip = false

Vue.use(plugin)

const el = document.getElementById('app')

new Vue({
  render: h => h(App, {
    props: {
      initialPage: JSON.parse(el.dataset.page),
      resolveComponent: name => import('@/pages/' + name + '.vue').then(module => module.default)
    }
  })
}).$mount(el)
