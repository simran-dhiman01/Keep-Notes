import React, { useEffect, useState } from "react";
import axios from "axios";

const Health = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get("https://keep-notes-mauve.vercel.app/api/health", {
          withCredentials: true, // send cookies if any
        });
        setStatus(res.data.status);
      } catch (error) {
        console.error("Error fetching health:", error);
        setStatus("Error connecting to backend");
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <p>Checking backend health...</p>
      ) : (
        <p>
          Backend Status: <span className="font-semibold">{status}</span>
        </p>
      )}
    </div>
  );
};

export default Health;
