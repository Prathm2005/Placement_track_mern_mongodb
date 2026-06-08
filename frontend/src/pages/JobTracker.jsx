import { useState,useEffect } from "react"
import api from "../api/axios"

const STAGES = ["Wishlist", "Applied", "OA", "Interview", "Offer", "Rejected"];
const stageColor = {
  Wishlist:  "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Applied:   "bg-blue-500/20 text-blue-300 border-blue-500/30",
  OA:        "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Interview: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Offer:     "bg-green-500/20 text-green-300 border-green-500/30",
  Rejected:  "bg-red-500/20 text-red-300 border-red-500/30",
};

const emptyForm = {
  company: "", role: "", status: "Wishlist",
  appliedDate: "", ctc: "", location: "", notes: "", nextStep: "",
};
const JobTracker = () => {

  const [apps, setApps]         = useState([]);
  const [filter, setFilter]     = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [editId, setEditId]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const { data } = await api.get("/applications");
      setApps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const { data } = await api.put(`/applications/${editId}`, form);
        setApps(apps.map((a) => (a._id === editId ? data : a)));
      } else {
        const { data } = await api.post("/applications", form);
        setApps([data, ...apps]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      setApps(apps.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (app, newStatus) => {
    const { data } = await api.put(`/applications/${app._id}`, { ...app, status: newStatus });
    setApps(apps.map((a) => (a._id === data._id ? data : a)));
  };
  const startEdit = (app) => {
    setForm({
      company:     app.company,
      role:        app.role,
      status:      app.status,
      appliedDate: app.appliedDate ? app.appliedDate.split("T")[0] : "",
      ctc:         app.ctc || "",
      location:    app.location || "",
      notes:       app.notes || "",
      nextStep:    app.nextStep || "",
    });
    setEditId(app._id);
    setShowForm(true);
  };
  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };
  const filtered = filter === "All" ? apps : apps.filter((a) => a.status === filter);
  const stageCounts = STAGES.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
 
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Job Applications</h1>
            <p className="text-slate-400 text-sm mt-1">{apps.length} total · {stageCounts["Offer"]} offers</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Add Application
          </button>
        </div>
 
        {/* Pipeline overview (mini kanban counts) */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {STAGES.map((s) => (
            <div
              key={s}
              onClick={() => setFilter(filter === s ? "All" : s)}
              className={`cursor-pointer rounded-xl p-3 border text-center transition ${
                filter === s ? stageColor[s] + " border-opacity-100" : "bg-slate-800 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <div className="text-xl font-bold text-white">{stageCounts[s]}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s}</div>
            </div>
          ))}
        </div>
 
        {/* Stage filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("All")}
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === "All" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            All
          </button>
          {STAGES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? "All" : s)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                filter === s ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
 
        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editId ? "Edit Application" : "Add New Application"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Company *</label>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Google"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Role *</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="SDE Intern"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Applied Date</label>
                <input
                  type="date"
                  value={form.appliedDate}
                  onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">CTC / Stipend</label>
                <input
                  value={form.ctc}
                  onChange={(e) => setForm({ ...form, ctc: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="12 LPA"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Bangalore / Remote"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Next Step</label>
                <input
                  value={form.nextStep}
                  onChange={(e) => setForm({ ...form, nextStep: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Prepare for system design round"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  rows={2}
                  placeholder="Referral contact, interview feedback..."
                />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition">
                  {editId ? "Update" : "Add Application"}
                </button>
                <button type="button" onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-6 py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
 
        {/* Applications List */}
        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <div className="text-4xl mb-3">📭</div>
            <p>No applications here. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <div key={app._id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                {/* Main row */}
                <div className="p-4 flex items-center gap-4">
                  {/* Company initial avatar */}
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400 font-bold flex-shrink-0">
                    {app.company[0].toUpperCase()}
                  </div>
 
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{app.company}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-300">{app.role}</span>
                      {app.location && <span className="text-slate-500 text-sm">{app.location}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${stageColor[app.status]}`}>
                        {app.status}
                      </span>
                      {app.ctc && <span className="text-xs text-green-400">{app.ctc}</span>}
                      {app.appliedDate && (
                        <span className="text-xs text-slate-500">
                          Applied: {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {app.nextStep && (
                      <p className="text-xs text-yellow-400 mt-1">→ {app.nextStep}</p>
                    )}
                  </div>
 
                  {/* Quick status change */}
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-sm text-slate-300 focus:outline-none"
                  >
                    {STAGES.map((s) => <option key={s}>{s}</option>)}
                  </select>
 
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded transition"
                    >
                      {expandedId === app._id ? "Less" : "More"}
                    </button>
                    <button
                      onClick={() => startEdit(app)}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-slate-700 hover:bg-red-900/30 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
 
                {/* Expanded notes section */}
                {expandedId === app._id && app.notes && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-700 mt-0">
                    <p className="text-slate-400 text-sm mt-3">{app.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobTracker