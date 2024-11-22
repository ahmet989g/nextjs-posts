import { Post } from '@/types';
import { getPosts } from './actions';

export default async function Posts() {
  const initialPosts = await getPosts(1);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-6">Blog Posts</h1>

      <div id="posts-container" className="grid gap-6">
        {initialPosts.map((post: Post) => (
          <article
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold capitalize mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600">
              {post.body}
            </p>
          </article>
        ))}
      </div>

      <div id="load-more" className="h-20 flex items-center justify-center">
        <button
          className="text-gray-500"
          data-page="1"
        >
          Daha fazla post için scroll yapın...
        </button>
      </div>

      <script>
        {`
          let isLoading = false;

          async function loadMorePosts(page) {
            if (isLoading) return;
            isLoading = true;

            try {
              const formData = new FormData();
              formData.append('page', page);

              const response = await fetch('/posts/load', {
                method: 'POST',
                body: formData
              });

              const html = await response.text();
              const container = document.getElementById('posts-container');
              const temp = document.createElement('div');
              temp.innerHTML = html;
              
              const newPosts = temp.querySelectorAll('article');
              newPosts.forEach(post => {
                container.appendChild(post);
              });

              document.querySelector('#load-more button').dataset.page = page;
            } catch (error) {
              console.error('Error:', error);
            } finally {
              isLoading = false;
            }
          }

          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
              const btn = document.querySelector('#load-more button');
              const nextPage = parseInt(btn.dataset.page) + 1;
              loadMorePosts(nextPage);
            }
          }, {
            rootMargin: '200px'
          });

          const loadMore = document.getElementById('load-more');
          if (loadMore) {
            observer.observe(loadMore);
          }
        `}
      </script>
    </main>
  );
}