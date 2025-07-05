import type { FC, ChangeEvent } from "react";
import type { CollectionEntry } from "astro:content";
import Fuse from "fuse.js";
import { useState } from "react";

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

  // limit of posts displayed 5
  const posts = fuse
    .search(query)
    .map((result) => result.item)
    .slice(0, 5);

  function handleOnSearch(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setQuery(value);
  }

  return (
    <>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="text"
        value={query}
        onChange={handleOnSearch}
        placeholder="Search Notes"
      />

      {query.length > 1 && (
        <p>
          Found {posts.length} {posts.length === 1 ? "result" : "results"} for '
          {query}'
        </p>
      )}

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/notes/${post.id}`}>{post.data.title}</a>
            <p>{post.data.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
};
export default Search;
