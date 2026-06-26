import { Metadata } from "next";
import { getPostsServer } from "../lib/db-server";
import HomeClient from "./HomeClient";

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
