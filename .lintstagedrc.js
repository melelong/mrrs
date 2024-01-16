// 导入 ESLint 包，以便使用 ESLint 类对文件执行代码质量检查
const { ESLint } = require('eslint')

/**
 * 从提供的文件数组中移除那些被 ESLint 配置忽略的文件。
 *
 * @param {string[]} files - 一个包含文件路径的字符串数组。
 * @returns {Promise<string>} 返回一个字符串，其中包含所有未被 ESLint 忽略的文件路径，这些路径用空格分隔。
 */
const removeIgnoredFiles = async (files) => {
  // 实例化 ESLint
  const eslint = new ESLint()
  console.log('过滤文件')
  // 使用 map 方法对每个文件路径调用 isPathIgnored 方法来确定其是否被 ESLint 忽略
  // Promise.all 等待所有的异步检查操作完成
  const ignoredFiles = await Promise.all(files.map((file) => eslint.isPathIgnored(file)))

  // 使用 filter 方法创建一个新的数组，该数组只包含不被 ESLint 忽略的文件
  const filteredFiles = files.filter((_, i) => !ignoredFiles[i])

  // 将过滤后的文件路径数组转换为一个用空格分隔的字符串，以便作为命令行参数使用
  return filteredFiles.join(' ')
}

// 导出一个配置对象，它将被 lint-staged 使用，lint-staged 允许我们在 git 提交之前对暂存的文件运行脚本
module.exports = {
  // 这里特别针对 JavaScript 和 TypeScript 文件，包括 JSX 和 TSX 变体
  '*.{js,jsx,ts,tsx}': async (files) => {
    // 首先移除被 ESLint 忽略的文件
    const filesToLint = await removeIgnoredFiles(files)
    console.log('执行命令')
    // 返回一个命令数组，其中包含了调用 ESLint 和 Prettier 的命令
    // npx eslint ... --fix 参数会自动修复可以修复的问题
    // npx prettier -w ... 将格式化代码，-w 代表写入更改
    return [
      `npx eslint ${filesToLint} --max-warnings=0 --fix`,
      `npx prettier --config .prettierrc.js . -w`
    ]
  }
}
