// 引入 ESLint 模块，它提供了一个 ESLint 类来配置和执行 ESLint 操作
const { ESLint } = require('eslint');

/**
 * 过滤掉 ESLint 配置中被忽略的文件。
 * 
 * @param {string[]} files - 一个待检查文件路径的数组。
 * @returns {Promise<string>} 返回一个承诺，解析为一个不包含被忽略文件的字符串，
 * 文件路径之间用空格分隔。
 */
const removeIgnoredFiles = async (files) => {
  // 创建一个 ESLint 实例
  const eslint = new ESLint();

  // 使用 map 函数对每个文件路径执行 isPathIgnored 方法，该方法检查文件是否被 ESLint 忽略
  // 并将结果包装在 Promise.all 中，以并行处理所有的检查
  const ignoredFiles = await Promise.all(files.map((file) => eslint.isPathIgnored(file)));

  // 使用 filter 方法移除那些被 ESLint 忽略的文件，ignoredFiles 数组的相应位置将为 true
  const filteredFiles = files.filter((_, i) => !ignoredFiles[i]);

  // 将剩余的文件路径连接为一个单一的字符串，文件路径之间用空格分隔
  return filteredFiles.join(' ');
};

// 导出一个配置对象，它将被 lint-staged 使用，lint-staged 允许我们对 git 暂存区的文件执行命令
module.exports = {
  // 这里配置了一个针对所有文件的 lint 任务
  '*': async (files) => {
    // 首先过滤掉 ESLint 配置中被忽略的文件
    const filesToLint = await removeIgnoredFiles(files);

    // 返回一个数组，包含了要执行的 ESLint 命令
    // --max-warnings=0 标志将导致即使只有警告，也将退出状态码设置为错误，这可以强制开发者解决所有的警告
    return [`eslint ${filesToLint} --max-warnings=0`];
  },
};
