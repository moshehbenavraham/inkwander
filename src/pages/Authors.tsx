import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Mail } from "lucide-react";
import { useSEO } from "@/lib/seo";

const Authors = () => {
  const authors = [
    {
      name: "Emma Thompson",
      role: "Wellness Editor",
      bio: "Emma is a certified wellness coach and nutritionist with over 10 years of experience helping people create sustainable self-care practices. She believes in holistic approaches to health that honor both body and mind.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
      articles: 24,
    },
    {
      name: "Marcus Chen",
      role: "Travel Writer",
      bio: "Having visited over 60 countries, Marcus specializes in slow travel and cultural immersion. His writing explores how travel can be both transformative and sustainable, emphasizing meaningful connection over tourist checklists.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      articles: 31,
    },
    {
      name: "Sofia Rodriguez",
      role: "Creativity Columnist",
      bio: "Sofia is a multidisciplinary artist and creative consultant who helps individuals and teams unlock their creative potential. She's passionate about making creativity accessible to everyone, not just 'artists.'",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      articles: 19,
    },
    {
      name: "David Kim",
      role: "Personal Growth Writer",
      bio: "David combines insights from psychology, philosophy, and personal experience to explore what it means to live intentionally. His thoughtful approach to growth emphasizes progress over perfection.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
      articles: 27,
    },
  ];

  useSEO({
    title: "Meet Our Authors",
    description:
      "The voices behind Perspective—experienced writers, practitioners, and thoughtful explorers bringing diverse insights to wellness, travel, creativity, and growth.",
    path: "/authors",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: authors.map((author, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          description: author.bio,
          image: author.image,
        },
      })),
    },
  });

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />

      <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-down">
            Meet Our Authors
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            The voices behind Perspective—experienced writers, practitioners, and thoughtful explorers
            who bring diverse perspectives and genuine insights to every article.
          </p>
        </div>

        {/* Authors Grid */}
        <section className="grid md:grid-cols-2 gap-8 mb-16" aria-label="Authors">
          {authors.map((author, index) => (
            <div key={author.name} className={`rounded-2xl bg-card p-8 hover:shadow-xl transition-all duration-300 animate-slide-up stagger-${Math.min(index + 2, 6)}`}>
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-24 h-24 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">{author.name}</h3>
                  <p className="text-accent font-medium mb-3">{author.role}</p>
                  <p className="text-sm text-muted-foreground">{author.articles} articles published</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {author.bio}
              </p>
              {/*
                Previously each author card rendered Mail, Twitter, and Instagram
                icons — all three pointed at /contact regardless of which icon
                you clicked, which is misleading at best (visitors think they're
                going to that author's Twitter profile) and a dead link at worst.
                Authors don't have per-person social handles in the data, so we
                ship a single, honest "Contact author" link instead.
              */}
              <Link
                to="/contact"
                state={{ author: author.name }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-muted transition-all text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Contact ${author.name}`}
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Contact {author.name.split(" ")[0]}</span>
              </Link>
            </div>
          ))}
        </section>

        {/* Join Section */}
        <section className="text-center py-12 rounded-2xl bg-muted">
          <h2 className="text-3xl font-bold mb-4">Want to Contribute?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for thoughtful voices to join our community. If you have insights
            to share on wellness, travel, creativity, or personal growth, we'd love to hear from you.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
          >
            Get in Touch
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Authors;
