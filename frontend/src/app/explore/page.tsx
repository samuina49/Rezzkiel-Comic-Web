import { api } from "@/lib/api";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Sparkles, TrendingUp, BookOpen } from "lucide-react";

async function getPublishedStories(search?: string, category?: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "All") params.append("category", category);
    
    const res = await fetch(`http://localhost:5042/api/stories?${params.toString()}`, { 
      next: { revalidate: 0 } 
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Explore Fetch Error:", error);
    return [];
  }
}

const CATEGORIES = ["All", "General", "Action", "Romance", "Fantasy", "Horror", "Comedy", "Sci-Fi"];

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const spa = await searchParams;
  const stories = await getPublishedStories(spa.search, spa.category);

  return (
    <main className="container mx-auto py-12 px-4 min-h-[calc(100vh-4rem)] max-w-7xl">
      
      {/* Header with Background Glow */}
      <div className="relative mb-16 py-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
        <h1 className="text-5xl font-black tracking-tighter mb-2">EXPLORE <span className="text-primary italic">ALL</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">The complete multiverse collection</p>
      </div>

      {/* Search & Categories Box */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 mb-16 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-8 items-end">
          <div className="flex-1 space-y-4 w-full">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Keywords</label>
            <form action="/explore" className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input 
                name="search"
                defaultValue={spa.search}
                placeholder="Search titles, authors, descriptions..." 
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-zinc-950 border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm font-medium"
              />
            </form>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Categories</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <Link 
                  key={cat}
                  href={cat === "All" ? "/explore" : `/explore?category=${cat}`}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                    (spa.category === cat || (!spa.category && cat === "All"))
                      ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                      : "bg-zinc-950 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
                  )}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
             <BookOpen className="h-10 w-10 text-zinc-700" />
          </div>
          <h3 className="text-3xl font-bold">No Records Found</h3>
          <p className="text-zinc-500 max-w-sm font-medium">Try adjusting your filters or search terms to find hidden chronicles.</p>
          <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }), "mt-6 rounded-full px-8")}>Reset Exploration</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {stories.map((story: any) => (
            <Card key={story.id} className="group border-none bg-transparent shadow-none">
              <Link href={`/story/${story.id}`}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/10">
                  {story.coverImageUrl ? (
                    <img
                      src={story.coverImageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <Sparkles className="h-12 w-12 opacity-10" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-primary">
                     {story.category}
                  </div>

                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-primary text-black rounded-lg text-xs font-black shadow-lg">
                    {story.price > 0 ? `$${story.price.toFixed(2)}` : "FREE"}
                  </div>
                </div>
              </Link>

              <div className="mt-5 space-y-2">
                <Link href={`/story/${story.id}`}>
                  <h3 className="font-heading text-xl font-bold leading-tight hover:text-primary transition-colors line-clamp-1">{story.title}</h3>
                </Link>
                <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed h-10">{story.description}</p>
                <div className="flex items-center justify-between pt-2">
                   <div className="flex items-center text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                     <TrendingUp className="h-3 w-3 mr-1 text-primary" /> {story.viewCount} Views
                   </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
