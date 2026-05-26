"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { Search } from "lucide-react";
import { listWriterDirectory, type WriterDirectoryRow } from "@/lib/supabase/commissions";

const FILTER_DOMAINS = ["All","Technology","Finance","Medical","Science","Business","Law","Education"];

export default function BusinessWriters() {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All");
  const [writers, setWriters] = useState<WriterDirectoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    listWriterDirectory()
      .then(rows => {
        if (alive) setWriters(rows);
      })
      .catch(err => {
        if (alive) setError(err instanceof Error ? err.message : "Unable to load writers.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = writers.filter(w => {
    const matchDomain = domain === "All" || w.domain === domain;
    const matchSearch = !search.trim() ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.domain.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch;
  });

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">
              <Link href="/dashboard/business" className="hover:text-gray-700">Dashboard</Link>&gt;Writers
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Writer Directory</h1>
            <p className="text-sm text-gray-500 mt-0.5">Browse and discover writers across all domains</p>
          </div>
        </div>

        {/* Search + Domain Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-md">
            <Search size={14} className="text-gray-400 flex-shrink-0"/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search writers by name, domain, email…"
              className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300 bg-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTER_DOMAINS.map(d => (
              <button key={d} onClick={() => setDomain(d)}
                className={`text-xs px-3 py-2.5 rounded-xl border font-medium transition-all cursor-pointer ${
                  domain === d
                    ? "bg-[#111] text-white border-[#111]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>{d}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 overflow-x-auto">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-gray-900">
              {filtered.length} writer{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Name","Domain","Email","Phone","Articles Written","Avg Rating"].map(h => (
                  <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((w, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {w.name[0]}
                      </div>
                      <p className="text-sm text-gray-800 font-medium">{w.name}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{w.domain}</span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{w.email}</td>
                  <td className="py-3 text-sm text-gray-500">{w.phone}</td>
                  <td className="py-3 text-sm text-gray-700 font-semibold">{w.articles}</td>
                  <td className="py-3 text-sm text-gray-700 font-semibold">⭐ {w.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(loading || error || filtered.length === 0) && (
            <p className={`text-center ${error ? "text-red-500" : "text-gray-400"} text-sm py-8`}>
              {loading ? "Loading writers..." : error || "No writers match your filters."}
            </p>
          )}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Showing {filtered.length} of {writers.length} writers</p>
            <div className="flex gap-1">
              <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Previous</button>
              <button className="text-xs bg-[#F97316] text-white px-3 py-1 rounded-lg cursor-pointer">1</button>
              <button className="text-xs text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer">Next</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
