"use client";
import { useEffect, useState, Suspense } from "react";
import { Star, LayoutDashboard, Compass, FilePlus, Settings, FolderOpen, BookOpen, ClipboardList, Users, Upload, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { rawToDash } from "@/lib/roles";
import { addArticleComment, formatArticleDate, getArticle, listArticleComments, submitReview, type ArticleComment, type ArticleWithAuthor } from "@/lib/supabase/articles";
import { getCurrentProfile } from "@/lib/supabase/profile";

function Stars({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i=>(
        <Star key={i} size={size} fill={i<=n?"#F97316":"none"} className={i<=n?"text-[#F97316]":"text-gray-300"}/>
      ))}
    </span>
  );
}

const FALLBACK_COMMENTS = Array(4).fill(null).map((_,i)=>({
  id: String(i),
  article_id: "",
  user_id: "",
  author_name:"Shaivya S.",
  created_at:"2023-10-02",
  quality_rating: i%2===0?5:4,
  body:"Lorem ipsum dolor Lorem ipsum dolor",
  attachment_path: null,
  reward_amount: null,
  reward_currency: null,
}));

const WRITER_TOOLS = [
  { label:"Readability", desc:"Check reading ease score" },
  { label:"Grammar",     desc:"Detect grammar issues" },
  { label:"AI",          desc:"AI writing suggestions" },
  { label:"Plagiarism",  desc:"Check for originality" },
  { label:"WPS",         desc:"Words per sentence" },
  { label:"SPP",         desc:"Sentences per paragraph" },
  { label:"RW",          desc:"Readability wizard" },
];

const QUALITY_DIMS = [
  { label:"Clarity",   desc:"Is the writing clear and easy to follow?" },
  { label:"Depth",     desc:"Does it cover the topic thoroughly?" },
  { label:"Accuracy",  desc:"Are the facts and claims correct?" },
  { label:"Relevance", desc:"Is the content relevant to the domain?" },
  { label:"Sources",   desc:"Are sources cited and credible?" },
  { label:"Balance",   desc:"Are multiple viewpoints considered?" },
  { label:"Insight",   desc:"Does it add new perspectives?" },
];

const NAV_BY_ROLE: Record<string, { label:string; href:string; icon:React.ComponentType<{size?:number;strokeWidth?:number}> }[]> = {
  writer: [
    { label:"Dashboard", href:"/dashboard/writer",           icon:LayoutDashboard },
    { label:"Explore",   href:"/dashboard/writer/explore",   icon:Compass },
    { label:"Create",    href:"/dashboard/writer/create",    icon:FilePlus },
    { label:"Portfolio", href:"/dashboard/writer/portfolio", icon:FolderOpen },
    { label:"Settings",  href:"/dashboard/writer/settings",  icon:Settings },
  ],
  reader: [
    { label:"Dashboard",    href:"/dashboard/reader",              icon:LayoutDashboard },
    { label:"Explore",      href:"/explore",                       icon:Compass },
    { label:"Reading List", href:"/dashboard/reader/reading-list", icon:BookOpen },
    { label:"Settings",     href:"/dashboard/reader/settings",     icon:Settings },
  ],
  "subject-expert": [
    { label:"Dashboard", href:"/dashboard/subject-expert",           icon:LayoutDashboard },
    { label:"Explore",   href:"/dashboard/subject-expert/explore",   icon:Compass },
    { label:"Portfolio", href:"/dashboard/subject-expert/portfolio", icon:FolderOpen },
    { label:"Settings",  href:"/dashboard/subject-expert/settings",  icon:Settings },
  ],
  business: [
    { label:"Dashboard",  href:"/dashboard/business",            icon:LayoutDashboard },
    { label:"Commission", href:"/dashboard/business/commission", icon:ClipboardList },
    { label:"Writers",    href:"/dashboard/business/writers",    icon:Users },
    { label:"Settings",   href:"/dashboard/business/settings",   icon:Settings },
  ],
};

