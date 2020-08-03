module.exports = {
  root: true,
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  plugins: [
    'react-hooks',
  ],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    mocha: true,
  },
  // rules中的值0、1、2分别表示不开启检查、警告、错误
  rules: {
    'react/jsx-no-bind': [0], // //JSX中不允许使用箭头函数和bind
    'react/prop-types': [0], // //防止在React组件定义中丢失props验证
    'react/prefer-stateless-function': [0],
    'react/jsx-one-expression-per-line': [0],
    'react/jsx-wrap-multilines': [
     // 当JSX 标签有多行时,用圆括号包起来
      'error',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'ignore',
      },
    ],
    'react/forbid-prop-types': [0],
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'arrow-body-style': [0], // 要求箭头函数体使用大括号
    'consistent-return': [0], // 要求return语句要么总是指定返回的值，要么不指定
    'comma-dangle': [
      // 是否使用尾随逗号。
      'warning',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
      // always-multiline: 需要尾随逗号时的最后一个元素或属性是一个不同的线比所述封闭]或}和不允许尾随逗号时的最后一个元素或属性是基于相同行的闭合]或}
    ],
    'function-paren-newline': [0], // 在函数括号内执行一致的换行符
    'generator-star-spacing': [0], // 强制 generator 函数中 * 号周围使用一致的空格
    'global-require': [1], // 要求 require() 出现在顶层模块作用域中
    'import/prefer-default-export': [0],
    'import/no-unresolved': [0],
    'import/no-extraneous-dependencies': [0],
    'import/extensions': [0],
    'jsx-a11y/no-static-element-interactions': [0], // 是否强制验证空元素使用属性
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/label-has-associated-control': [0], // 控件必须与文本标签相关联
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-else-return': [0], // 禁止 if 语句中有 return 之后有 else
    'no-restricted-syntax': [0], // 禁止使用特定的语法
    'no-use-before-define': [0], // 不允许在变量定义之前使用它们
    'no-nested-ternary': [0], // 不允许使用嵌套的三元表达式
    'no-bitwise': [0], // 禁用按位运算符
    'no-cond-assign': [0], // 禁止条件表达式中出现赋值操作符
    'no-restricted-globals': [0], // 禁用特定的全局变量
    'no-param-reassign': [2], // 入参无法重定义
    'object-curly-newline': [0], // 强制花括号内换行符的一致性
    'radix': [0], // parseInt默认进制不需要添加
    'require-yield': [1], // generator 需要有 yield
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
    'jsx-a11y/control-has-associated-label': [0],
    'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }],
    'prefer-promise-reject-errors': [0],
    'jsx-a11y/anchor-has-content': [0],
    'jsx-a11y/anchor-is-valid': [0],
    '@typescript-eslint/no-unused-vars': [1],
  },
}
