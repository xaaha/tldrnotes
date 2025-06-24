import type { FC } from "react";

// shape of the props this component expects
interface PostCardProps {
  post: {
    slug: string;
    frontmatter: Frontmatter;
  };
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { slug, frontmatter } = post;
  const { title, date, description, image, category } = frontmatter;
  const tags = category
    ? category.split(" ").filter((tag) => tag.trim() !== "")
    : [];

  return (
    <article>
      <h2>{title}</h2>
    </article>
  );
};

export default PostCard;
