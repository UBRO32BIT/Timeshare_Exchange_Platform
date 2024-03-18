import React from 'react'
import ServiceCard from './ServiceCard'
import { Col } from 'reactstrap'

import weatherImg from '../../assets/images/weather.png'
import guideImg from '../../assets/images/guide.png'
import customizationImg from '../../assets/images/customization.png'

const servicesData = [
    {
        imgUrl: weatherImg,
        title: "Weather",
        desc: "Nice weather will give you a pleasant feeling when traveling together",
    },
    {
        imgUrl: guideImg,
        title: "Meet all your needs",
        desc: "From accommodation to sharing attractions, you can freely choose",
    },
    {
        imgUrl: customizationImg,
        title: "Payment is safe and convenient",
        desc: "Enjoy multiple secure ways to pay, in the currency most convenient for you.",
    },
]

const ServiceList = () => {
  return (
  <>
  {
    servicesData.map((item,index) => (
        <Col lg='3' key={index}>
        <ServiceCard item={item}/>
    </Col>
     ))}
  </>
  );
};

export default ServiceList