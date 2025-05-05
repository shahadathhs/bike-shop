import { Link } from 'react-router'
import { blogPosts } from '~/constant/blogsData'
import { Button } from '../ui/button'
import { BorderBeam } from '../magicui/border-beam'

export default function FeaturedBlogs() {
  // Get the 3 most recent blog posts for the homepage
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <div className="py-10 border rounded relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Our Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest trends, tips, and stories from the cycling world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map(post => (
            <div
              key={post.slug}
              className="rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-48 w-full">
                <img
                  src={post.coverImage || '/placeholder.svg'}
                  alt={post.title}
                  className="object-cover h-[200px] w-full"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <h3 className="font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
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

        <div className="mt-10 text-center">
          <Link to="/blogs">
            <Button>View All Blog Posts</Button>
          </Link>
        </div>
      </div>

      <BorderBeam className="opacity-0 lg:opacity-100" duration={40} size={300} />
    </div>
  )
}
