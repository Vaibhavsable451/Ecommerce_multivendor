import React from 'react'
import DealCard from './DealCard'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppSelector } from '../../../../State/Store';
import Slider from "react-slick";

const Deal = () => {
    const {customer}=useAppSelector(store=>store);
    const sliderRef = React.useRef<any>(null);

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 3000,
        cssEase: "ease",
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
              breakpoint: 1024, // Large screen
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 768, // Tablet
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 480, // Mobile
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],

    };
  return (
    <div className='py-5 lg:px-20'>
      <div className="slide-container" 
        onMouseEnter={() => sliderRef.current?.slickPause()}
        onMouseLeave={() => sliderRef.current?.slickPlay()}
      >
        <Slider ref={sliderRef} {...settings}>
          {customer.homePageData?.deals.map((item, idx, arr) => (
            <div key={item.category?.categoryId ?? idx} className="border flex flex-col items-center justify-center">
                 <DealCard item={item} allDeals={arr} index={idx} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default Deal
