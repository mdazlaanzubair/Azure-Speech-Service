import axios from "axios";
import React, { useEffect, useState } from "react";

// IMPORTING ENV VARIABLES
const baseUrl = import.meta.env.VITE_BASE_URL;
const apiKey = import.meta.env.VITE_SEARCH_API_KEY;
const engineId = import.meta.env.VITE_SEARCH_ENGINE_ID;

const SearchForm = ({
  setSearchResults,
  setIsLoading,
  setActiveTab,
  keyword,
  setKeyword,
  searchInput,
  setSearchInput,
}) => {
  useEffect(() => {
    if (keyword.length > 0) {
      // CHANGING LOADING STATE
      setIsLoading(true);

      // MAKING REQUEST URL
      const url = `${baseUrl}?key=${apiKey}&cx=${engineId}&q=${keyword}`;

      // MAKING API CALL
      axios
        .get(url)
        .then((res) => {
          setSearchResults([...res.data.items]);

          // CHANGING LOADING STATE
          setIsLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [keyword]);

  return (
    <div className="flex my-3 w-full border-2 rounded-full border-slate-950 p-2 gap-1">
      <input
        type="text"
        className="border-none outline-transparent w-3/4 bg-slate-950 text-slate-100 px-5 py-2 rounded-l-full"
        placeholder="Search something..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && setKeyword(searchInput)}
      />
      <div className="w-1/4 flex items-center gap-1">
        <button
          type="button"
          className="bg-slate-950 text-slate-100 rounded-r-full h-full w-full hover:opacity-90 transition-all ease-in-out duration-300"
          onClick={() => setActiveTab("Voice")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 mx-auto"
          >
            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
          </svg>
        </button>
        {/* <button
          type="button"
          className="bg-slate-950 text-slate-100 rounded-r-full h-full w-1/2 hover:opacity-90 transition-all ease-in-out duration-300"
          onClick={() => setKeyword(searchInput)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button> */}
      </div>
    </div>
  );
};

export default SearchForm;
