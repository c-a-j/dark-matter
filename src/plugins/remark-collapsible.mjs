/**
 * Remark plugin to add collapsible sections using ::: syntax
 *
 * Usage in markdown:
 * :::details Summary text
 * content here
 * :::
 *
 * Note: A blank line before ::: is required for markdown to parse it as a paragraph
 */
export default function remarkCollapsible() {
  return tree => {
    const nodesToProcess = [];

    // Helper to extract all text from a node
    function getNodeText(node) {
      if (!node.children) return "";
      const textNodes = node.children.filter(child => child.type === "text");
      return textNodes.map(n => n.value).join("");
    }

    // First pass: find all opening and closing markers
    function findMarkers(node, index, parent) {
      // Check paragraphs for opening/closing markers
      if (node.type === "paragraph" && node.children) {
        const fullText = getNodeText(node);

        // Check for opening :::details Summary
        const openMatch = fullText.match(/^:::details\s+(.+)$/);
        if (openMatch) {
          nodesToProcess.push({
            type: "open",
            index,
            parent,
            summary: openMatch[1].trim(),
          });
          return;
        }

        // Check for closing :::
        if (fullText.trim() === ":::") {
          nodesToProcess.push({
            type: "close",
            index,
            parent,
          });
        }
      }

      if (node.children) {
        node.children.forEach((child, idx) => findMarkers(child, idx, node));
      }
    }

    findMarkers(tree);

    // Also check root-level children for standalone ::: that might not be in paragraphs
    if (tree.children) {
      for (let i = 0; i < tree.children.length; i++) {
        const node = tree.children[i];
        const text = getNodeText(node);
        if (text.trim() === ":::") {
          // Check if there's a matching open before it
          let hasOpenBefore = false;
          for (let j = 0; j < i; j++) {
            const prevNode = tree.children[j];
            if (
              prevNode.type === "html" &&
              prevNode.value &&
              prevNode.value.includes("<details>")
            ) {
              hasOpenBefore = true;
              break;
            }
            const prevText = getNodeText(prevNode);
            if (prevText.match(/^:::details\s+/)) {
              hasOpenBefore = true;
              break;
            }
          }

          if (hasOpenBefore && node.type === "paragraph") {
            nodesToProcess.push({
              type: "close",
              index: i,
              parent: tree,
            });
          }
        }
      }
    }

    // Second pass: match opening and closing pairs and replace them
    const processed = new Set();

    for (let i = 0; i < nodesToProcess.length; i++) {
      const openNode = nodesToProcess[i];
      if (openNode.type !== "open" || processed.has(openNode.index)) continue;

      // Find matching close node in the same parent
      for (let j = i + 1; j < nodesToProcess.length; j++) {
        const closeNode = nodesToProcess[j];
        if (
          closeNode.type === "close" &&
          closeNode.parent === openNode.parent &&
          !processed.has(closeNode.index) &&
          closeNode.index > openNode.index
        ) {
          // Replace opening
          openNode.parent.children[openNode.index] = {
            type: "html",
            value: `<details>\n<summary>${openNode.summary}</summary>\n\n`,
          };

          // Replace closing
          closeNode.parent.children[closeNode.index] = {
            type: "html",
            value: "\n\n</details>",
          };

          processed.add(openNode.index);
          processed.add(closeNode.index);
          break;
        }
      }
    }

    return tree;
  };
}
