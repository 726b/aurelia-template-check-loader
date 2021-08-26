# aurelia-template-check-loader

Sanity check of Aurelia templates for Webpack.

## Installation

`yarn add aurelia-template-check-loader --dev`

## How to use

````js
module.exports = {
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.html$/i,
        use: [
          loader: "aurelia-template-check-loader",
          options: {
            // Aurelia template lint configuration object
            // See https://github.com/aurelia/template-lint
            configuration: {},

            // Display the linter's output as errors (true) or warnings (false)
            emitErrors: true,

            // Activates useRuleAureliaBindingAccess option
            // See https://github.com/aurelia/template-lint
            typeChecking: true
          }
        ]
      }
    ]
  }
}
````

## Configuration options

For more configuration options and documentation, go to [Aurelia's official template linter](https://github.com/aurelia/template-lint).
