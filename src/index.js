const { getOptions } = require("loader-utils");
const { AureliaLinter } = require("aurelia-template-lint");
const merge = require("lodash.merge");

const config = {
  useRuleAttributeValue: true,
  useRuleObsoleteAttribute: true,
  useRuleObsoleteTag: true,
  useRuleConflictingAttribute: true,
  useRuleSelfClose: true,
  useRuleStructure: true,
  useRuleId: true,
  useRuleValidChildren: true,
  useRuleRequiredAttributes: true,
  useRuleAureliaRequire: true,
  useRuleAureliaSlot: true,
  useRuleAureliaTemplate: true,
  useRuleAureliaBindingAccess: false,
  useRuleAureliaBindingSyntax: true,

  attributeValueOpts: [
    {
      attr: /^style$/,
      not: /\${(.?)+}/,
      msg: "interpolation not allowed in style attribute"
    },
    {
      attr: /^bindable$/,
      not: /[a-z][A-Z]/,
      msg: "camelCase bindable is converted to kebab-case",
      tag: "template"
    },
    {
      tag: "button",
      attr: /^type$/,
      is: /^button$|^submit$|^reset$|^menu$/,
      msg: "button type invalid"
    }
  ],

  requiredAttribute: [
    {
      tag: /^button$/,
      attr: /^type$/,
      msg: "buttons without a type have irregular behavour"
    }
  ],

  obsoleteTagOpts: [
    {
      tag: "content",
      msg: "use slot instead"
    }
  ],

  obsoleteAttributeOpts: [],

  conflictingAttributeOpts: [
    {
      attrs: ["repeat.for", "if.bind", "with.bind"],
      msg: "template controllers shouldn't be placed on the same element"
    }
  ],

  idAttributeOpts: {
    allowEmptyId: false,
    allowDuplicateId: false,
    allowIllegalChars: false,
    ignoreAny: /\$\{[\s\S]+\}/
  },

  validChildOpts: [
    { element: "tr", allow: ["td", "th"] },
    { element: "ul", allow: ["li"] },
    { element: "ol", allow: ["li"] },
    { element: "dl", allow: ["dt", "dd"] },
    { element: "select", allow: ["option", "optgroup"] }
  ],

  parserOpts: {
    voids: ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"],
    scopes: ["html", "body", "template", "svg", "math"]
  },

  aureliaBindingAccessOpts: {
    localProvidors: [
      "repeat.for", "if.bind", "with.bind"
    ],
    localOverride: new Map(),
    restrictedAccess: ["private", "protected"],
    reportUnresolvedViewModel: true
  },

  aureliaSlotOpts: {
    controllers: [
      "repeat.for", "if.bind", "with.bind"
    ]
  },

  aureliaTemplateOpt: {
    containers: ["table", "select"]
  },

  reflectionOpts: {
    sourceFileGlob: "src/**/*.ts",
    typingsFileGlob: "src/**/*.d.ts"
  },

  debug: false,

  customRules: []
};

function lint(input, webpack, callback)
{
  const options = getOptions(webpack);

  const configuration = merge(config, options.configuration || {});

  if (options.typeChecking)
  {
    configuration.useRuleAureliaBindingAccess = true;
  }

  const linter = new AureliaLinter(configuration);

  const emitter = options.emitErrors ? webpack.emitError : webpack.emitWarning;

  linter.lint(input).then(errors =>
  {
    if (errors.length)
    {
      emitter(new Error(errors.map(e => `[line ${e.line}, col ${e.column}]: ${e.message}`).join("\r\n")));
    }

    if (callback)
    {
      callback(null, input);
    }
  });
}

module.exports = function (input)
{
  if (this.cacheable)
  {
    this.cacheable();
  }

  const callback = this.async();

  if (!callback)
  {
    lint(input, this);
    return input;
  }

  try
  {
    lint(input, this, callback);
  }
  catch (e)
  {
    callback(e);
  }
};