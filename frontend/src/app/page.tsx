import { HomeClient } from "@/components/Home/HomeClient";

async function getHomeData() {
  try {
    // Fetch Trending (Views) and Latest (CreatedAt)
    const [trendingRes, latestRes] = await Promise.all([
      fetch("http://localhost:5042/api/stories/trending?count=5", { next: { revalidate: 0 } }),
      fetch("http://localhost:5042/api/stories?count=4", { next: { revalidate: 0 } })
    ]);

    const trending = trendingRes.ok ? await trendingRes.json() : [];
    const latest = latestRes.ok ? await latestRes.json() : [];

    return { trending, latest };
  } catch (err) {
    console.error("Home Data Fetch Error:", err);
    return { trending: [], latest: [] };
  }
}

export default async function Home() {
  const { trending, latest } = await getHomeData();

  return <HomeClient trending={trending} latest={latest} />;
}
