import { useRef } from 'react'
import { Link } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import SwiperCore from 'swiper'
import { Button } from '~/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { banners } from '~/constant/bannerData'

export default function Banner() {
  const swiperRef = useRef<SwiperCore>(null)

  return (
    <div className="relative w-full h-[500px]">
      <Swiper
        onSwiper={swiper => (swiperRef.current = swiper)}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
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
        {banners.map(banner => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full rounded">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute inset-0 rounded bg-black/40 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <h1 className="text-4xl font-bold bg-background/80 px-4 py-2 rounded">
                  {banner.title}
                </h1>
                <p className="text-2xl max-w-xl mx-auto text-white">{banner.subtitle}</p>
                <p className="text-base max-w-lg mx-auto text-white/90">{banner.description}</p>
                <Link to="/product">
                  <Button size="lg">Shop Now</Button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Nav Buttons (overriding default HTML) */}
        <div className="swiper-button-prev absolute left-4 top-1/2 z-20">
          <ChevronLeft className="h-5 w-5" />
        </div>
        <div className="swiper-button-next absolute right-4 top-1/2 z-20">
          <ChevronRight className="h-5 w-5" />
        </div>
      </Swiper>
    </div>
  )
}
