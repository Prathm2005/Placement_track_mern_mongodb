import { useState,useEffect } from "react";
import api from "../api/axios";

const TOPICS = ["All", "Arrays", "Strings", "LinkedList", "Trees", "Graphs", "DP", "Recursion", "Sorting", "Hashing", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const PLATFORMS = ["LeetCode", "GFG", "HackerRank", "Other"];
const STATUSES = ["Todo", "Solving", "Done"];

const diffColor = {
  Easy:   "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Hard:   "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusColor = {
  Todo:    "bg-slate-500/20 text-slate-400 border-slate-500/30",
  Solving: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Done:    "bg-green-500/20 text-green-400 border-green-500/30",
};

const emptyForm = { title: "", topic: "Arrays", difficulty: "Easy", status: "Todo", platform: "LeetCode", link: "", notes: "" };
const DSATracker = () => {
  const [problems, setProblems]     = useState([]);
  const [filter, setFilter]         = useState("All");   
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editId, setEditId]         = useState(null);    
  const [loading, setLoading]       = useState(true);
  useEffect(() => {
    fetchProblems();
  }, []);
  const fetchProblems=async()=>{
    try {
      const {data}= await api.get("/problems");
      setProblems(data);

    } catch (error) {
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        
        const { data } = await api.put(`/problems/${editId}`, form);
        setProblems(problems.map((p) => (p._id === editId ? data : p)));
      } else {
        
        const { data } = await api.post("/problems", form);
        setProblems([data, ...problems]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this problem?")) return;
    try {
      await api.delete(`/problems/${id}`);
      setProblems(problems.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };
 

  const cycleStatus = async (problem) => {
    const next = { Todo: "Solving", Solving: "Done", Done: "Todo" };
    const updated = { ...problem, status: next[problem.status] };
    const { data } = await api.put(`/problems/${problem._id}`, updated);
    setProblems(problems.map((p) => (p._id === data._id ? data : p)));
  };

  const startEdit = (problem) => {
    setForm({
      title:      problem.title,
      topic:      problem.topic,
      difficulty: problem.difficulty,
      status:     problem.status,
      platform:   problem.platform,
      link:       problem.link || "",
      notes:      problem.notes || "",
    });
    setEditId(problem._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };
  const filtered = filter === "All" ? problems : problems.filter((p) => p.topic === filter);
  const done    = problems.filter((p) => p.status === "Done").length;
  const solving = problems.filter((p) => p.status === "Solving").length;
  const total   = problems.length;
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
 
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">DSA Problems</h1>
            <p className="text-slate-400 text-sm mt-1">
              {done}/{total} solved · {solving} in progress
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Add Problem
          </button>
        </div>
 
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total",    value: total,   color: "text-white" },
            { label: "Done",     value: done,    color: "text-green-400" },
            { label: "In Progress", value: solving, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
 
        {/* Topic filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                filter === t
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
 
        
        {showForm && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editId ? "Edit Problem" : "Add New Problem"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Problem Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Two Sum"
                  required
                />
              </div>
 
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Topic</label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {TOPICS.filter((t) => t !== "All").map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
 
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
 
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
 
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
 
             
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Problem Link (optional)</label>
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>
 
              
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  rows={2}
                  placeholder="Approach, time complexity, reminders..."
                />
              </div>
 
              
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition">
                  {editId ? "Update" : "Add Problem"}
                </button>
                <button type="button" onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-6 py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
 
        
        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <div className="text-4xl mb-3">📭</div>
            <p>No problems yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((problem) => (
              <div
                key={problem._id}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-start gap-4"
              >
                <button
                  onClick={() => cycleStatus(problem)}
                  title="Click to change status"
                  className={`mt-1 w-5 h-5 rounded-full border-2 shrink-0 transition ${
                    problem.status === "Done"
                      ? "bg-green-500 border-green-500"
                      : problem.status === "Solving"
                      ? "bg-blue-500 border-blue-500"
                      : "border-slate-500 hover:border-indigo-400"
                  }`}
                />
 
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white">{problem.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${diffColor[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[problem.status]}`}>
                      {problem.status}
                    </span>
                    <span className="text-xs text-slate-500">{problem.topic}</span>
                    <span className="text-xs text-slate-500">· {problem.platform}</span>
                  </div>
                  {problem.notes && (
                    <p className="text-slate-400 text-sm mt-1 truncate">{problem.notes}</p>
                  )}
                </div>
 
                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {problem.link && (
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 bg-slate-700 rounded"
                    >
                      Open
                    </a>
                  )}
                  <button
                    onClick={() => startEdit(problem)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(problem._id)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-slate-700 hover:bg-red-900/30 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DSATracker