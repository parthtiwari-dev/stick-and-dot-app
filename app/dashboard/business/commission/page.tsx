"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { COMMISSION_STATUS_LABELS, createCommission, formatDueDate, formatMoney, listMyCommissions } from "@/lib/supabase/commissions";

const DOMAINS = ["Technology","Finance","Medical / Health","Law","Science","Business","Education","Culture","Other"];

type ActiveOrder = { topic:string; writer:string; status:string; deadline:string; payment:string; statusColor:string };

interface Instruction { id: number; value: string; }

export default function BusinessCommission() {
  const [topic, setTopic]       = useState("");
  const [domain, setDomain]     = useState("");
  const [dueDate, setDueDate]   = useState("");
  const [wordCount, setWordCount] = useState("");
  const [payment, setPayment]   = useState("");
  const [instructions, setInstructions] = useState<Instruction[]>([{ id: 1, value: "" }]);
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    listMyCommissions()
      .then(rows => {
        if (!alive) return;
        setOrders(rows.map(row => ({
          topic: row.topic,
          writer: row.writer_name,
          status: COMMISSION_STATUS_LABELS[row.status],
          deadline: formatDueDate(row.due_date),
          payment: formatMoney(row.payment_amount, row.payment_currency),
          statusColor:
            row.status === "open" ? "text-gray-400" :
            row.status === "delivered" || row.status === "completed" ? "text-green-500" :
            row.status === "under_sme_review" || row.status === "submitted" ? "text-orange-500" :
            "text-blue-500",
        })));
      })
      .catch(err => {
        if (alive) setNotice(err instanceof Error ? err.message : "Unable to load active orders.");
      })
      .finally(() => {
        if (alive) setOrdersLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const addRow    = () => setInstructions(p => [...p, { id: Date.now(), value: "" }]);
  const updateRow = (id: number, val: string) =>
    setInstructions(p => p.map(i => i.id === id ? { ...i, value: val } : i));

  const handleSubmit = async () => {
    setNotice("");
    setLoading(true);
    try {
      const row = await createCommission({
        topic,
        domain,
        dueDate,
        wordCount,
        payment,
        instructions: instructions.map(item => item.value),
      });
      setOrders(prev => [{
        topic: row.topic,
        writer: "-",
        status: COMMISSION_STATUS_LABELS[row.status],
        deadline: formatDueDate(row.due_date),
        payment: formatMoney(row.payment_amount, row.payment_currency),
        statusColor: "text-gray-400",
      }, ...prev]);
      setTopic("");
      setDomain("");
      setDueDate("");
      setWordCount("");
      setPayment("");
      setInstructions([{ id: 1, value: "" }]);
      setNotice("Commission posted.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Unable to post commission.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 transition-colors";

  return (
    <AppLayout bg="bg-[#F4F4F4]">
      <div className="p-4 md:p-6">
        <p className="text-xs text-gray-400 mb-1">
          <Link href="/dashboard/business" className="hover:text-gray-700">Dashboard</Link>
          &gt;Commission
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Post a Commission</h1>

        {/* Create Commission Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-5 mb-8 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Topic</label>
            <p className="text-xs text-gray-400 mb-2">The subject of the article you need</p>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g. The Future of Renewable Energy in India" className={inp}/>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Domain</label>
            <p className="text-xs text-gray-400 mb-2">Which field does this article belong to?</p>
            <select value={domain} onChange={e => setDomain(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white cursor-pointer">
              <option value="">Select a domain…</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Due Date</label>
              <p className="text-xs text-gray-400 mb-2">Deadline for delivery</p>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inp}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Word Count</label>
              <p className="text-xs text-gray-400 mb-2">Target article length</p>
              <input type="number" value={wordCount} onChange={e => setWordCount(e.target.value)}
                placeholder="e.g. 1500" className={inp}/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Additional Instructions</label>
            <p className="text-xs text-gray-400 mb-2">Keywords, tone, references, or context</p>
            {instructions.map(inst => (
              <input key={inst.id} type="text" value={inst.value}
                onChange={e => updateRow(inst.id, e.target.value)}
                placeholder="Add instruction…" className={`${inp} mb-2`}/>
            ))}
            <button onClick={addRow}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-colors w-fit mt-1">
              <PlusCircle size={16}/>Add more instructions
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Payment Offered</label>
            <p className="text-xs text-gray-400 mb-2">Total amount for writer + SME review</p>
            <input type="text" value={payment} onChange={e => setPayment(e.target.value)}
              placeholder="e.g. ₹4,500 or $60" className={inp}/>
          </div>

          {notice && <p className="text-xs text-gray-500">{notice}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-[#111] text-white rounded-xl text-sm font-semibold hover:bg-[#333] disabled:opacity-50 transition-colors cursor-pointer mt-2"
          >
            {loading ? "Posting..." : "Post Commission"}
          </button>
        </div>

        {/* Active Orders Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-base font-semibold text-gray-900">Active Orders</p>
              <p className="text-xs text-gray-400 mt-0.5">Track the status of all your commissioned articles</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">{orders.length} Orders</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Topic","Writer","Status","Deadline","Payment"].map(h => (
                    <th key={h} className="text-xs text-gray-400 font-medium pb-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-sm text-gray-800 font-medium max-w-[220px]">{o.topic}</td>
                    <td className="py-3 text-sm text-gray-500">{o.writer}</td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold ${o.statusColor}`}>{o.status}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{o.deadline}</td>
                    <td className="py-3 text-sm text-gray-700 font-semibold">{o.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(ordersLoading || orders.length === 0) && (
              <p className="text-center text-gray-400 text-sm py-8">
                {ordersLoading ? "Loading orders..." : "No commissions posted yet."}
              </p>
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
