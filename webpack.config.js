// установлен через npm, позволяет генерировать html файл (index.html) для результирующей сборки
const HtmlWebpackPlugin = require("html-webpack-plugin");

// загрузчик css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// минификатор js
const TerserPlugin = require("terser-webpack-plugin");

// минификатор css
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const webpack = require("webpack");
const path = require("path"); // встроенная node.js либа для работы с путями в ОС (не нужно устанавливать через npm)

module.exports = {
  mode: 'development',
  entry: "./src/index.js", // точка входа
  output: {
    filename: "app.min.js", // имя файла сборки
    path: path.resolve(__dirname, "build"), // генерируем папку build, куда помещаются все файлы при сборке
  },
  resolve: {
    // настройка расширений файлов по умолчанию
    extensions: [".js", ".css"],
  },
  optimization: {
    // настройка оптимизации ресурсов
    minimize: true,
    minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()],
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: "babel-loader", // транспиляция js
      },
      {
        test: /\.css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader, // лоадер обработки css
            options: {
              publicPath: ''
            },
          },
          "css-loader", // лоадер парсинга css
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }), // html файл проекта используем в плагине как шаблон
    new MiniCssExtractPlugin({ filename: "app.min.css" }), // подключение плагина для генерации результирующего css файла
  ],
};