module.exports = {
    resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
                    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
                        },
    devtool: "source-map",
    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },
  entry: './js/client.ts',
  output: {
    filename: 'bundle.js'
  }
}
