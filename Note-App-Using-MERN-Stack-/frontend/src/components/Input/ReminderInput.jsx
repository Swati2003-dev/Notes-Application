import React from "react";
import { MdAlarm } from "react-icons/md";

const ReminderInput = ({ reminderAt, setReminderAt }) => {
  return (
    <div className="flex flex-col gap-2 mt-4"> 
      <label className="input-label text-red-400 uppercase">Reminder</label> 
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-600"> 
        <MdAlarm className="text-xl text-slate-400" /> 
        <input 
          type="datetime-local" 
          className="bg-transparent outline-none w-full text-sm text-slate-950 dark:text-white" 
          value={reminderAt ? new Date(new Date(reminderAt).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""} 
          onChange={(e) => setReminderAt(e.target.value ? new Date(e.target.value).toISOString() : null)} 
        /> 
        {reminderAt && ( 
          <button 
            onClick={() => setReminderAt(null)} 
            className="text-xs text-red-500 hover:underline whitespace-nowrap font-medium" 
          > 
            Clear 
          </button> 
        )} 
      </div> 
    </div>
  );
};

export default ReminderInput;
