import { resolve } from 'path';

/*
 * 不是真实的 webpack 配置，仅为兼容 webstorm 和 intellij idea 代码跳转
 * ref: https://github.com/umijs/umi/issues/1109#issuecomment-423380125
 */

module.exports = {
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'assets': resolve(__dirname, 'src/assets'),
      'utils': resolve(__dirname, 'src/utils'),
    },
  },
};