const FALLBACK_ARTICLE: ArticleWithAuthor = {
  id: "fallback",
  author_id: "",
  commission_id: null,
  domain_name: "Technology",
  title: "The World's Most Dangerous Technology Ever Made.",
  slug: "fallback",
  excerpt: null,
  body: "Commodo labore ut nisi laborum amet eu qui magna ullamco ut labore. Aliquip consectetur labore consectetur dolor exercitation est minim quis.\n\nNisi commodo qui pariatur enim sint laborum consequat enim in officia. Officia fugiat incididunt commodo et mollit aliqua non aute.\n\nEst Lorem consectetur minim sit eu eiusmod mollit velit. Consectetur voluptate ex amet id eiusmod laborum irure.",
  tags: ["#technology", "#tech", "#career"],
  status: "published",
  word_count: 600,
  read_time_minutes: 10,
  submitted_at: null,
  published_at: "2019-05-07",
  created_at: "2019-05-07",
  updated_at: "2019-05-07",
  author_name: "Ralph Hawkins",
  author_domain: "Technology",
};

function ArticlePageInner() {
  const [comment, setComment] = useState("");
  const [role, setRole] = useState("reader");
  const [userId, setUserId] = useState("");
  const [article, setArticle] = useState<ArticleWithAuthor>(FALLBACK_ARTICLE);
  const [comments, setComments] = useState<ArticleComment[]>(FALLBACK_COMMENTS);
  const [activeTool, setActiveTool] = useState<string|null>(null);
  const [activeDim, setActiveDim] = useState<string|null>(null);
  const [dimRatings, setDimRatings] = useState<Record<string,number>>({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [notice, setNotice] = useState("");

  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const isOwnArticleParam = searchParams.get("own") === "1";

  useEffect(()=>{
    let alive = true;
    getCurrentProfile()
      .then(({ user, profile }) => {
        if (!alive) return;
        setUserId(user?.id ?? "");
        setRole(rawToDash(profile?.role ?? "Reader"));
      })
      .catch(() => setRole("reader"));

    getArticle(params.slug)
      .then(row => {
        if (!alive || !row) return;
        setArticle(row);
        return listArticleComments(row.id);
      })
      .then(rows => {
        if (alive && rows?.length) setComments(rows);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [params.slug]);

  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.reader;
  const isWriterOwner = role === "writer" && (isOwnArticleParam || article.author_id === userId);
  const isSME = role === "subject-expert" && article.status !== "draft";
  const showPanel = isWriterOwner || isSME;

  const rateDim = (label: string, score: number) => {
    setDimRatings(prev => ({ ...prev, [label]: score }));
    setActiveDim(label);
  };

  const allRated = QUALITY_DIMS.every(d => dimRatings[d.label]);

  const handleReviewSubmit = async () => {
    if (!allRated) return;
    setNotice("");
    try {
      await submitReview({ articleId: article.id, ratings: dimRatings, decision: "approved" });
      setReviewSubmitted(true);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Unable to submit review.");
    }
  };

  const handleCommentSubmit = async () => {
    const body = comment.trim();
    if (!body || article.id === "fallback") return;
    setNotice("");
    try {
      await addArticleComment({ articleId: article.id, body, qualityRating: 5 });
      const rows = await listArticleComments(article.id);
      setComments(rows.length ? rows : comments);
      setComment("");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Unable to add comment.");
    }
  };

  const bodyParagraphs = article.body.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

  return (
    <div className="flex min-h-screen bg-white flex-col">
      <div className="flex flex-1">
        <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[60px] bg-[#0A0A0A] flex-col items-center z-20 rounded-r-2xl py-5 gap-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} title={label}
              className="text-gray-500 hover:text-white transition-colors p-2.5 rounded-xl hover:bg-white/5 w-full flex justify-center">
              <Icon size={17} strokeWidth={1.5}/>
            </Link>
          ))}
        </aside>

        <main className="md:ml-[60px] flex-1 w-full">
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3 leading-tight">
              {article.title}
            </h1>
            <div className="text-center mb-1">
              <p className="text-xs text-gray-400">
                {article.author_name} · {formatArticleDate(article.published_at ?? article.created_at)} ·{" "}
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
                  {article.read_time_minutes} mins read
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{article.tags.join(" ")}</p>
            </div>

            {showPanel && (
              <div className="bg-[#1A1A1A] rounded-2xl p-5 mb-6 mt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {isWriterOwner && (
                    <>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold mb-1">Suggested Keywords</p>
                        <p className="text-gray-400 text-xs mb-3">{article.tags.join(" ")}</p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-semibold">Writing Tools</p>
                        <div className="flex flex-wrap gap-2">
                          {WRITER_TOOLS.map(tool => (
                            <button key={tool.label}
                              onClick={()=>setActiveTool(activeTool===tool.label?null:tool.label)}
                              title={tool.desc}
                              className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                                activeTool===tool.label
                                  ? "bg-white text-black border-white"
                                  : "bg-[#2a2a2a] text-gray-300 border-white/10 hover:border-white/40 hover:text-white"
                              }`}>
                              {tool.label}
                            </button>
                          ))}
                        </div>
                        {activeTool && (
                          <p className="text-gray-500 text-xs mt-2">
                            {WRITER_TOOLS.find(t=>t.label===activeTool)?.desc}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 min-w-[130px] sm:text-right">
                        <p className="text-white text-xs font-semibold mb-1">Engagement</p>
                        <p className="text-white text-4xl font-bold">{comments.length}</p>
                        <p className="text-gray-400 text-xs mt-1">reader comments</p>
                      </div>
                    </>
                  )}

                  {isSME && (
                    <div className="flex-1">
                      {reviewSubmitted ? (
                        <div className="flex flex-col items-center justify-center py-4 gap-2">
                          <CheckCircle size={28} className="text-green-400"/>
                          <p className="text-white text-sm font-semibold">Review Submitted</p>
                          <p className="text-gray-400 text-xs">Your assessment has been recorded.</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-white text-sm font-semibold mb-1">Review Assessment</p>
                          <p className="text-gray-400 text-xs mb-4">Rate each quality dimension. Click a dimension to see what it means.</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            {QUALITY_DIMS.map(dim => (
                              <div key={dim.label}
                                onClick={() => setActiveDim(activeDim===dim.label?null:dim.label)}
                                className={`rounded-xl p-3 border cursor-pointer transition-all select-none ${
                                  activeDim===dim.label ? "border-white/30 bg-[#2a2a2a]" : "border-white/10 bg-[#222] hover:border-white/20"
                                }`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white text-xs font-medium">{dim.label}</span>
                                  <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(s => (
                                      <button key={s} onClick={e=>{e.stopPropagation(); rateDim(dim.label, s);}}
                                        className="cursor-pointer transition-transform hover:scale-110">
                                        <Star size={11}
                                          fill={(dimRatings[dim.label]??0)>=s?"#F97316":"none"}
                                          className={(dimRatings[dim.label]??0)>=s?"text-[#F97316]":"text-gray-600"}/>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                {activeDim===dim.label && (
                                  <p className="text-gray-500 text-[11px]">{dim.desc}</p>
                                )}
                              </div>
                            ))}
                          </div>
                          <button
                            disabled={!allRated}
                            onClick={handleReviewSubmit}
                            className={`text-xs font-semibold px-5 py-2.5 rounded-xl transition-all ${
                              allRated
                                ?"bg-white text-black hover:bg-gray-100 cursor-pointer"
                                :"bg-[#2a2a2a] text-gray-600 cursor-not-allowed"
                            }`}>
                            {allRated?"Submit Review":`Rate all dimensions to submit (${Object.keys(dimRatings).length}/${QUALITY_DIMS.length})`}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {notice && <p className="text-xs text-center text-red-500 mb-4">{notice}</p>}

            <div className={`w-full h-56 md:h-72 bg-gradient-to-br from-gray-700 to-gray-500 rounded-2xl mb-8 overflow-hidden flex items-center justify-center ${showPanel ? "" : "mt-6"}`}>
              <span className="text-white/30 text-lg font-medium">Article Hero Image</span>
            </div>

            <div className="text-sm text-gray-700 leading-loose space-y-5">
              {bodyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">About the Author</p>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex-shrink-0"/>
                <div>
                  <p className="font-bold text-gray-900 mb-0.5">{article.author_name}</p>
                  <p className="text-gray-400 text-xs mb-2">{article.author_domain}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{article.excerpt ?? "Writer on Stick&Dot."}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Comments</h2>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Add a Comment</h3>
                <div className="border-b border-gray-200 pb-2 mb-4 flex items-center justify-between">
                  <input type="text" value={comment}
                    onChange={e=>setComment(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") void handleCommentSubmit(); }}
                    placeholder="Type your Comment"
                    className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300"/>
                  <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Upload size={12}/> Upload
                  </button>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Name","Date Created","Quality","Comments"].map(h=>(
                      <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comments.map(c=>(
                    <tr key={c.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex-shrink-0"/>
                          <span className="text-sm text-gray-700">{c.author_name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-500">{formatArticleDate(c.created_at)}</td>
                      <td className="py-3"><Stars n={c.quality_rating ?? 5}/></td>
                      <td className="py-3 text-sm text-gray-400">{c.body}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"/>}>
      <ArticlePageInner/>
    </Suspense>
  );
}
