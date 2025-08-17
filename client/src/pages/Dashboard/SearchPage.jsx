import React, { useState, useEffect } from "react";
import axios from "axios";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState({ blogs: [], users: [] });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedQuery(query);
  };

  useEffect(() => {
    if (!submittedQuery) {
      setResults({ blogs: [], users: [] });
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/search?query=${encodeURIComponent(submittedQuery)}`
        );
        setResults(response.data); 
      } catch (error) {
        console.error("Search error:", error);
        setResults({ blogs: [], users: [] });
      }
      setLoading(false);
    };

    fetchResults();
  }, [submittedQuery]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Search Blogs or Users</h2>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter blog title or username..."
          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 rounded hover:bg-indigo-600"
        >
          Search
        </button>
      </form>

      {/* Results */}
      <div>
        {loading && <p>Loading...</p>}

        {!loading && results.blogs.length === 0 && results.users.length === 0 && submittedQuery && (
          <p className="text-gray-500">No results found.</p>
        )}

        {/* Blogs */}
        {results.blogs.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Blogs</h3>
            <div className="space-y-2">
              {results.blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="p-3 border rounded shadow-sm hover:shadow-md"
                >
                  <div className="font-medium">{blog.title}</div>
                  <p className="text-gray-600 text-sm mt-1">{blog.subTitle}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {results.users.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Users</h3>
            <div className="space-y-2">
              {results.users.map((user) => (
                <div
                  key={user.id}
                  className="p-3 border rounded shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <span className="font-medium">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
