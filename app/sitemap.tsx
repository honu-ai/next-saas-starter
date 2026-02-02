import { getAllPosts } from '@/lib/posts';

export default async function sitemap() {
  const posts = getAllPosts();
  const baseUrl = process.env.BASE_URL || 'https://honu.ai';

  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
  }));

  const routes = ['', '/prices'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...blogPosts];
}
