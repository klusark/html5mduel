module.exports = {
    resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
                    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
                        },
    devtool: "source-map",
    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ]
    },
  entry: './js/client.ts',
  output: {
    filename: 'bundle.js'
  }
}
