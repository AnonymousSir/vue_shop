import Vue from 'vue'
import {
  Message,
  MessageBox,
  Button,
  Input,
  Form,
  FormItem,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui'

const elements = [
  Button,
  Input,
  Form,
  FormItem,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  Tree,
  Select,
  Option
]

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

elements.forEach((element) => {
  Vue.use(element)
})
