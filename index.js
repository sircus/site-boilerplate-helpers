/**
 * Handlebars helper for site-boilerplate
 * Created and maintained by Ungki.h <https://github.com/ungki> and blivesta <https://github.com/blivesta>
 *
 * Licensed under the MIT License (MIT).
 */

var layouts = require('handlebars-layouts');
var marked = require('marked');
var hljs = require('highlight.js');

module.exports.register = function (handlebars, options) {

  /**
  * handlebars-layouts
  * <https://github.com/shannonmoeller/handlebars-layouts> (Shannon Moeller)
  *
  * {{#extend [partial] [context](Optional) [key=value ...](Optional)}}
  * {{#embed [partial] [context](Optional) [key=value ...](Optional)}}
  * {{#block [name]}}
  * {{#content [name] mode="(append|prepend|replace)"(Optional)}}
  * {{#if (content "n")}} Conditional Blocks
  */
  handlebars.registerHelper(layouts(handlebars));

  /**
  * Marked
  * <https://github.com/chjj/marked> (Christopher Jeffrey (JJ))
  *
  * gfm: {Boolean} (default: true) Enable GitHub flavored markdown.
  * tables: {Boolean} (default: true) Enable GFM tables. This option requires the gfm option to be true.
  * breaks: {Boolean} (default: false) Enable GFM line breaks. This option requires the gfm option to be true.
  * pedantic: {Boolean} (default: false) Conform to obscure parts of markdown.pl as much as possible. Don't fix any of the original markdown bugs or poor behavior.
  * sanitize:  {Boolean} (default: false) Sanitize the output. Ignore any HTML that has been input.
  * smartLists: {Boolean} (default: true) Use smarter list behavior than the original markdown. May eventually be default with the old behavior moved into pedantic.
  * smartypants: {Boolean} (default: false) Use "smart" typograhic punctuation for things like quotes and dashes.
  * xhtml: {Boolean} (default: false) this.options.xhtml ? '/>' : '>';
  */
  marked.options = {
    renderer: new marked.Renderer(),
    langPrefix: 'language-',
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  };

  handlebars.registerHelper({

    /**
     * {{markdown}}
     *
     * Blcok helper: function (options.fn)
     *
     * @method markdown
     * @param {Function(Object)} options.fn
     * @return {String} Rendered content.
     *
     * @example
     *  - {{#markdown}} content {{/markdown}}
     */
    markdown: function(options) {
      options = options || {};

      var md = options.fn(this);

      // Set marked options
      marked.setOptions(marked.options);
      return new handlebars.SafeString(marked(md));
    },

    /**
     * {{is}}
     *
     * @method is
     * @param {[type]} context
     * @param {[type]} compare
     * @param {[type]} options
     * @return {[type]}
     *
     * @example
     *  - {{#is A "b"}} {{else}}(Optional) {{/is}}
     *  - {{#is A "b" or="C"}} {{else}}(Optional) {{/is}}
     */
    is: function(context, compare, options) {
      if(context == compare || context == options.hash.or) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },

    /**
     * {{isnot}}
     *
     * @method isnot
     * @param {[type]} context
     * @param {[type]} compare
     * @param {[type]} options
     * @return {[type]}
     *
     * @example
     *  - {{#isnot A "b"}} {{else}}(Optional) {{/is}}
     *  - {{#isnot A "b" or="C"}} {{else}}(Optional) {{/is}}
     */
    isnot: function(context, compare, options) {
      if(context == compare || context == options.hash.or) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }

  });

};
