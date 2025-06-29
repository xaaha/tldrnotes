import type { FC } from "react";
import { formatDate, slugify } from "@scripts/utils";

// shape of the props this component expects
interface PostCardProps {
  post: {
    id: string;
    data: Frontmatter;
  };
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  // Destructure `data` directly, as it now matches the Frontmatter shape
  const { id, data } = post;
  const { title, date, description, image, category } = data;
  const tags = category
    ? category.split(" ").filter((tag) => tag.trim() !== "")
    : [];

  return (
    <article className="postcard">
      {image?.src && (
        <a
          href={`/blog/${id}`}
          className="postcard__image-link"
          aria-label={`Read the note: ${title}`}
        >
          <img
            src={image.src}
            alt={image.alt ?? `Thumbnail for ${title}`}
            loading="lazy"
          />
        </a>
      )}
      <div className="postcard__content">
        <h2 className="postcard__title">
          <a href={`/blog/${id}`}>{title}</a>
        </h2>
        <div className="postcard__metadata">
          {date && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="img"
                aria-labelledby="dateIconTitle"
              >
                <title>Calendar icon</title>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <time dateTime={date.toISOString()}>{formatDate(date)}</time>
            </>
          )}
        </div>
        <p className="postcard__description">{description}</p>
        {tags.length > 0 && (
          <div className="postcard__tags">
            {tags.map((tag) => (
              <a
                key={tag}
                href={`/tags/${slugify(tag)}`}
                className="postcard__tag-badge"
              >
                {tag}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
