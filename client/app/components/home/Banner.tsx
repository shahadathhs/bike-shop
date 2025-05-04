import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperCore } from 'swiper/types'
import { Button } from '~/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import 'swiper/css/thumbs'
import { banners } from '~/constant/bannerData'

export default function Banner() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const handleResize = () => {
    if (window !== undefined) {
      if (window.innerWidth <= 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div>
      {/* Main Slider */}
      <div className="relative w-full h-[400px]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          pagination={{ clickable: true }}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="h-full"
        >
          {banners.map(b => (
            <SwiperSlide key={b.id}>
              <div className="relative w-full h-full rounded overflow-hidden">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <h1 className="text-4xl font-bold bg-background/80 px-4 py-2 rounded">
                    {b.title}
                  </h1>
                  <p className="text-2xl max-w-xl mx-auto text-white">{b.subtitle}</p>
                  <p className="text-base max-w-lg mx-auto text-white/90">{b.description}</p>
                  <Link to="/product">
                    <Button size="lg">Shop Now</Button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Prev/Next */}
          <div className="swiper-button-prev absolute left-4 top-1/2 z-20">
            <ChevronLeft className="h-6 w-6 text-white" />
          </div>
          <div className="swiper-button-next absolute right-4 top-1/2 z-20">
            <ChevronRight className="h-6 w-6 text-white" />
          </div>
        </Swiper>
      </div>

      {/* Thumbnail Slider */}
      <div className="mt-4">
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          spaceBetween={10}
          slidesPerView={isMobile ? 3 : 6}
          watchSlidesProgress
          className="h-20"
        >
          {banners.map(b => (
            <SwiperSlide key={`thumb-${b.id}`}>
              <img
                src={b.image}
                alt={b.title}
                className="h-full w-full object-cover cursor-pointer opacity-60 hover:opacity-100 transition-opacity rounded"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
