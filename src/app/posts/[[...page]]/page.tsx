import { Post } from '@/types';

async function getPosts(page: number = 1, limit: number = 10): Promise<Post[]> {
  console.log(`🖥️ Server: Sayfa getiriliyor ${page}`);

  const start = (page - 1) * limit;
  const end = page * limit;

  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'no-store',
    headers: {
      'x-fetch-location': 'server'
    }
  });

  const allPosts = await res.json();
  return allPosts.slice(start, end);
}

export default async function Posts({
  params
}: {
  params: { page?: string[] }
}) {
  const currentPage = Number(params?.page?.[0]) || 1;
  console.log(`🖥️ Server: Sayfa oluşturuluyor ${currentPage}`);

  const allPosts: Post[] = [];
  for (let i = 1; i <= currentPage; i++) {
    const posts = await getPosts(i);
    allPosts.push(...posts);
  }

  const serverRenderTime = new Date().toISOString();

  return (
    <main className="container mx-auto p-4">
      {/* Server bilgileri */}
      <div className="bg-green-100 p-4 mb-4 rounded-lg">
        <p className="text-sm text-green-800">
          ✨ Server tarafında render edildi: {serverRenderTime}
        </p>
        <p className="text-sm text-green-800">
          📄 Toplam Post Sayısı: {allPosts.length}
        </p>
        <p className="text-sm text-green-800">
          📖 Sayfa: {currentPage}
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

      <div className="grid gap-6">
        {allPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-xs text-gray-400 mb-2">
              🖥️ Sunucu tarafından oluşturulan gönderi #{post.id} {serverRenderTime}
            </div>

            <h2 className="text-xl font-semibold capitalize mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600">
              {post.body}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Post ID: {post.id} • User ID: {post.userId}
            </div>
          </article>
        ))}
      </div>

      {currentPage < 10 && (
        <div
          id="scroll-trigger"
          className="h-20 flex items-center justify-center"
        >
          <div className="text-gray-500">
            Daha fazla post için scroll yapın...
          </div>
        </div>
      )}

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              let isLoading = false;
              
              function fetchNextPage() {
                if (isLoading) return;
                isLoading = true;

                const currentPage = ${currentPage};
                const nextPage = currentPage + 1;
                const scrollPos = window.scrollY;
                const form = document.createElement('form');
                form.method = 'GET';
                form.action = '/posts/' + nextPage;

                // scroll pozisyonunu sakla
                localStorage.setItem('scrollPos', scrollPos.toString());

                // hidden input ekle
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'preserveScroll';
                input.value = 'true';
                form.appendChild(input);

                // Formu gönder (server side navigation tetikler)
                document.body.appendChild(form);
                form.submit();
              }

              // ıntersection observer kurulumu
              const observer = new IntersectionObserver((entries) => {
                const trigger = entries[0];
                if (trigger.isIntersecting) {
                  fetchNextPage();
                }
              }, {
                root: null,
                rootMargin: '200px',
                threshold: 0.1
              });

              // scrol triggerı izler
              const trigger = document.getElementById('scroll-trigger');
              if (trigger) {
                observer.observe(trigger);
              }

              // Scroll pozisyonunu geri yükler
              const savedPos = localStorage.getItem('scrollPos');
              if (savedPos) {
                window.scrollTo(0, parseInt(savedPos));
                localStorage.removeItem('scrollPos');
              }
            })();
          `
        }}
      />
    </main>
  );
}