const fs = require('fs');

const content = `## Heading 1
Some text
<h2 class="test">HTML Heading</h2>
More text
### 
Empty heading?
`;

const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");
const headingRegex = /^(#{1,3})\s+(.+)$|<h([1-3])[^>]*>(.*?)<\/h\3>/gm;

const headings = [];
let match;
while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
  const isMarkdown = !!match[1];
  const level = isMarkdown ? match[1].length : parseInt(match[3], 10);
  let title = isMarkdown ? match[2] : match[4];
  headings.push({ title, level });
}
console.log(headings);
