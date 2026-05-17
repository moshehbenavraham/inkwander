import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { useSEO, jsonLd } from "@/lib/seo";

const Wellness = () => {
  const wellnessArticles = articles.filter(article =>
    article.category.toLowerCase() === "wellness"
  );

  useSEO({
    title: "Wellness & Self-Care",
    description:
      "Practices, insights, and strategies to nurture your physical, mental, and emotional wellbeing. Explore mindful routines and holistic health approaches for balanced living.",
    path: "/wellness",
    jsonLd: jsonLd.collectionPage({
      name: "Wellness & Self-Care",
      description:
        "Practices and insights to nurture your physical, mental, and emotional wellbeing.",
      path: "/wellness",
      itemCount: wellnessArticles.length,
    }),
  });

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />

      <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-down">
            Wellness & Self-Care
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Discover practices, insights, and strategies to nurture your physical, mental, and emotional wellbeing.
            From mindful routines to holistic health approaches, explore ways to create balance and vitality in your daily life.
          </p>
        </div>

        {/* Articles Grid */}
        <section aria-label="Wellness articles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wellnessArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 2, 6)}`}>
                <ArticleCard {...article} />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Content */}
        <section className="mt-16 rounded-2xl bg-card p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why Wellness Matters</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Wellness is not just about physical health—it's about creating harmony between body, mind, and spirit.
                In our fast-paced world, taking time to nurture ourselves isn't a luxury; it's essential for sustainable living.
              </p>
              <p>
                Through thoughtful self-care practices, we can build resilience, improve our relationships, enhance our
                productivity, and ultimately, live more fulfilling lives. Whether it's through nutrition, movement,
                meditation, or simply learning to rest, every small step toward wellness counts.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Wellness;
