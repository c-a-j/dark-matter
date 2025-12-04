/**
 * Remark plugin to disable auto-linking of bare URLs
 * 
 * Converts auto-links (where link text equals URL) back to plain text.
 * Only explicit markdown links [text](url) remain as links.
 */
export default function remarkDisableAutolinks() {
  return (tree) => {
    function processNode(node) {
      if (!node.children) return;
      
      node.children.forEach((child, index) => {
        // Check if this is a link node
        if (child.type === 'link') {
          // Get the link text content
          const linkText = child.children
            ? child.children
                .filter(c => c.type === 'text')
                .map(c => c.value)
                .join('')
            : '';
          
          // Get the URL
          const url = child.url || '';
          
          // If link text equals URL (or is empty and URL exists), it's an auto-link
          // Convert it back to plain text
          if (linkText === url || (linkText === '' && url)) {
            node.children[index] = {
              type: 'text',
              value: url
            };
          }
        }
        
        // Recursively process children
        if (child.children) {
          processNode(child);
        }
      });
    }
    
    processNode(tree);
    return tree;
  };
}

