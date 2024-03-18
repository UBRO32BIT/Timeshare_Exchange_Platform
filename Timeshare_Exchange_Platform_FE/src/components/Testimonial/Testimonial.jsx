import React from 'react'
import Slider from 'react-slick'
import ava01 from '../../assets/images/ava-1.jpg'
import ava02 from '../../assets/images/ava-2.jpg'
import ava03 from '../../assets/images/ava-3.jpg'
import ava04 from '../../assets/images/ava04.jpg'


const Testimonial = () => {

    const settings = {
        dots:true,
        infinite:true,
        autoplay:true,
        speed:1000,
        swipeToSlide:true,
        autoplaySpeed:2000,
        slidesToShow:3,
        
        responsive: [
            {
                breakpoint:992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite:true,
                    dots:true,
                },
            },
            {
                breakpoint:566,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ]
    }

  return (
    <Slider {...settings}>
        <div className='testimonial py-4 px-3'>
            <p>
            Service is very professional and friendly, staff are always willing to help and meet all customer needs
            </p>
            <div className='d-flex align-items-center gap-4 mt-3'>
                <img src={ava01} className='w-25 h-25 rounded-2' alt="" />
                <h5 className='mb-0 mt-3'>Nguyen Vu</h5>
                <p>Member</p>
            </div>
        </div>
        <div className='testimonial py-4 px-3'>
            <p>
            High quality service and luxurious space bring a classy and comfortable resort experience
            </p>
            <div className='d-flex align-items-center gap-4 mt-3'>
                <img src={ava02} className='w-25 h-25 rounded-2' alt="" />
                <h5 className='mb-0 mt-3'>Xuan Tinh</h5>
                <p>Member</p>
            </div>
        </div>
        <div className='testimonial py-4 px-3'>
            <p>
            The booking and payment process is simple and fast, saving time and creating convenience for customers
            </p>
            <div className='d-flex align-items-center gap-4 mt-3'>
                <img src={ava03} className='w-25 h-25 rounded-2' alt="" />
                <h5 className='mb-0 mt-3'>Minh Duc</h5>
                <p>Member</p>
            </div>
        </div>
        <div className='testimonial py-4 px-3'>
            <p>
            Resort rentals and exchanges provide flexible and diverse options for travelers, making it easy for them to customize and plan their ideal vacation
            </p>
            <div className='d-flex align-items-center gap-4 mt-3'>
                <img src={ava03} className='w-25 h-25 rounded-2' alt="" />
                <h5 className='mb-0 mt-3'>Duc Manh</h5>
                <p>Member</p>
            </div>
        </div>
        <div className='testimonial py-4 px-3'>
            <p>
            A variety of amenities and recreational activities at the resort, from swimming pools to restaurants, are all professionally designed and operated, providing a wonderful experience for visitors.
            </p>
            <div className='d-flex align-items-center gap-4 mt-3'>
                <img src={ava04} className='w-25 h-25 rounded-2' alt="" />
                <h5 className='mb-0 mt-3'>Minh Tri</h5>
                <p>Member</p>
            </div>
        </div>
    </Slider>
  )
}

export default Testimonial