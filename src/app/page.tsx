import { Metadata } from "next";
import { getPostsServer, getCategoriesServer } from "../lib/db-server";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.techbasics.online",
  },
};

export default async function Home() {
  const [posts, categories] = await Promise.all([
    getPostsServer(),
    getCategoriesServer(),
  ]);
  return <HomeClient initialPosts={posts} initialCategories={categories} />;
}
