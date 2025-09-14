import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import api from "../utils/Api";

const CreateNoteForm = ({ refreshNotes }) => {
  const { user, notes } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    try {
      setLoading(true);
      const res = await api.post("/notes", { title, content });
      if (res.data.success) {
        setTitle("");
        setContent("");
        refreshNotes(); // refresh notes list after creation
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-purple-100 rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Create Note</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className="border border-purple-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
        <textarea
          placeholder="Content"
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
          className="border border-purple-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none h-32" />
        <button
          type="submit"
          disabled={user?.tenant?.plan === "free" && notes.length >= 3}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-white rounded-md text-lg px-4 py-2 cursor-pointer transition-colors">
          {loading ? "Saving..." : "Create Note"}
        </button>
      </form>
    </div>
  );
};

export default CreateNoteForm;
