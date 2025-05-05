import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { blogPosts } from '~/constant/blogsData'

export default function BlogsPage() {
  // Sort blog posts by date (newest first)
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div className="container mx-auto py-10">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Bike Shop Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of articles, guides, and stories about cycling, maintenance tips,
          and the latest trends in the biking world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedPosts.map(post => (
          <div
            key={post.slug}
            className="bg-white rounded-lg overflow-hidden  transition-all duration-300 hover:shadow border border-gray-100"
          >
            <div className="relative h-56 w-full">
              <img
                src={post.coverImage || '/placeholder.svg'}
                alt={post.title}
                className="object-cover h-[200px] w-full"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <span className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">{post.readTime} min read</span>
              </div>
              <h2 className="font-bold text-xl mb-3 line-clamp-2">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <Link to={`/blogs/${post.slug}`}>
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
