import React from "react";

const SearchList = ({ searchResults }) => {
  return (
    <div className="w-full flex flex-col">
      {searchResults?.map((item, index) => (
        <a
          key={index}
          href={item?.link}
          target="_blank"
          className="w-full p-3 bg-slate-50 rounded-e-2xl mb-3 border-l-4 border-transparent hover:border-slate-950 hover:shadow-md transition-all ease-in-out duration-300"
        >
          <h1 className="text-base text-slate-900 font-bold">{item?.title}</h1>
          <h1 className="text-sm text-slate-800 font-normal">
            {item?.snippet}
          </h1>
        </a>
      ))}
    </div>
  );
};

export default SearchList;
