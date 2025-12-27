export default {
  // 全局默认配置
  printWidth: 80,
  tabWidth: 4,
  useTabs: true,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "crlf",

  // 针对不同文件类型的覆盖配置
  overrides: [
    {
      // CSS 相关文件
      files: ["**/*.css"],
      options: {
        printWidth: 200,
        tabWidth: 2,
        useTabs: false,
      },
    },
  ],
};
