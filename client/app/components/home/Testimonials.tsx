import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Quote } from 'lucide-react'
import { testimonialsData } from '~/constant/testtimonials'
import { nanoid } from 'nanoid'
import { BorderBeam } from '../magicui/border-beam'

export default function Testimonials() {
  return (
    <section className="relative py-10 border overflow-hidden rounded bg-gradient-to-br from-white via-gray-50 to-green-50">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">What Our Customers Say</h2>
        <p className="mt-4 text-muted-foreground">
          Real feedback from people who love our products as much as we do.
        </p>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={1.2}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
          slideShadows: false,
        }}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        className="max-w-5xl mx-auto"
      >
        {testimonialsData.map(({ name, text, image }) => (
          <SwiperSlide key={nanoid()}>
            <Card className="p-6 bg-white/80 backdrop-blur rounded-xl shadow-lg transition-transform hover:scale-[1.03]">
              <CardHeader className="flex flex-col items-center space-y-4">
                <div className="relative w-24 h-24 rounded-full ring-4 ring-indigo-100 overflow-hidden">
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                </div>
                <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
                  <Quote className="h-5 w-5 text-indigo-500" />
                  <span>{name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mt-2 text-center text-gray-700 italic">{text}</p>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <BorderBeam
        duration={30}
        size={300}
        className="from-transparent via-green-500 to-transparent"
      />
    </section>
  )
}
