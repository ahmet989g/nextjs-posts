import { getPosts } from '../actions';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const page = Number(formData.get('page'));
  const posts = await getPosts(page);
  
  const html = posts.map(post => `
    <article class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div class="text-xs text-gray-500 mb-2">
        Server tarafında render edildi: ${new Date().toISOString()}
      </div>
      <h2 class="text-xl font-semibold capitalize mb-2">
        ${post.title}
      </h2>
      <p class="text-gray-600">
        ${post.body}
      </p>
    </article>
  `).join('');

  return new Response(html);
}