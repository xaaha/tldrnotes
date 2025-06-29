import { useState } from "react";
import type { FC } from "react";
import PostCard from "./PostCard";

interface PostListProps {
  posts: {
    id: string;
    data: Frontmatter;
  }[];
}

// totally random number
const POSTS_PER_PAGE = 10;

const PostList: FC<PostListProps> = ({ posts }) => {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + POSTS_PER_PAGE;
      return Math.min(newCount, posts.length);
    });
  };

  const hasMorePosts = visibleCount < posts.length;

  return (
    <>
      <div className="post-container">
        {posts.slice(0, visibleCount).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMorePosts && (
        <div className="load-more-container">
          <button
            onClick={handleLoadMore}
            className="load-more-button"
            type="button"
          >
            <span>Load More Notes</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Load More</title>
              <path
                fill="currentColor"
                d="M10.103 12.778L16.81 6.08a.69.69 0 0 1 .99.012a.726.726 0 0 1-.012 1.012l-7.203 7.193a.69.69 0 0 1-.985-.006L2.205 6.72a.727.727 0 0 1 0-1.01a.69.69 0 0 1 .99 0z"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default PostList;
