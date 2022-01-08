import Vue from 'vue'
import { Button, Input, Form, FormItem, Message } from 'element-ui'
const elements = [Button, Input, Form, FormItem]

Vue.prototype.$message = Message

elements.forEach((element) => {
  Vue.use(element)
})
