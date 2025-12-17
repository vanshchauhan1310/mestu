"use client"

import { useState, useEffect } from "react"
import ArticleDetail from "./article-detail"

interface ContentHubProps {
  user: any
}

const ARTICLES_DATA = {
  basics: [
    {
      id: 1,
      title: "Understanding Your Menstrual Cycle",
      category: "Basics",
      readTime: "5 min",
      excerpt: "Learn about the four phases of your cycle and what happens in each phase.",
      content:
        "Your menstrual cycle is a monthly process that prepares your body for pregnancy. It typically lasts about 28 days, though it can range from 21 to 35 days. The cycle has four main phases: menstruation, follicular, ovulation, and luteal. During menstruation, the uterine lining sheds. The follicular phase is when estrogen rises and follicles develop. Ovulation is when an egg is released. The luteal phase is when progesterone rises after ovulation.",
      keyPoints: [
        "Average cycle length is 28 days but can vary",
        "Four distinct phases with different hormonal patterns",
        "Tracking your cycle helps identify patterns",
        "Cycle length can change due to stress, diet, and exercise",
      ],
      resources: ["American College of Obstetricians and Gynecologists", "Mayo Clinic - Menstrual Cycle"],
    },
    {
      id: 2,
      title: "Nutrition for Menstrual Health",
      category: "Nutrition",
      readTime: "7 min",
      excerpt: "Discover which foods support your health throughout your cycle.",
      content:
        "Nutrition plays a crucial role in managing menstrual health. Different phases of your cycle have different nutritional needs. During menstruation, focus on iron-rich foods to replace lost blood. In the follicular phase, eat foods rich in estrogen-supporting nutrients. During ovulation, antioxidants are important. In the luteal phase, increase magnesium and complex carbohydrates. Staying hydrated throughout your cycle is essential for managing symptoms.",
      keyPoints: [
        "Iron-rich foods during menstruation (spinach, lentils, red meat)",
        "Magnesium helps reduce PMS symptoms",
        "Omega-3 fatty acids reduce inflammation",
        "Hydration is crucial for symptom management",
        "Limit caffeine and sugar during luteal phase",
      ],
      resources: ["Academy of Nutrition and Dietetics", "Journal of the International Society of Sports Nutrition"],
    },
    {
      id: 3,
      title: "Exercise and Your Cycle",
      category: "Fitness",
      readTime: "6 min",
      excerpt: "How to adjust your workout routine based on your cycle phase.",
      content:
        "Adjusting your exercise routine to match your menstrual cycle can improve performance and reduce injury risk. During menstruation and early follicular phase, focus on gentle, restorative exercises. As estrogen rises in the follicular phase, you can increase intensity. During ovulation, you have peak strength and endurance. In the luteal phase, moderate exercise is best as energy levels decline. Listen to your body and adjust as needed.",
      keyPoints: [
        "Menstrual phase: gentle yoga, walking, stretching",
        "Follicular phase: increase intensity, strength training",
        "Ovulation: peak performance, HIIT workouts",
        "Luteal phase: moderate intensity, recovery focus",
      ],
      resources: ["Sports Medicine Journal", "Cycle Syncing Research"],
    },
  ],
  conditions: [
    {
      id: 4,
      title: "PCOS: Symptoms and Diagnosis",
      category: "PCOS",
      readTime: "8 min",
      excerpt: "Understanding PCOS and how it affects your menstrual health.",
      content:
        "Polycystic Ovary Syndrome (PCOS) is a hormonal disorder affecting people with ovaries. It's characterized by irregular periods, excess androgen levels, and polycystic ovaries. Symptoms include irregular or missed periods, heavy bleeding, hair growth, acne, and weight gain. PCOS is diagnosed through a combination of symptoms, blood tests, and ultrasound. It affects about 1 in 10 people of reproductive age. While there's no cure, symptoms can be managed through lifestyle changes and medication.",
      keyPoints: [
        "PCOS affects 1 in 10 people of reproductive age",
        "Diagnosed through symptoms, blood tests, and ultrasound",
        "Irregular periods are a common symptom",
        "Insulin resistance is often present",
        "Lifestyle changes can significantly improve symptoms",
      ],
      resources: ["American College of Obstetricians and Gynecologists - PCOS", "PCOS Awareness Association"],
    },
    {
      id: 5,
      title: "Endometriosis: What You Need to Know",
      category: "Endometriosis",
      readTime: "9 min",
      excerpt: "A comprehensive guide to understanding endometriosis.",
      content:
        "Endometriosis is a condition where tissue similar to the uterine lining grows outside the uterus. It affects about 10% of people with ovaries. Symptoms include severe period pain, heavy bleeding, pain during intercourse, and infertility. The condition can affect the ovaries, fallopian tubes, and other pelvic organs. Diagnosis typically involves ultrasound or laparoscopy. Treatment options include pain management, hormonal therapy, and surgery. Early diagnosis and treatment can improve quality of life.",
      keyPoints: [
        "Affects about 10% of people with ovaries",
        "Severe period pain is a hallmark symptom",
        "Can impact fertility",
        "Multiple treatment options available",
        "Support groups and resources are valuable",
      ],
      resources: ["Endometriosis Association", "Mayo Clinic - Endometriosis"],
    },
    {
      id: 6,
      title: "Dysmenorrhea: Managing Severe Period Pain",
      category: "Pain Management",
      readTime: "7 min",
      excerpt: "Understanding and managing severe menstrual cramps.",
      content:
        "Dysmenorrhea refers to severe menstrual pain that interferes with daily activities. Primary dysmenorrhea is caused by uterine contractions, while secondary dysmenorrhea is caused by underlying conditions. Pain typically starts 1-2 days before your period and lasts 2-3 days. Treatment includes over-the-counter pain relievers, heat therapy, exercise, and lifestyle changes. If pain is severe, consult a healthcare provider to rule out underlying conditions.",
      keyPoints: [
        "Primary dysmenorrhea is caused by uterine contractions",
        "Secondary dysmenorrhea may indicate underlying conditions",
        "NSAIDs are effective for pain management",
        "Heat therapy provides relief",
        "Regular exercise can reduce pain severity",
      ],
      resources: ["American College of Obstetricians and Gynecologists", "Pain Management Resources"],
    },
  ],
  myths: [
    {
      id: 7,
      title: "Myth: You Can't Get Pregnant During Your Period",
      category: "Myth Busting",
      readTime: "4 min",
      excerpt: "The truth about pregnancy risk during menstruation.",
      content:
        "This is a common myth, but it's not entirely accurate. While pregnancy is less likely during menstruation, it is still possible. Sperm can survive for up to 5 days, and if you have a shorter cycle or longer period, ovulation could occur soon after your period ends. If you're trying to avoid pregnancy, use contraception consistently throughout your cycle.",
      keyPoints: [
        "Pregnancy is possible during menstruation",
        "Sperm can survive for up to 5 days",
        "Shorter cycles increase pregnancy risk during period",
        "Use contraception consistently if avoiding pregnancy",
      ],
      resources: ["Planned Parenthood", "American College of Obstetricians and Gynecologists"],
    },
    {
      id: 8,
      title: "Myth: PMS Isn't Real",
      category: "Myth Busting",
      readTime: "5 min",
      excerpt: "Understanding the science behind premenstrual syndrome.",
      content:
        "PMS is very real and affects about 85% of menstruating people. It's caused by hormonal fluctuations during the luteal phase. Symptoms can include mood changes, bloating, fatigue, and food cravings. PMDD (Premenstrual Dysphoric Disorder) is a severe form affecting about 5-8% of people. Both PMS and PMDD are recognized medical conditions with evidence-based treatments.",
      keyPoints: [
        "PMS affects about 85% of menstruating people",
        "Caused by hormonal fluctuations",
        "PMDD is a severe form requiring treatment",
        "Multiple treatment options available",
        "Lifestyle changes can help manage symptoms",
      ],
      resources: ["American Psychiatric Association", "Mayo Clinic - PMS"],
    },
  ],
  faq: [
    {
      id: 9,
      title: "FAQ: Is It Normal to Have Irregular Periods?",
      category: "FAQ",
      readTime: "4 min",
      excerpt: "When irregular periods are normal and when to see a doctor.",
      content:
        "Some variation in cycle length is normal, especially during puberty and perimenopause. However, significant changes in your cycle may warrant a doctor's visit. Consult a healthcare provider if your periods become very irregular, stop for more than 3 months, or if you experience other concerning symptoms. Stress, diet, exercise, and certain medications can affect cycle regularity.",
      keyPoints: [
        "Cycle variation of 21-35 days is normal",
        "Stress can affect cycle regularity",
        "Significant changes warrant medical evaluation",
        "Hormonal birth control affects cycle patterns",
      ],
      resources: ["Mayo Clinic", "American College of Obstetricians and Gynecologists"],
    },
    {
      id: 10,
      title: "FAQ: When Should I See a Gynecologist?",
      category: "FAQ",
      readTime: "5 min",
      excerpt: "Guidelines for when to schedule a gynecological appointment.",
      content:
        "It's recommended to have your first gynecological exam between ages 18-21, or when you become sexually active. After that, annual exams are typically recommended. See a gynecologist sooner if you experience severe pain, heavy bleeding, irregular periods, or other concerning symptoms. Don't hesitate to reach out if you have questions about your menstrual health.",
      keyPoints: [
        "First exam between 18-21 years old",
        "Annual exams are typically recommended",
        "Seek care for severe symptoms",
        "Open communication with your provider is important",
      ],
      resources: ["American College of Obstetricians and Gynecologists", "Planned Parenthood"],
    },
  ],
}

