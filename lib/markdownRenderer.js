import markdownIt from "markdown-it";
import markdownItMathjax from "../lib/markdown-mathjax";
import { markdownItSub } from "markdown-it-sub";

//
let cleanMarkdown = (text) => {
  //console.log(text)
  text = text.replace(/\\/g, "");
  text = text.replace(
    /--------------------------------------------------------------------------------/g,
    ""
  ); // This is how *** gets translated to. Per se, it should be translated to "\n", but not doing so to keep consistent.
  text = text.replace("... Read more »", "...");
  //text = text.replaceAll("\n", "\n\n") // Does not work; original text doesn't have newlines (?!). Search for Debate on Instrumental Convergence between LeCun, Russell, Bengio, Zador, and More and see https://www.alignmentforum.org/posts/WxW6Gc6f2z3mzmqKs/debate-on-instrumental-convergence-between-lecun-russell to confirm.
  return text;
};

// Renderer
const mdi = markdownIt({ linkify: true }); // this keeps with markdownIt documentation; I'd otherwise not use the abbreviation.
mdi.use(markdownItMathjax());
var defaultRender =
  mdi.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

mdi.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // Taken from: https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer (https://github.com/markdown-it/markdown-it/issues/140)
  // Makes links open in a new page.
  // If you are sure other plugins can't add `target` - drop check below
  var aIndex = tokens[idx].attrIndex("target");

  if (aIndex < 0) {
    tokens[idx].attrPush(["target", "_blank"]); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = "_blank"; // replace value of existing attr
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

//export let markdownRenderer = mdi.render
export function markdownRenderer(text) {
  // there has got to be a more concise way of doing this. Mozilla mentions the above line as an option (https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export), but using it returns an scope error (this is not defined), perhaps because the overall package is not a module.
  text = cleanMarkdown(text);
  return mdi.render(text);
}
