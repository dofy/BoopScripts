# BoopScripts

用于 [Boop](https://github.com/IvanMathy/Boop) 的 JavaScript 文本处理脚本集合，覆盖 Unicode 字符编码、JSON 格式化、PEM 排版、换行转换和 RGB 颜色转换。

## Boop 是什么？

[Boop](https://github.com/IvanMathy/Boop) 是面向开发者的 macOS 文本处理草稿本：粘贴一段文本，选择脚本执行，再复制处理结果。它支持通过 JavaScript 自定义命令，适合日常开发中的格式整理、编码转换和小段文本清洗。

- [Boop GitHub 仓库](https://github.com/IvanMathy/Boop)
- [Boop 下载](https://github.com/IvanMathy/Boop/releases)
- [官方使用文档](https://github.com/IvanMathy/Boop/blob/main/Boop/Documentation/Readme.md)
- [自定义脚本 API](https://github.com/IvanMathy/Boop/blob/main/Boop/Documentation/CustomScripts.md)

本仓库是个人脚本合集，与 Boop 官方项目独立维护。

## 安装与使用

1. 安装并打开 Boop。
2. 克隆本仓库，或通过 GitHub 的 **Code → Download ZIP** 下载并解压：

   ```sh
   git clone https://github.com/dofy/BoopScripts.git
   ```

3. 在 **Boop → Preferences → Scripts** 中，将自定义脚本路径设为本仓库目录；也可以只把需要的根目录 `.js` 文件复制到已有的自定义脚本目录。
4. 按 `⇧⌘R` 重新加载脚本，粘贴文本后按 `⌘B` 搜索并执行命令。

使用这些脚本不需要 Node.js；Node.js 仅用于运行仓库中的测试。

## 脚本列表

11 个启用的 Boop 命令。普通转换使用 `state.text`：有选区只处理选区，否则处理全文。查询命令只显示结果；模板命令插入到光标处或替换选区。

| 文件 | 功能 |
| --- | --- |
| [ASCII2DIGI.js](ASCII2DIGI.js) | 字符与十进制 Unicode 码点两行对照；保留空格，控制字符以转义形式显示 |
| [DIGI2ASCII.js](DIGI2ASCII.js) | 十进制码点转字符，支持空白或逗号分隔；拒绝代理项和越界值 |
| [GetKeyCodeByKey.js](GetKeyCodeByKey.js) | 查询一个 Unicode 码点，不是键盘事件 keyCode；组合 emoji 可能包含多个码点 |
| [GetKeyByKeyCode.js](GetKeyByKeyCode.js) | 查询十进制 Unicode 码点对应的字符 |
| [SuperFormatJSON.js](SuperFormatJSON.js) | 格式化标准 JSON，兼容有限宽松语法 |
| [JWTPrivateKeyFormat.js](JWTPrivateKeyFormat.js) | 单个 PEM 块或裸 Base64 每行 64 字符排版；支持字面量换行转义 |
| [rgb2hex.js](rgb2hex.js) | 三个 0–255 整数转六位 Hex，支持 rgb(...)、空格或逗号 |
| [NewlineEscape2Real.js](NewlineEscape2Real.js) | 字面量 \\r\\n、\\n、\\r 转 LF |
| [NewlineReal2Escape.js](NewlineReal2Escape.js) | CRLF、LF、CR 统一转字面量 \\n |
| [MultiLines.js](MultiLines.js) | 有损操作：合并连续换行转义，并删除后续空白和缩进 |
| [BoopScriptTemplate.js](BoopScriptTemplate.js) | 插入安全的选区感知模板 |

## JSON 支持范围

优先使用 JSON.parse；失败后按词法单元处理注释、尾逗号、单引号字符串、ASCII 裸键。字符串中的 URL、注释样式文字、undefined 等保持原值。支持标准 JSON 字符串转义，以及单引号字符串内的 \\'。

undefined、NaN、Infinity、-Infinity 值会转为 null；保留旧的 `[word]` 转字符串数组功能，这些转换都会显示数量提示。不是完整 JSON5，不支持执行表达式、函数、十六进制数字等。解析失败保留输入，提示不回显原文。

遵循 JavaScript JSON.parse/JSON.stringify 的数字精度和重复键行为；超大整数 ID 请使用字符串。

## 换行与 PEM

换行命令是字面替换，不是 JSON 字符串的完整转义/反转义，也不判断反斜杠嵌套层级。转义换行统一为 LF，原始换行风格不会保留。

PEM 命令只排版：校验头尾标签一致、单个块和带必要 padding 的 Base64 语法，不验证密钥、证书、DER 或签名。没有头尾时不会猜测类型并添加标签。带额外 PEM 元数据的旧式加密密钥不支持，会保持输入并报错。

## 模板与示例

重复模板、调试示例、趣味脚本放在 examples/*.js.txt，避免作为日常 Boop 命令加载。需要时可复制到脚本目录并恢复 .js 后缀。

## 验证与加载

运行 `node tests/scripts.cjs`。测试使用隔离 VM 模拟 Boop 状态，覆盖全文/选区、错误不修改输入、Unicode、JSON 字符串边界和模板生成；不等同于 Boop 原生界面验证。

在 Boop 中按 ⇧⌘R 重新加载脚本；按 ⌘B 搜索命令。若该目录尚未配置，在 Boop 偏好设置的 Scripts 中指定本目录。

## 致谢与许可证

采用 [MIT License](LICENSE)。

感谢 [Ivan Mathy 和 Boop 社区](https://github.com/IvanMathy/Boop)。部分脚本最初来自社区示例；原始作者包括 Ivan、Joseph Ng Rong En、luisfontes19 和 tlewis，后续由 Seven Yu 整理和维护。保留适用的原作者署名与版权声明。
