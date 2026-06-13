import { Metadata } from "next";
import { getPostsServer } from "../lib/db-server";
import HomeClient from "./HomeClient";

// ─── Static Site Generation ────────────────────────────────────────────────
// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.techbasics.online",
  },
};

export default async function Home() {
  const posts = await getPostsServer();
  return <HomeClient initialPosts={posts} />;
}
