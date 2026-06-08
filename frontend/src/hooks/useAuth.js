import { useState } from "react";

function getUserLogs(userId) {
  try {
    return JSON.parse(localStorage.getItem(`home_logs_${userId}`) || "[]");
  } catch {
    return [];
  }
}

export function saveUserLogs(userId, logs) {
  localStorage.setItem(`home_logs_${userId}`, JSON.stringify(logs));
}

export function useAuth() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [logs, setLogs] = useState([]);

  const login = (id, name, guest) => {
    setUserId(id);
    setUserName(name);
    setIsGuest(guest);
    setLogs(guest ? [] : getUserLogs(id));
  };

  const logout = () => {
    setUserId("");
    setUserName("");
    setIsGuest(false);
    setLogs([]);
  };

  const addLog = (newLog) => {
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    if (!isGuest) {
      saveUserLogs(userId, updatedLogs);
    }
  };

  return { userId, userName, isGuest, logs, login, logout, addLog };
}