'use server'

import { Post } from '@/types';

export async function getPosts(page: number = 1): Promise<Post[]> {
  const limit = 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'no-store'
  });
  const allPosts = await res.json();
  
  return allPosts.slice(start, end);
}