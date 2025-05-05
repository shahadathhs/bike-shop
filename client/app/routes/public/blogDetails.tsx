import { ChevronLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Button } from '~/components/ui/button'
import { blogPosts } from '~/constant/blogsData'

export default function BlogDetails() {
  const params = useParams()
  const post = blogPosts.find(post => post.slug === params.slug)

  if (!post) return null

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link to="/blogs">
        <Button variant="ghost" className="mb-8 pl-0 flex items-center gap-2">
          <ChevronLeft size={16} />
          Back to all blogs
        </Button>
      </Link>

      <article>
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
          <div className="flex items-center  mb-6">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <img
            src={post.coverImage || '/placeholder.svg'}
            alt={post.title}
            className="object-cover h-[400px] w-full"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          {/* This is where TipTap content would be rendered in the future */}
          {post.content.map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <div className="mt-10 pt-8 border-t ">
        <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts
            .filter(relatedPost => relatedPost.slug !== post.slug)
            .slice(0, 2)
            .map(relatedPost => (
              <div key={relatedPost.slug} className=" rounded-lg overflow-hidden shadow-md border">
                <div className="relative h-48 w-full">
                  <img
                    src={relatedPost.coverImage || '/placeholder.svg'}
                    alt={relatedPost.title}
                    className="object-cover h-[200px] w-full"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg mb-2">{relatedPost.title}</h4>
                  <p className="text-gray-600 mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                  <Link to={`/blogs/${relatedPost.slug}`}>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
