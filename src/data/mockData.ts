// Mock data for the news platform

export interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  image: string;
  summary: string;
  content: string;
  featured: boolean;
  status: "published" | "draft" | "scheduled";
}

export const categories = [
  "Politics",
  "Technology",
  "Business",
  "Sports",
  "Culture",
  "Science",
  "World",
  "Opinion",
] as const;

export const mockArticles: Article[] = [
  {
    id: 1,
    title:
      "Global Climate Summit Reaches Historic Agreement on Carbon Emissions",
    slug: "climate-summit-historic-agreement",
    category: "World",
    author: "Sarah Mitchell",
    publishDate: "2025-11-04",
    readTime: 8,
    image:
      "https://images.unsplash.com/photo-1569016832321-084c128adeb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY29uZmVyZW5jZXxlbnwxfHx8fDE3NjIyMjAxNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "World leaders have agreed to binding carbon reduction targets in a landmark deal that many are calling the most significant climate action in decades.",
    content:
      "In a historic moment for global environmental policy, representatives from 195 nations have signed a comprehensive agreement at the World Climate Summit...",
    featured: true,
    status: "published",
  },
  {
    id: 2,
    title: "AI Breakthrough: New Model Achieves Human-Level Reasoning",
    slug: "ai-breakthrough-human-reasoning",
    category: "Technology",
    author: "Marcus Chen",
    publishDate: "2025-11-03",
    readTime: 6,
    image:
      "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIxNTQ3NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "Researchers unveil an AI system that demonstrates unprecedented reasoning capabilities across multiple domains.",
    content:
      "A team of researchers has developed an artificial intelligence system that represents a major leap forward in machine reasoning...",
    featured: false,
    status: "published",
  },
  {
    id: 3,
    title: "Stock Markets Hit Record Highs Amid Economic Recovery",
    slug: "stock-markets-record-highs",
    category: "Business",
    author: "Jennifer Rodriguez",
    publishDate: "2025-11-03",
    readTime: 5,
    image:
      "https://images.unsplash.com/photo-1651341050677-24dba59ce0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHRyYWRpbmd8ZW58MXx8fHwxNzYyMjA5ODY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "Major indices close at all-time highs as investors show renewed confidence in the economic outlook.",
    content:
      "Global stock markets surged to record levels today, with the S&P 500 and other major indices closing at all-time highs...",
    featured: false,
    status: "published",
  },
  {
    id: 4,
    title: "Championship Final: Underdog Team Stuns Favorites in Overtime",
    slug: "championship-underdog-victory",
    category: "Sports",
    author: "David Park",
    publishDate: "2025-11-02",
    readTime: 7,
    image:
      "https://images.unsplash.com/photo-1721775385155-f82101e6e809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjaGFtcGlvbnNoaXAlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjIyMjAxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "In one of the most dramatic finishes in championship history, the fifth-seeded team defeats the top-ranked favorites.",
    content:
      "In a game that will be remembered for generations, the underdogs pulled off one of the greatest upsets in sports history...",
    featured: false,
    status: "published",
  },
  {
    id: 5,
    title:
      "New Breakthrough in Quantum Computing Could Revolutionize Encryption",
    slug: "quantum-computing-breakthrough",
    category: "Technology",
    author: "Dr. Amanda Foster",
    publishDate: "2025-11-02",
    readTime: 9,
    image:
      "https://images.unsplash.com/photo-1681908571122-97f349e1ace0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzYyMjIwMTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "Scientists achieve stable quantum states at room temperature, opening new possibilities for practical quantum computers.",
    content:
      "A groundbreaking achievement in quantum computing has brought the technology one step closer to mainstream adoption...",
    featured: false,
    status: "published",
  },
  {
    id: 6,
    title: "Congress Debates Sweeping Healthcare Reform Legislation",
    slug: "healthcare-reform-legislation",
    category: "Politics",
    author: "Michael Thompson",
    publishDate: "2025-11-01",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1573181759662-1c146525b21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyMDk1NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "Lawmakers engage in heated debate over proposed changes to the national healthcare system.",
    content:
      "The halls of Congress echoed with passionate debate today as lawmakers considered comprehensive healthcare reform...",
    featured: false,
    status: "published",
  },
  {
    id: 7,
    title: "Major Film Studio Announces Shift to Sustainable Production",
    slug: "sustainable-film-production",
    category: "Culture",
    author: "Elena Martinez",
    publishDate: "2025-11-01",
    readTime: 6,
    image:
      "https://images.unsplash.com/photo-1695014192231-18462db3ebde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcHJvZHVjdGlvbiUyMHNldHxlbnwxfHx8fDE3NjIxNjAzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "Hollywood embraces green initiatives with commitment to carbon-neutral productions by 2030.",
    content:
      "In a move that could reshape the entertainment industry, one of the largest film studios has announced ambitious sustainability goals...",
    featured: false,
    status: "published",
  },
  {
    id: 8,
    title: "Mars Rover Discovers Evidence of Ancient Water System",
    slug: "mars-rover-water-discovery",
    category: "Science",
    author: "Dr. Robert Kim",
    publishDate: "2025-10-31",
    readTime: 8,
    image:
      "https://images.unsplash.com/photo-1571769267292-e24dfadebbdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwc3VyZmFjZXxlbnwxfHx8fDE3NjIyMjAxNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "NASA's latest rover sends back images suggesting Mars once had extensive river networks.",
    content:
      "NASA scientists are analyzing extraordinary images from the Mars rover that appear to show evidence of ancient river systems...",
    featured: false,
    status: "published",
  },
  {
    id: 9,
    title: "Tech Giants Face New Antitrust Regulations in European Union",
    slug: "tech-antitrust-regulations-eu",
    category: "Business",
    author: "Sophie Dubois",
    publishDate: "2025-10-31",
    readTime: 7,
    image:
      "https://images.unsplash.com/photo-1656354250991-e26492fc159e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMHVuaW9uJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyMjIwMTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "New legislation aims to curb the dominance of major technology companies in digital markets.",
    content:
      "The European Union has unveiled comprehensive new regulations targeting the market power of large technology companies...",
    featured: false,
    status: "published",
  },
  {
    id: 10,
    title:
      "The Rise of Regional Cuisine: How Local Chefs Are Redefining Fine Dining",
    slug: "regional-cuisine-fine-dining",
    category: "Culture",
    author: "James O'Brien",
    publishDate: "2025-10-30",
    readTime: 11,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjIxNTEwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "A new generation of chefs is celebrating local ingredients and traditional cooking methods.",
    content:
      "The fine dining world is experiencing a quiet revolution as chefs increasingly turn to regional ingredients and traditional techniques...",
    featured: false,
    status: "published",
  },
  {
    id: 11,
    title: "Election Results: Reformist Party Gains Majority in Historic Vote",
    slug: "election-reformist-party-victory",
    category: "Politics",
    author: "Catherine Walsh",
    publishDate: "2025-10-30",
    readTime: 9,
    image:
      "https://images.unsplash.com/photo-1605699717386-9ae92ea7364b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b3RpbmclMjBlbGVjdGlvbnxlbnwxfHx8fDE3NjIxNjAxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "Voters deliver decisive mandate for change as reformist candidates sweep national elections.",
    content:
      "In what analysts are calling a transformative moment in national politics, reformist candidates have secured a commanding majority...",
    featured: false,
    status: "published",
  },
  {
    id: 12,
    title: "Olympic Athlete Breaks 30-Year-Old World Record",
    slug: "olympic-world-record-broken",
    category: "Sports",
    author: "Lisa Anderson",
    publishDate: "2025-10-29",
    readTime: 5,
    image:
      "https://images.unsplash.com/photo-1728060560980-e39712526b7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbHltcGljJTIwYXRobGV0aWNzfGVufDF8fHx8MTc2MjIyMDE2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    summary:
      "Track and field star shatters longstanding record in stunning performance.",
    content:
      "The sporting world witnessed history today as an Olympic athlete broke a world record that has stood for three decades...",
    featured: false,
    status: "published",
  },
];

export const dashboardStats = {
  totalArticles: 347,
  publishedToday: 12,
  drafts: 23,
  totalViews: 2847563,
  weeklyViews: 485920,
  averageReadTime: 6.8,
  topCategory: "Politics",
};

export const recentActivity = [
  {
    action: "Article Published",
    title: "Global Climate Summit Reaches Historic Agreement",
    time: "2 hours ago",
  },
  {
    action: "New Draft",
    title: "Emerging Trends in Renewable Energy",
    time: "4 hours ago",
  },
  {
    action: "Article Updated",
    title: "AI Breakthrough: New Model Achieves Human-Level Reasoning",
    time: "6 hours ago",
  },
  {
    action: "Article Scheduled",
    title: "The Future of Urban Planning",
    time: "1 day ago",
  },
];
