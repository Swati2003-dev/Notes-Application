import React from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { useState } from "react";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };
  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tags, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300 px-3 py-1 rounded"
            >
              # {tags}
              <button
                onClick={() => {
                  handleRemoveTag(tags);
                }}
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-centergap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          className="text-sm text-slate-950 dark:text-white bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add Tags"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700 ml-3"
          onClick={() => {
            addNewTag();
          }}
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white " />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
