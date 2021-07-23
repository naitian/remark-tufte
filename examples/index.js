import { readFileSync, writeFileSync } from "fs";
import remark from "remark";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import raw from "rehype-raw";
import gfm from "remark-gfm";
import stringify from "rehype-stringify";
import footnotes from "remark-footnotes";
import {
  wrapSections,
  cite,
  sans,
  blockquoteAttribution,
  newThought,
  imageToFigure,
  figure,
  sidenote,
} from "./remark-tufte.js";

const content = remark()
  .use(gfm)
  .use(remarkDirective)
  .use(footnotes, { inlineNotes: true })
  .use(wrapSections)
  .use(newThought)
  // .use(htmlDirectives)
  .use(blockquoteAttribution)
  .use(imageToFigure)
  .use(figure)
  .use(cite)
  .use(sans)
  .use(sidenote)
  .use(remarkRehype, { allowDangerousHtml: true })
  // .use(() => {return (tree) => console.log(JSON.stringify(tree))})
  .use(raw)
  .use(stringify)
  .processSync(
    readFileSync("./tufte.md")
    // readFileSync("./file.md")
  );

// console.log(content.contents);
writeFileSync("tufte.html", content.contents);
// writeFileSync("output.html", content.contents);
