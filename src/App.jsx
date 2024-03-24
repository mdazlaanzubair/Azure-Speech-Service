import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import SearchList from "./components/SearchList";
import loadingAnimation from "./assets/loader.gif";
import VoiceInput from "./components/VoiceInput";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Voice");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (keyword?.length > 0) {
      setSearchInput(keyword);
      setActiveTab("Search");
    }
  }, [keyword]);

  return (
    <div className="flex items-center w-full m-0 p-0">
      <div className="container w-full mx-auto px-10 py-10">
        <h1 className="text-center uppercase font-black text-2xl mb-0 text-slate-950">
          Proof of Concept
        </h1>
        <h2 className="text-center font-semibold text-base text-slate-800">
          Voice Activated Internet Search
        </h2>

        <SearchForm
          setSearchResults={setSearchResults}
          setIsLoading={setIsLoading}
          setActiveTab={setActiveTab}
          keyword={keyword}
          setKeyword={setKeyword}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />

        {isLoading && (
          <img
            src={loadingAnimation}
            className="mx-auto w-20"
            alt="loading-animation"
          />
        )}

        <div
          className={`${
            activeTab === "Search" && !isLoading ? "flex" : "hidden"
          } mt-10`}
        >
          {searchResults?.length > 0 && (
            <SearchList searchResults={searchResults} />
          )}
        </div>
        <div
          className={`${
            activeTab === "Voice" && !isLoading ? "flex" : "hidden"
          } mt-10`}
        >
          <VoiceInput setKeyword={setKeyword} />
        </div>
      </div>
    </div>
  );
}

export default App;
