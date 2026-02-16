/**
 * Remark plugin to add non-wrappable text using [[text]] syntax
 *
 * Usage in markdown:
 * [[/var/log/journal]]
 */
export default function remarkNowrap() {
  return tree => {
    function processNode(node) {
      if (!node.children) return;

      const replacements = [];

      // First pass: find all text nodes that need replacement
      node.children.forEach((child, index) => {
        if (child.type === "text") {
          const text = child.value;
          const regex = /\[\[([^\]]+)\]\]/g;
          const matches = Array.from(text.matchAll(regex));

          if (matches.length > 0) {
            const newChildren = [];
            let lastIndex = 0;

            matches.forEach(match => {
              // Add text before match
              if (match.index > lastIndex) {
                newChildren.push({
                  type: "text",
                  value: text.slice(lastIndex, match.index),
                });
              }

              // Add the nowrap span
              newChildren.push({
                type: "html",
                value: `<span class="nowrap">${match[1]}</span>`,
              });

              lastIndex = match.index + match[0].length;
            });

            // Add remaining text
            if (lastIndex < text.length) {
              newChildren.push({
                type: "text",
                value: text.slice(lastIndex),
              });
            }

            replacements.push({ index, replacement: newChildren });
          }
        }
      });

      // Second pass: apply replacements in reverse order to maintain indices
      replacements.reverse().forEach(({ index, replacement }) => {
        node.children.splice(index, 1, ...replacement);
      });

      // Recursively process all children
      node.children.forEach(processNode);
    }

    processNode(tree);
    return tree;
  };
}
