import { posts } from '../../content/blog/posts';

export default function BlogPage() {
  return <main style={{ padding: 24 }}><h1>Blog</h1>{posts.map((p) => <article key={p.slug}><h2>{p.title}</h2><p>{p.summary}</p></article>)}</main>;
}
