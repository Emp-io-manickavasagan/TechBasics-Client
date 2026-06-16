require('dotenv').config({ path: '.env' });
const { initializeApp } = require('firebase/app');
const { getFirestore, getDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

getDoc(doc(db, "posts", "code-is-just-a-tool-startup-success")).then(snap => {
  const content = snap.data().content;
  console.log("CONTENT LENGTH:", content.length);
  const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");
  const headingRegex = /^(#{1,3})\s+(.+)$|<h([1-3])[^>]*>(.*?)<\/h\3>/gm;
  
  const headings = [];
  let match;
  while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
    const isMarkdown = !!match[1];
    const level = isMarkdown ? match[1].length : parseInt(match[3], 10);
    let title = isMarkdown ? match[2] : match[4];
    title = title.trim();
    headings.push({ title, level });
  }
  console.log("HEADINGS:", headings);
});
