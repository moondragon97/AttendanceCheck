const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const jsBase = "./src/client/js/";

module.exports = {
    entry: {main: jsBase + "main.js",
            feeManage: jsBase + "feeManage",
            transformDate: jsBase + "transformDate",
            clock: jsBase + "clock",
            userDelete: jsBase + "userDelete",
            userDataManage: jsBase + "userDataManage",
            postingDelete: jsBase + "postingDelete",
            attendanceDelete: jsBase + "attendanceDelete"},
    output:{
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    module:{
        rules: [{test: /\.js$/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: [["@babel/preset-env", {targets: "defaults"}]],
                }
            },
        },
        {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        }],
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css",
    })],
};