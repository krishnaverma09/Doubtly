import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Search,
  Plus,
  LayoutGrid,
  Code,
  Terminal,
  Atom,
  Dna,
  History as HistoryIcon,
  Filter,
  X,
  ThumbsUp
} from "lucide-react";
import {
  getDoubts,
  createDoubt,
  answerDoubt,
  updateDoubt,
  deleteDoubt,
  editAnswer,
  deleteAnswer,
  toggleUpvote,
} from "../services/doubt.service";
import Navbar from "../components/common/Navbar";
import DoubtCard from "../components/doubts/DoubtCard";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [editingAnswer, setEditingAnswer] = useState(null); // { doubtId, text }
  const [doubts, setDoubts] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [loading, setLoading] = useState(true);

  // Student doubt form
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
  });

  const [files, setFiles] = useState([]);

  // 🔹 Edit state (NEW)
  const [editingDoubt, setEditingDoubt] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = async () => {
    try {
      const data = await getDoubts();
      setDoubts(data);
    } catch {
      alert("Failed to load doubts");
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE DOUBT =================
  const handleCreateDoubt = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("subject", formData.subject);
      form.append("description", formData.description);
      files.forEach((file) => form.append("media", file));

      await createDoubt(form);

      setFormData({ title: "", subject: "", description: "" });
      setFiles([]);
      loadDoubts();
    } catch {
      alert("Failed to create doubt");
    }
  };

  // ================= ANSWER DOUBT =================
  const handleAnswer = async (id, answer, files) => {
    try {
      const form = new FormData();
      form.append("answer", answer);
      files.forEach((file) => form.append("media", file));

      await answerDoubt(id, form);
      loadDoubts();
    } catch {
      alert("Failed to submit answer");
    }
  };

  // ================= EDIT / DELETE (NEW) =================
  const handleUpdateDoubt = async (e) => {
    e.preventDefault();
    try {
      await updateDoubt(editingDoubt._id, {
        title: editingDoubt.title,
        subject: editingDoubt.subject,
        description: editingDoubt.description,
      });
      setEditingDoubt(null);
      loadDoubts();
    } catch {
      alert("Failed to update doubt");
    }
  };

  const handleDeleteDoubt = async (id) => {
    if (!confirm("Delete this doubt?")) return;
    try {
      await deleteDoubt(id);
      loadDoubts();
    } catch {
      alert("Failed to delete doubt");
    }
  };

  const handleUpdateAnswer = async (e) => {
  e.preventDefault();
  try {
    await editAnswer(editingAnswer.doubtId, editingAnswer.text);
    setEditingAnswer(null);
    loadDoubts();
  } catch {
    alert("Failed to update answer");
  }
};

