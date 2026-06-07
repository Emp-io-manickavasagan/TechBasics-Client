import { getPostsServer } from "../lib/db-server";
import HomeClient from "./HomeClient";

// ─── Static Site Generation ────────────────────────────────────────────────
// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home() {
  const posts = await getPostsServer();
  return <HomeClient initialPosts={posts} />;
}
