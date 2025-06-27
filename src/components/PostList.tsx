import { useState } from "react";
import type { FC } from "react";
import PostCard from "./PostCard";

interface PostCardProps {
  post: {
    slug: string;
    frontmatter: Frontmatter;
  };
}

interface PostListProps {
  posts: PostCardProps[];
}

const POSTS_PER_PAGE = 6; // random number

const PostList: FC<PostListProps> = ({ posts }) => {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + POSTS_PER_PAGE);
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
            <span>Load More</span>
            <svg
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Load More</title>
              <path d="M12 5v14m-7-7h14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default PostList;