export default function ContentHub({ user }: ContentHubProps) {
  const [selectedCategory, setSelectedCategory] = useState("basics")
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("saukhya_favorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const toggleFavorite = (articleId: number) => {
    const updated = favorites.includes(articleId)
      ? favorites.filter((id) => id !== articleId)
      : [...favorites, articleId]
    setFavorites(updated)
    localStorage.setItem("saukhya_favorites", JSON.stringify(updated))
  }

  const allArticles = Object.values(ARTICLES_DATA).flat()
  const filteredArticles =
    selectedCategory === "favorites"
      ? allArticles.filter((a) => favorites.includes(a.id))
      : selectedCategory === "search"
        ? allArticles.filter(
            (a) =>
              a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : ARTICLES_DATA[selectedCategory as keyof typeof ARTICLES_DATA] || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Educational Content Hub</h2>
        <p className="text-muted-foreground">Evidence-based information about menstrual health</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (e.target.value) setSelectedCategory("search")
          }}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-3 overflow-x-auto pb-2">
        {[
          { id: "basics", label: "Basics" },
          { id: "conditions", label: "Conditions" },
          { id: "myths", label: "Myth Busting" },
          { id: "faq", label: "FAQ" },
          { id: "favorites", label: `Favorites (${favorites.length})` },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id)
              setSearchQuery("")
            }}
            className={`px-4 py-2 rounded-full font-semibold transition-smooth whitespace-nowrap ${
              selectedCategory === category.id ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No articles found. Try a different search or category.</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-smooth cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(article.id)
                  }}
                  className={`text-lg transition-smooth ${
                    favorites.includes(article.id) ? "text-accent-red" : "text-muted-foreground hover:text-accent-red"
                  }`}
                >
                  {favorites.includes(article.id) ? "★" : "☆"}
                </button>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{article.excerpt}</p>
              <p className="text-xs text-muted-foreground">{article.readTime} read</p>
            </div>
          ))
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isFavorite={favorites.includes(selectedArticle.id)}
          onToggleFavorite={() => toggleFavorite(selectedArticle.id)}
        />
      )}
    </div>
  )
}
