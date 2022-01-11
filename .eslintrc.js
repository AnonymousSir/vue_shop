module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // 在这里面修改规则，
    // 需要修改的在eslint报错的每一行后面的灰色就是名字
    // 'xxxx': 0就可以禁用
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-unused-vars": 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}