"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { generateRoomId } from '@/lib/client-utils';

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();

  // Start meeting function (existing)
  const startMeeting = async () => {
  const roomId = generateRoomId();
  await fetch('/api/meeting/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomName: roomId }),
  });
  router.push(`/rooms/${roomId}`);
};

  // Optional: join page
  const join = () => {
    router.push(`/join`);
  };

  // Save meeting info then start meeting
  const Save_Meeting_info = async () => {
    if (!title.trim() || !date.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, description }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Meeting saved:", data);
        startMeeting(); // start the meeting after saving
      } else {
        alert("Error saving meeting: " + data.error);
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    
    <div
      className="flex min-h-screen text-white "
      style={{
        background: "linear-gradient(to bottom right, #0a0f2c, #081a3a)",
      }}
    >
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 p-6 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]"
        style={{
          borderRight: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 className="text-xl font-bold mb-1">Virtual Classroom</h2>
        <p className="text-sm text-gray-400 mb-8 ">AI-POWERED PLATFORM</p>

        <nav className="space-y-6 mt-7 ">
          <a href="#" className="flex items-center text-blue-400 font-semibold">
            <span className="mr-2 ">📊</span> Dashboard
          </a>
          <a href="#" className="flex items-center hover:text-blue-400 ">
            <span className="mr-2">➕</span> Create Meeting 
          </a>
          <a href="#" className="flex items-center hover:text-blue-400">
            <span className="mr-2">🗓️</span> Join Meeting
          </a>
          <a href="#" className="flex items-center hover:text-blue-400">
            <span className="mr-2">⭐</span> Schedule
          </a>
          <a href="#" className="flex items-center hover:text-blue-400">
            <span className="mr-2">⚙️</span> Features
          </a>
          <a href="#" className="flex items-center hover:text-blue-400">
            <span className="mr-2">👤</span> Profile
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]">
        {/* Header */}
        <div
          className="flex mt-4 flex-col md:flex-row justify-between items-start md:items-center mb-8"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "1rem",
          }}
        >
          <div>
            <h1 className="text-3xl md:text-2xl font-bold text-blue-400">
              Welcome back, Subhan!
            </h1>
            <p className="text-gray-300 text-sm mt-2">
              Ready to start your virtual classroom experience?
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-right">
              <p className="font-semibold text-white">Subhan Shahzad</p>
              <p className="text-gray-400 text-sm">Student • @uop.edu.pk</p>
            </div>
            <div
              className="flex items-center justify-center text-lg font-bold"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#2563eb",
              }}
            >
              SS
            </div>
          </div>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            className="p-6 rounded-2xl shadow-lg"
            style={{
              background: "linear-gradient(to bottom right, #121e3d, #0f2a52)",
              minHeight: "280px",
            }}
          >
            <h3 className="text-5xl font-bold text-blue-400 mb-2">3</h3>
            <h3 className="text-lg font-semibold">No of Meetings Today</h3>
            <p className="text-gray-400 text-sm mt-1">
              Active sessions scheduled for today
            </p>
          </div>

          <div
            className="p-6 rounded-2xl shadow-lg"
            style={{
              background: "linear-gradient(to bottom right, #121e3d, #0f2a52)",
              minHeight: "280px",
            }}
          >
            <h3 className="text-5xl font-bold text-blue-400 mb-2">12</h3>
            <h3 className="text-lg font-semibold">
              No of Meetings Scheduled in Month
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Upcoming sessions this month
            </p>
          </div>

          <div
            className="p-6 rounded-2xl shadow-lg"
            style={{
              background: "linear-gradient(to bottom right, #121e3d, #0f2a52)",
              minHeight: "280px",
            }}
          >
            <h3 className="text-5xl font-bold text-blue-400 mb-2">8</h3>
            <h3 className="text-lg font-semibold">AI Summary Reports</h3>
            <p className="text-gray-400 text-sm mt-1">
              Generated meeting summaries available
            </p>
          </div>
        </div>

        {/* Modal Trigger Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-17">
          <button
            onClick={() => setOpenModal(true)}
            className="font-semibold px-6 py-3 rounded-xl shadow-lg text-white w-full sm:w-auto  bg-blue-600 hover:bg-blue-700 "
           
          >
            Create Meeting
          </button>
          <button onClick={join}
            className="font-semibold px-6 py-3 rounded-xl shadow-lg border border-blue-500 text-blue-400 w-full sm:w-auto"
            style={{ backgroundColor: "transparent" }}
          >
            Join Meeting
          </button>
        </div>
      </main>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-600 rounded-2xl p-6 w-11/12 max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Create New Meeting
              </h2>
              <form className="space-y-4">
  <input
    type="text"
    placeholder="Meeting Title"
    value={title}                 // bind state
    onChange={(e) => setTitle(e.target.value)} // update state
    className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400"
  />

  <input
    type="date"
    value={date}                  // bind state
    onChange={(e) => setDate(e.target.value)}  // update state
    className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400"
  />

  <textarea
    placeholder="Description"
    rows="3"
    value={description}           // bind state
    onChange={(e) => setDescription(e.target.value)} // update state
    className="w-full p-3 rounded-md border border-blue-700 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  ></textarea>
  
  <div className="flex justify-end gap-3 mt-4">
    <button
      type="button"
      onClick={() => setOpenModal(false)}
      className="px-4 py-2 rounded-md text-gray-400 border border-gray-600"
    >
      Cancel
    </button>
    <button
      type="button"
      onClick={Save_Meeting_info}
      className="px-8 py-2 rounded-md text-white"
      style={{ background: "linear-gradient(to right, #2563eb, #3b82f6)" }}
    >
      Start
    </button>
  </div>
</form>

          </div>
        </div>
        
      )}
    </div>
  );
}
