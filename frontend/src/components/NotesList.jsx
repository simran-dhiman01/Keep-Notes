import React, {  useContext } from "react";
import { Edit2, Trash2 } from "lucide-react";
import api from "../utils/Api";
import { AuthContext } from "../context/authContext";

const NotesList = ({ notes, refreshNotes }) => {
  if (!notes || notes.length === 0) {
    return <p>No notes available.</p>;
  }
  const {user} = useContext(AuthContext)

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await api.delete(`/notes/${id}`);
      if (res.data.success) {
        refreshNotes(); 
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };


  const editNote = async (note) => {
    const newTitle = prompt("Enter new title:", note.title);
    const newContent = prompt("Enter new content:", note.content);

    if (newTitle === null || newContent === null) return; // cancelled

    try {
      const res = await api.put(`/notes/${note._id}`, {
        title: newTitle,
        content: newContent,
      });
      if (res.data.success) {
        refreshNotes(); 
      }
    } catch (error) {
      console.error("Failed to edit note:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {notes.map((note) => (
        <div
          key={note._id}
          className="border border-purple-200 rounded-lg p-4 shadow-sm flex items-center justify-between" >
          <div>
            <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
            <p className="text-gray-700">{note.content}</p>
          </div>
          {user?.role === 'member' && (
            <div className="flex items-center gap-2">
              <Edit2
                size={18}
                className="text-blue-600 cursor-pointer"
                onClick={() => editNote(note)} />
              <Trash2
                size={18}
                className="text-red-600 cursor-pointer"
                onClick={() => deleteNote(note._id)} />
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default NotesList;
