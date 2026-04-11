"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Star, Upload } from "lucide-react";

const COMMENTS = [
  { name: "Shaivya S.", date: "10/2/2023", quality: 4, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { name: "Shaivya S.", date: "10/3/2023", quality: 5, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { name: "Shaivya S.", date: "10/3/2023", quality: 3, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { name: "Shaivya S.", date: "10/4/2023", quality: 4, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { name: "Shaivya S.", date: "10/5/2023", quality: 5, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { name: "Shaivya S.", date: "10/6/2023", quality: 4, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { name: "Shaivya S.", date: "10/7/2023", quality: 4, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12}
          fill={i <= count ? "#F97316" : "none"}
          className={i <= count ? "text-[#F97316]" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function ArticlePage() {
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl">
        {/* Article header */}
        <div className="bg-white rounded-2xl p-8 mb-5 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            The World&apos;s Most Dangerous Technology Ever Made.
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-6">
            <span>Aditit Andreini — May 3, 2023 • 5 min read</span>
            <span>Writing With Accorin</span>
          </div>

          {/* Suggested Keywords & Engagement overlay card */}
          <div className="bg-[#1A1A1A] rounded-2xl p-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white text-xs font-semibold mb-2">Suggested Keywords</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {["Automation","Artificial","Reasoning","Algorithms"].map(k => (
                    <span key={k} className="bg-[#2a2a2a] text-gray-300 text-xs px-3 py-1 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-xs font-semibold mb-1">Engagement</p>
                <p className="text-white text-3xl font-bold">24K</p>
                <p className="text-gray-400 text-xs">3,500 contributions in the last year</p>
                <svg width="120" height="30" viewBox="0 0 120 30" className="mt-1">
                  <polyline points="0,25 20,20 40,22 60,10 80,14 100,8 120,5"
                    stroke="#4ade80" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="w-full h-52 bg-gradient-to-br from-gray-800 to-gray-600 rounded-xl mb-6"/>

          {/* Article body */}
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4 text-sm">
            <p>Curabitur laoreet mi id dui magna aliquam ut. Aliquip con nec labore commodo consectetur dolar. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Nisi commodo qui pariatur am sint laboris consequat seisin in offici. Officio iuste occidunt commodo in mollit aliqua from work. Esse enim magna exercitation ullamco amet quis enim. Curabitur voluptate.</p>
            <p>Nisi commodo qui pariatur am sint laboris consequat seisin in offici. Officio iuste occidunt commodo in mollit aliqua from work. Esse enim magna exercitation ullamco amet quis enim. Curabitur voluptate.</p>
            <p>Aliquam mollit sunt deleniti ut aut voluptatem et nobis. Offici iure esse amet dolores a sequi deserunt numquam explicabo reprehen ullam soluta Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
            <p>Magni mollit sunt deleniti ut aut voluptatem et nobis. Offici iure esse amet dolores a sequi deserunt numquam explicabo reprehen ullam soluta Lorem ipsum, dolor sit amet consectetur adipisicing elit Magni mollit sunt deleniti ut aut.</p>
          </div>

          {/* Author section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">About the Author</p>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex-shrink-0"/>
              <div>
                <p className="font-bold text-gray-900 text-sm">Arthur Black</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Lorem adipiscing ut in est est autem amet, iaculis erat. Sed ullamcorper dignissim sapien mauris pharetra dui nisl. Tristique arcu tellus eget et, neque id. Tortor, arcu augue urna erat tincidunt. Dolor sit amet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Comments</h2>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Add a Comment</p>
            <div className="border border-gray-200 rounded-xl p-4">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Type your Comment"
                rows={3}
                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 resize-none"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} className="cursor-pointer transition-colors"
                      fill={s <= (hoverRating || userRating) ? "#F97316" : "none"}
                      color={s <= (hoverRating || userRating) ? "#F97316" : "#d1d5db"}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(s)}
                    />
                  ))}
                </div>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer border border-gray-200 px-3 py-1.5 rounded-lg">
                  <Upload size={12}/> Upload
                </button>
              </div>
            </div>

            {/* Current user comment preview */}
            <div className="flex gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">S</div>
              <div className="flex-1 bg-[#F8F8F8] rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-gray-800">Shaivya S.</p>
                  <StarRating count={userRating || 4}/>
                </div>
                <p className="text-xs text-gray-500">{comment || "Your comment will appear here…"}</p>
              </div>
              <button className="self-end text-gray-400 hover:text-gray-700 transition-colors cursor-pointer p-1">→</button>
            </div>
          </div>

          {/* Comments table */}
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-xs text-gray-400 font-medium pb-3 text-left">Name</th>
                <th className="text-xs text-gray-400 font-medium pb-3 text-left">Date Created</th>
                <th className="text-xs text-gray-400 font-medium pb-3 text-left">Quality</th>
                <th className="text-xs text-gray-400 font-medium pb-3 text-left">Comments</th>
                <th className="pb-3"/>
              </tr>
            </thead>
            <tbody>
              {COMMENTS.map((c, i) => (
                <tr key={i} className="border-t border-gray-50">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white text-xs">S</div>
                      <span className="text-xs text-gray-700 font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-xs text-gray-500">{c.date}</td>
                  <td className="py-2.5"><StarRating count={c.quality}/></td>
                  <td className="py-2.5 text-xs text-gray-500 max-w-xs truncate">{c.comment}</td>
                  <td className="py-2.5">
                    <button className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer text-lg leading-none">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="w-full mt-6 py-3 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-[#333] transition-all cursor-pointer">
            Submit
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
