import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import NotesList from "../components/NotesList";
import CreateNoteForm from "../components/CreateNoteForm";
import AdminForm from "../components/AdminForm";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user, notes, getNotes , upgradePlan } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      await getNotes();
      setLoading(false);
    };
    fetchNotes();
  }, []);


  return (
    <>
      <Navbar />
      {user?.tenantId.plan === "free" && notes.length >= 3 && (
        <div className="bg-yellow-100 text-yellow-800 text-center p-2 rounded mb-2">
          Free plan limit reached. Upgrade to <span className="text-red-500 font-medium">PRO</span> to add more notes.
        </div>
      )}
      <div className="flex gap-4 p-4 md:flex-row flex-col-reverse">
        {/* Left Column - Notes List */}
        <div className="w-full md:w-1/2 lg:w-2/3">
          {loading ? (
            <p>Loading notes...</p>
          ) : (
            <NotesList notes={notes}
              refreshNotes={getNotes} />
          )}
        </div>

        {/* Right Column - Sticky Form */}
        <div className="w-full md:w-1/2 lg:w-1/3 md:sticky md:top-20">
          {user?.role === "member" ? (
            <CreateNoteForm
              refreshNotes={getNotes} />
          ) : (
            <div className="flex flex-col gap-4">
              <AdminForm />
              <div className="p-2 max-w-md">
                {/* <button className="w-full bg-purple-500 text-white font-semibold text-lg rounded-md cursor-pointer px-4 py-2"> Upgrade Plan</button> */}
                <button
                  disabled={user?.tenantId.plan === "pro"}
                  className={`w-full font-semibold text-lg rounded-md px-4 py-2 transition-colors 
    ${user?.tenantId.plan === "pro" ? "bg-gray-300 cursor-not-allowed" : "bg-purple-500 text-white"}`}
                  onClick={upgradePlan}
                >
                  {user?.tenantId.plan === "pro" ? "Pro Plan Active" : "Upgrade Plan"}
                </button>

              </div>
            </div>

          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
