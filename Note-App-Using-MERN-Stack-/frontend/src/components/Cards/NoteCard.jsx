import React from "react";
import { MdCreate, MdDelete, MdOutlinePushPin, MdAlarm, MdShare } from "react-icons/md"; //*
import moment from "moment"
const NoteCard = ({
  isPinned,
  onPinNote,
  content,
  onEdit,
  onDelete,
  onShare, //*
  tags,
  title,
  date,
  category, //*
  reminderAt, //*
  onFilter, //*
}) => {
  const isReminderActive = reminderAt && new Date(reminderAt) > new Date(); //*

  return (
    <div className="border dark:border-slate-700 rounded p-4 bg-white dark:bg-slate-800 dark:text-white hover:shadow-xl transition-all ease-in-out"> {/* //* */}
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-green-700">{moment(date).format("Do MMM YYYY")}</span>
          {reminderAt && ( /* //* */
            <span className={`text-xs ml-3 font-medium flex items-center inline-flex gap-1 ${isReminderActive ? "text-orange-500" : "text-slate-400"}`}> 
              <MdAlarm /> {moment(reminderAt).format("Do MMM, h:mm A")} 
            </span> 
          )} {/* //* */}
        </div>

        <div className="flex items-center gap-2"> 
          {category && ( 
            <span  
              className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900" /* //* */
              onClick={() => onFilter("category", category)} 
            > 
              {category} 
            </span> 
          )} 
          <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-[#2B85FF]" : "text-slate-600 dark:text-slate-400"}`} /* //* */
          onClick={onPinNote}
        />
        </div> {/* //* */}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{content?.slice(0, 60)}</p> {/* //* */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500 dark:text-slate-400"> {/* //* */}
          {tags.map((item, index) => ( 
            <span key={index} className="cursor-pointer hover:text-blue-500 hover:underline mr-1" onClick={() => onFilter("tag", item)}> 
              #{item} 
            </span> 
          ))} 
        </div> 
        <div className="flex items-center gap-2">
          <MdShare //*
            className="icon-btn hover:text-blue-500" //*
            onClick={onShare} //*
          /> {/* //* */}
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
