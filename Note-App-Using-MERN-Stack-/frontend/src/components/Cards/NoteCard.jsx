import React from "react";
import { MdCreate, MdDelete, MdOutlinePushPin, MdAlarm, MdShare } from "react-icons/md"; //*
import moment from "moment"
const NoteCard = ({
  isPinned,
  onPinNote,
  content,
  onEdit,
  onDelete,
  onShare, 
  tags,
  title,
  date,
  category, 
  reminderAt, 
  onFilter,
  attachmentUrl,
  attachmentName,
}) => {
  const isReminderActive = reminderAt && new Date(reminderAt) > new Date(); 

  return (
    <div className="w-full max-w-[350px] mx-auto border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 dark:text-white hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">{title}</h6>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
            <span className="text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 font-medium">{moment(date).format("Do MMM YYYY")}</span>
            {reminderAt && (
              <span className={`text-[11px] sm:text-xs font-semibold flex items-center gap-1 ${isReminderActive ? "text-orange-500" : "text-slate-400"}`}>
                <MdAlarm className="text-sm" /> {moment(reminderAt).format("Do MMM, h:mm A")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {category && (
            <span
              className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              onClick={() => onFilter("category", category)}
            >
              {category}
            </span>
          )}
          <MdOutlinePushPin
            className={`text-xl cursor-pointer transition-colors ${isPinned ? "text-blue-600" : "text-slate-300 dark:text-slate-600 hover:text-blue-400"}`}
            onClick={onPinNote}
          />
        </div>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal mt-3 leading-relaxed">
        {content?.slice(0, 80)}...
      </p>
      
      {attachmentName && (
        <div className="mt-3">
          <a
            href={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"}${attachmentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="truncate max-w-[200px]">{attachmentName}</span>
          </a>
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <div className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 flex flex-wrap gap-1">
          {tags.map((item, index) => (
            <span key={index} className="bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded cursor-pointer hover:text-blue-500 transition-colors" onClick={() => onFilter("tag", item)}>
              #{item}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <MdShare
            className="text-lg text-slate-400 cursor-pointer hover:text-blue-500 transition-colors"
            onClick={onShare}
          />
          <MdCreate
            className="text-lg text-slate-400 cursor-pointer hover:text-green-600 transition-colors"
            onClick={onEdit}
          />
          <MdDelete
            className="text-lg text-slate-400 cursor-pointer hover:text-red-500 transition-colors"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
