import path from 'path';

export default {
  debug: true,
  devtool: 'inline-source-map',
  noInfo: false,
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'src'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.ejs'],
  },
  plugins: [],
  modules: {
    loaders: [
      { test: /\.js$/, exclude: /node_module/, loaders: ['babel'] },
      { test: /\.css$/, loaders: ['css-loader'] },
      { test: /\.ejs$/, loader: 'ejs-loader?variable=data' },
    ],
  },
};