const handleDeleteAnswer = async (id) => {
  if (!confirm("Delete this answer?")) return;
  try {
    await deleteAnswer(id);
    loadDoubts();
  } catch {
    alert("Failed to delete answer");
  }
};
  const handleUpvote = async (id) => {
    try {
      const updatedUpvotes = await toggleUpvote(id);
      setDoubts(doubts.map(d => 
        d._id === id ? { ...d, upvotes: updatedUpvotes } : d
      ));
    } catch {
      alert("Failed to upvote");
    }
  };

  // Filter & Sort Logic
  const SUBJECTS = ["Maths", "DSA", "Web Dev", "Database", "AI ML", "Other"];
  const categories = ["All", ...SUBJECTS];
  const statuses = ["All", "Open", "Answered"];

  const SUBJECT_ICONS = {
    "All": <LayoutGrid size={18} />,
    "Maths": <div style={{ fontSize: '1.1rem' }}>∑</div>,
    "DSA": <Code size={18} />,
    "Web Dev": <Terminal size={18} />,
    "Database": <Atom size={18} />,
    "AI ML": <Dna size={18} />,
    "Other": <HistoryIcon size={18} />
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);
  const [answeringDoubt, setAnsweringDoubt] = useState(null);
  const [teacherAnswer, setTeacherAnswer] = useState("");
  const [answerFiles, setAnswerFiles] = useState([]);

  const filteredDoubts = doubts
    .filter((d) => {
      const subjectMatch =
        selectedSubject === "All" || d.subject === selectedSubject;
      const statusMatch =
        selectedStatus === "All" ||
        (selectedStatus === "Open" && d.status === "open") ||
        (selectedStatus === "Answered" && d.status === "answered");
      const searchMatch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         d.description.toLowerCase().includes(searchQuery.toLowerCase());
      return subjectMatch && statusMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === "Most Upvoted") {
        return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="dashboard-container">
      <Navbar />

      <header className="dashboard-header">
        <div className="welcome-text">
          <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <h1 className="highlight">What are we learning today?</h1>
        </div>

        <div className="action-bar">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search for doubts, subjects, or mentors..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {user.role === 'student' && (
            <button className="ask-btn" onClick={() => setShowAskModal(true)}>
              <Plus size={20} />
              Ask a Doubt
            </button>
          )}
        </div>

        <div className="filters-section" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${selectedSubject === cat ? 'active' : ''}`}
                onClick={() => setSelectedSubject(cat)}
              >
                {SUBJECT_ICONS[cat]}
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {statuses.map((stat) => (
                <button
                  key={stat}
                  className={`filter-chip ${selectedStatus === stat ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(stat)}
                  style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  {stat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Sort by:</span>
              <button
                className={`filter-chip ${sortBy === 'Most Upvoted' ? 'active' : ''}`}
                onClick={() => setSortBy(sortBy === 'Most Upvoted' ? 'Newest' : 'Most Upvoted')}
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                <ThumbsUp size={14} style={{ marginRight: '6px' }} />
                Most Upvoted
              </button>
            </div>
          </div>
        </div>

        <div className="doubts-grid">
          {loading ? (
            <p>Loading your learning feed...</p>
          ) : filteredDoubts.length === 0 ? (
            <p>No doubts found in this category.</p>
          ) : (
            filteredDoubts.map((doubt) => (
              <DoubtCard 
                key={doubt._id}
                doubt={doubt}
                user={user}
                onUpvote={handleUpvote}
                onEdit={setEditingDoubt}
                onDelete={handleDeleteDoubt}
                onAnswer={setAnsweringDoubt}
                onEditAnswer={(d, a) => setEditingAnswer({ doubtId: d._id, text: a.text })}
                onDeleteAnswer={handleDeleteAnswer}
                onImageClick={setPreviewImage}
              />
            ))
          )}
        </div>
      </header>

      {/* ================= ASK DOUBT MODAL ================= */}
      {showAskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Ask your Doubt</h2>
              <button onClick={() => setShowAskModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            <form onSubmit={async (e) => { await handleCreateDoubt(e); setShowAskModal(false); }}>
              <div className="form-group">
                <label>Title</label>
                <input
                  placeholder="e.g. How to optimize nested loops in Python?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Subject</option>
                  {SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Explain your problem in detail..."
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Attachments (Images/Videos)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,audio/*,video/*"
                  onChange={(e) => setFiles([...e.target.files])}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Posting..." : "Post Doubt"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT DOUBT MODAL ================= */}
      {editingDoubt && (
        <div className="modal-overlay">
          <div className="modal-content">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Edit Doubt</h2>
              <button onClick={() => setEditingDoubt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            <form onSubmit={handleUpdateDoubt}>
               <div className="form-group">
                <label>Title</label>
                <input
                  value={editingDoubt.title}
                  onChange={(e) => setEditingDoubt({ ...editingDoubt, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  value={editingDoubt.subject}
                  onChange={(e) => setEditingDoubt({ ...editingDoubt, subject: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Subject</option>
                  {SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingDoubt.description}
                  onChange={(e) => setEditingDoubt({ ...editingDoubt, description: e.target.value })}
                  required
                  rows="4"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="submit-btn" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={() => setEditingDoubt(null)} className="submit-btn" style={{ flex: 1, background: '#eee', color: '#333' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TEACHER ANSWER MODAL ================= */}
      {answeringDoubt && (
        <div className="modal-overlay">
          <div className="modal-content">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Provide Answer</h2>
              <button onClick={() => setAnsweringDoubt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '10px', borderLeft: '4px solid var(--primary-color)' }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-main)' }}>{answeringDoubt.title}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{answeringDoubt.description}</p>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await handleAnswer(answeringDoubt._id, teacherAnswer, answerFiles);
              setAnsweringDoubt(null);
            }}>
              <div className="form-group">
                <label>Your Answer</label>
                <textarea
                  placeholder="Explain clearly..."
                  rows="6"
                  value={teacherAnswer}
                  onChange={(e) => setTeacherAnswer(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAnswerFiles([...e.target.files])}
                />
              </div>
              <button type="submit" className="submit-btn">Submit Answer</button>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT ANSWER MODAL ================= */}
      {editingAnswer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Edit Your Answer</h2>
              <button onClick={() => setEditingAnswer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            <form onSubmit={handleUpdateAnswer}>
              <div className="form-group">
                <label>Answer Content</label>
                <textarea
                  value={editingAnswer.text}
                  onChange={(e) => setEditingAnswer({ ...editingAnswer, text: e.target.value })}
                  required
                  rows="6"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="submit-btn" style={{ flex: 1 }}>Update Answer</button>
                <button type="button" onClick={() => setEditingAnswer(null)} className="submit-btn" style={{ flex: 1, background: '#eee', color: '#333' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ================= IMAGE PREVIEW MODAL ================= */}
      {previewImage && (
        <div className="modal-overlay image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setPreviewImage(null)}>
              <X size={24} />
            </button>
            <img src={previewImage} alt="Large Preview" className="large-preview-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
