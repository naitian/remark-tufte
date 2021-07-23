import find from "unist-util-find";
import { findAllAfter } from "unist-util-find-all-after";
import { visit, SKIP } from "unist-util-visit";
import { removePosition } from "unist-util-remove-position";
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";
import { h } from "hastscript";

// modified headingRange that only looks for next heading of the same depth
// (instead of same or greater)
// https://github.com/syntax-tree/mdast-util-heading-range
const headingRange = (node, options, handler) => {
  let test = options;
  let children = node.children || [];
  let index = -1;
  let ignoreFinalDefinitions;
  let depth;
  let start;
  let end;
  let nodes;
  let result;
  let child;

  // Object, not regex.
  if (test && typeof test === "object" && !("exec" in test)) {
    ignoreFinalDefinitions = test.ignoreFinalDefinitions;
    test = test.test;
  }

  if (typeof test !== "function") {
    throw new TypeError(
      "Expected `string`, `regexp`, or `function` for `test`, not `" +
        test +
        "`"
    );
  }

  // Find the range.
  while (++index < children.length) {
    child = children[index];

    if (child.type === "heading") {
      if (depth && child.depth === depth) {
        end = index;
        break;
      }

      // @ts-ignore looks like a heading.
      if (!depth && test(toString(child), child)) {
        // @ts-ignore looks like a heading.
        depth = child.depth;
        start = index;
        // Assume no end heading is found.
        end = children.length;
      }
    }
  }

  // When we have a starting heading.
  if (depth) {
    if (ignoreFinalDefinitions) {
      while (
        children[end - 1].type === "definition" ||
        children[end - 1].type === "footnoteDefinition"
      ) {
        end--;
      }
    }

    nodes = handler(
      // @ts-ignore `start` points to a heading.
      children[start],
      children.slice(start + 1, end),
      children[end],
      {
        parent: node,
        start,
        end: children[end] ? end : null,
      }
    );

    if (nodes) {
      // Ensure no empty nodes are inserted.
      // This could be the case if `end` is in `nodes` but no `end` node exists.
      result = [];
      index = -1;

      while (++index < nodes.length) {
        if (nodes[index]) result.push(nodes[index]);
      }

      children.splice(start, end - start + 1, ...result);
    }
  }
};

const coerceToHtml = (nodeArray) => {
  return nodeArray.map((node) => toHtml(toHast(node))).join("") || "";
};

const isCite = (n) => n.type === "textDirective" && n.name === "cite";
const isNewThought = (n) => n.type === "textDirective" && n.name === "nt";

export const wrapSections = () => (tree) => {
  visit(tree, "heading", () => {
    headingRange(
      tree,
      (_, node) => {
        return node.depth === 2;
      },
      (start, nodes, end) => {
        return [
          {
            // This is kind of a hacky way to coerce a section element.
            // TODO: consider replacing this with type:html nodes.
            type: "paragraph",
            tagName: "section",
            children: [removePosition(start), ...nodes],
            data: { hName: "section" },
          },
          end,
        ];
      }
    );
  });
};

export const blockquoteAttribution = () => (tree) => {
  visit(tree, isCite, (n, i, p) => {
    p.children.splice(i, 1, {
      type: "paragraph",
      children: [
        { type: "html", value: "<footer>" },
        n,
        { type: "html", value: "</footer>" },
      ],
    });
    return SKIP;
  });
};

// TODO: make this a smarter citer (consider bibliography generation?)
export const cite = () => (tree) => {
  const getKey = (attr) => {
    const keys = Object.keys(attr);
    if (attr["key"]) {
      return attr["key"];
    } else if (keys.length === 1) {
      return keys[0];
    } else {
      throw `Expected exactly one cite key; received ${keys.length}.`;
    }
  };
  const getRef = (key) => {
    let value;
    visit(
      tree,
      (n) => n.type === "definition" && n.identifier === key,
      (n) => (value = n.url)
    );
    if (!value) throw "No citation for cite key.";
    return value;
  };
  visit(tree, isCite, (n) => {
    const key = getKey(n.attributes);
    n.type = "link";
    n.url = getRef(key);
  });
};

