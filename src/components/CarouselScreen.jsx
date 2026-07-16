import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel, Keyboard, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import BikeSlide from './BikeSlide'
import HomeSections from './HomeSections'
import ScrollSequence from './ScrollSequence'
import HeroIntroScroll from './HeroIntroScroll'
import HeroSlider from './HeroSlider'
import Footer from './Footer'
import { bikes } from '../data/bikes'
import './Carousel.css'

export default function CarouselScreen({ screen, isActive, titleRef, onOpen }) {
  const [hoveredId, setHoveredId] = useState(null)
  const swiperRef = useRef(null)

  return (
    <section className="carousel-screen" aria-hidden={!isActive}>
      <HeroIntroScroll />

      <HeroSlider />

      <div className="hero-section">
        <div className="carousel-heading" ref={titleRef}>
          <span className="carousel-heading-bar" />
          <h1>
            <span className="accent">KTM</span> Bikes
          </h1>
        </div>

        <Swiper
          modules={[Mousewheel, Keyboard, Navigation]}
          onSwiper={(s) => (swiperRef.current = s)}
          grabCursor
          slidesPerView={4}
          spaceBetween={24}
          keyboard={{ enabled: true }}
          mousewheel={{ forceToAxis: true, sensitivity: 0.6 }}
          navigation
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="bike-swiper"
        >
          {bikes.map((bike) => (
            <SwiperSlide key={bike.id} className="bike-swiper-slide">
              <BikeSlide
                bike={bike}
                screen={screen}
                isHovered={hoveredId === bike.id}
                isDimmed={hoveredId !== null && hoveredId !== bike.id}
                onHoverStart={setHoveredId}
                onHoverEnd={() => setHoveredId(null)}
                onOpen={onOpen}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ScrollSequence />

      <HomeSections />

      <Footer />
    </section>
  )
}
