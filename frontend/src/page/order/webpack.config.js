module.exports = {
  // your existing configuration
  module: {
    rules: [
      // other rules
      {
        test: /\.map$/,
        loader: "ignore-loader",
      },
    ],
  },
};
