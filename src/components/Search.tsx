import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import type { CollectionEntry } from "astro:content";
import Fuse from "fuse.js";

const options = {
  keys: ["data.title", "data.description", "id"],
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.5,
};

interface SearchProps {
  searchList: CollectionEntry<"notes">[];
}

const Search: FC<SearchProps> = ({ searchList }) => {
  const [query, setQuery] = useState("");
  const fuse = new Fuse(searchList, options);

  const posts = fuse
    .search(query)
    .map((result) => result.item)
    .slice(0, 10);

  function handleOnSearch(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setQuery(value);
  }

  return (
    <div className="search-container">
      <label htmlFor="search" className="search-label sr-only">
        Search
      </label>
      <input
        id="search"
        className="search-input"
        type="text"
        value={query}
        onChange={handleOnSearch}
        placeholder="Search notes ..."
        autoComplete="off"
      />

      {query.length > 1 && (
        <p className="search-results-meta">
          Found {posts.length} {posts.length === 1 ? "result" : "results"} for '
          {query}'
        </p>
      )}

      <ul className="search-results-list">
        {posts.map((post) => (
          <li key={post.id} className="search-result-item">
            <a href={`/notes/${post.id}`}>
              <h2 className="search-result-title">{post.data.title}</h2>
              <p className="search-result-description">
                {post.data.description}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
