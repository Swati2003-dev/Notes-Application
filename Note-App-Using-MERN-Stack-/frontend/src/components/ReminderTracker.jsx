import React, { useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReminderTracker = ({ notes, getAllNotes }) => {
  const triggeredAlarms = useRef(new Set()); 

  useEffect(() => {
    // Request permission once on UI load 
    if (Notification.permission !== "granted" && Notification.permission !== "denied") { 
      Notification.requestPermission(); 
    } 
  }, []);

  useEffect(() => {
    if (!notes || notes.length === 0) return;

    const checkReminders = () => { 
      const now = new Date(); 
      
      notes.forEach((note) => { 
        if (!note.reminderAt) return; 
        
        const reminderTime = new Date(note.reminderAt); 
        
        // If the reminder time has passed but it's within the last 5 minutes 
        // AND we haven't already fired it in this session 
        if (now >= reminderTime && (now - reminderTime) < 5 * 60 * 1000) { 
          if (!triggeredAlarms.current.has(note._id)) { 
            triggerAlarm(note); 
            triggeredAlarms.current.add(note._id); 
          } 
        } 
      }); 
    }; 

    // Check immediately and then every 1 second for exact precision 
    checkReminders(); 
    const interval = setInterval(checkReminders, 1000); //* 
    return () => clearInterval(interval); 
  }, [notes]); 

  const triggerAlarm = (note) => { 
    // 1. Play sound
    try {
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"); //* Change this URL to any .mp3 or .wav link!
      audio.play().catch(e => console.log("Audio play blocked by browser:", e)); 
    } catch (e) {}

    // 2. Native Notification
    if (Notification.permission === "granted") { 
      new Notification("Reminder!", { 
        body: `⏰ ${note.title}\n${note.content?.slice(0, 30)}...`, 
      }); 
    } else { 
      // Fallback 
      alert(`⏰ Reminder: ${note.title}`); 
    } 

    // 3. UI Toast with Snooze
    toast( 
      <div> 
        <p className="font-bold text-slate-800">⏰ Reminder: {note.title}</p> 
        <button  
          onClick={() => handleSnooze(note)}  
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors" 
        > 
          Snooze 5 Mins 
        </button> 
      </div>,  
      { autoClose: 10000, closeOnClick: false } 
    ); 
  }; 

  const handleSnooze = async (note) => { 
    try { 
      const snoozeTime = new Date(); 
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 5); 

      await axios.post( 
        `http://localhost:3000/api/note/edit/${note._id}`, 
        { reminderAt: snoozeTime.toISOString() }, 
        { withCredentials: true } 
      ); 
      
      toast.success("Snoozed for 5 minutes"); 
      triggeredAlarms.current.delete(note._id); 
      getAllNotes(); 
    } catch (error) { 
      console.error(error); 
      toast.error("Failed to snooze reminder"); 
    } 
  }; 

  return null; 
};

export default ReminderTracker;