// This shortcut notation inspired by
// https://css-tricks.com/how-to-modify-nodes-in-an-abstract-syntax-tree/
// TODO: generate labels
export const imageToFigure = () => (tree) => {
  visit(
    tree,
    (n) => n.type === "paragraph" && n.children.some((c) => c.type === "image"),
    (n, _, p) => {
      if (!(p.type === "paragraph" || p.type === "root")) {
        return;
      }
      const img = find(n, (c) => c.type === "image");
      const captionValue = coerceToHtml(findAllAfter(n, img));
      const caption = captionValue
        ? {
            type: "html",
            value: `<label for="hi" class="margin-toggle">&#8853;</label>
            <input type="checkbox" id="hi" class="margin-toggle"/>
            <span class="marginnote">
              ${captionValue}
            </span>`,
          }
        : null;

      if (caption) {
        n.children = [
          { type: "html", value: "<figure>" },
          img,
          caption,
          { type: "html", value: "</figure>" },
        ];
      } else {
        n.children = [
          { type: "html", value: "<figure>" },
          img,
          { type: "html", value: "</figure>" },
        ];
      }
    }
  );
};

// This is mostly ripped from
// https://github.com/luhmann/tufte-markdown/blob/master/packages/remark-sidenotes/src/remark-sidenotes-transformer.js
export const sidenote = () => (tree) => {
  const MARGINNOTE_SYMBOL = "{-}";
  const getReplacement = ({ isMarginNote, noteHTML }, identifier) => {
    const labelCls = `margin-toggle ${isMarginNote ? "" : "sidenote-number"}`;
    const labelSymbol = isMarginNote ? "&oplus;" : "";
    const noteTypeCls = isMarginNote ? "marginnote" : "sidenote";

    return [
      {
        type: "html",
        value: `<label for="${identifier}" class="${labelCls}">${labelSymbol}</label>`,
      },
      {
        type: "html",
        value: `<input type="checkbox" id="${identifier}" class="margin-toggle" />`,
      },
      {
        type: "html",
        value: `<span class="${noteTypeCls}">${noteHTML}</span>`,
      },
    ];
  };
  const extractNoteFromHtml = (note) => {
    const matches = note.match(/(\s+)*({-})*\s*((.|\n)+)/);
    return {
      isMarginNote: matches[2] === MARGINNOTE_SYMBOL,
      noteHTML: matches[3],
    };
  };
  const getByIdentifier = (identifier) => {
    let match;
    visit(
      tree,
      (n) => n.type === "footnoteDefinition" && n.identifier === identifier,
      (n) => (match = n)
    );
    if (!match) {
      throw `No matching definition for identifier ${identifier}`;
    }
    return match;
  };
  visit(tree, "footnoteReference", (n, i, p) => {
    const def = getByIdentifier(n.identifier);
    const notesAst =
      def.children.length && def.children[0].type === "paragraph"
        ? def.children[0].children
        : def.children;
    const text = extractNoteFromHtml(coerceToHtml(notesAst));
    p.children.splice(i, 1, ...getReplacement(text, n.identifier));
  });

  visit(tree, "footnoteDefinition", (_, index, parent) => {
    parent.children.splice(index, 1);
  });
  visit(tree, "footnote", (node, index, parent) => {
    const notesAst = node.children;
    const nodeDetail = extractNoteFromHtml(coerceToHtml(notesAst));

    parent.children.splice(index, 1, ...getReplacement(nodeDetail));
  });
};

export const newThought = () => (tree) => {
  visit(tree, isNewThought, (n) => {
    const val = coerceToHtml(n.children);
    n.type = "html";
    n.value = `<span class="newthought">${val}</span>`;
  });
};

const isSans = (node) => {
  return node.type === "containerDirective" && node.name === "sans";
};

export const sans = () => (tree) => {
  visit(tree, isSans, (n) => {
    n.type = "html";
    const nodes =
      n.children[0].type === "paragraph" ? n.children[0].children : n.children;
    n.value = `<p class='sans'>${coerceToHtml(nodes)}</p>`;
  });
};

const isFigure = (node) => {
  return node.type === "containerDirective" && node.name === "figure";
};
export const figure = () => (tree) => {
  visit(tree, isFigure, (n) => {
    console.log(n)
    const fullwidth = Object.keys(n.attributes).includes("fullwidth")
    const nodes =
      n.children[0].type === "paragraph" ? n.children[0].children : n.children;
    n.type = "paragraph";
    n.children = [
      {
        type: "html",
        value: `<figure${fullwidth ? " class='fullwidth'" : ""}>`,
      },
      ...nodes,
      { type: "html", value: "</figure>" },
    ];
  });
};
