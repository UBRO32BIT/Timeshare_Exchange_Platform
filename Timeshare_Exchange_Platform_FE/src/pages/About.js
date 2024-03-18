import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/about.css";
import heroImg02 from '../assets/images/hero-img02.jpg';
import tourImg06 from '../assets/images/tour-img06.jpg';
import tourImg04 from '../assets/images/tour-img04.jpg';
import heroVideo from '../assets/images/hero-video.mp4';
import { Container, Row, Col } from 'reactstrap';


export default function About(props) {
    return (
        <>
        <Header />
        <section className="core-feature bg-white ">
            <div className="container">
                <div className="section-title text-center">
                <span class="title-tag" binding-name=""></span>
                <h2 binding-name="Mission and Vision">Mission and Vision</h2>
            </div>
            <div className="row features-loop">
                <div className="col-lg-6 col-sm-6 order-1">
                    <div className="feature-box wow fadeInLeft" data-wow-delay=".3s" style={{ visibility: 'visible', animationDelay: '0.3s', animationName: 'fadeInLeft' }}>
                    <h1>Mission</h1>
                    <p className="description" style={{ textAlign: 'justify', color: 'var(--text-color)' }} binding-subdescription="We provide a COMPREHENSIVE SOLUTION to promote the growth of the resort real estate market and advanced, modern tourism and resort models. At the same time, we are a TRUSTED BRIDGE between real estate owners and an effective assistant to Investors in development and customer care activities.">We provide a COMPREHENSIVE SOLUTION to promote the growth of the resort real estate market and advanced, modern tourism and resort models. At the same time, we are a TRUSTED BRIDGE between real estate owners and an effective assistant to Investors in development and customer care activities. </p>
                    {/* <span class="count">01</span> */}
                    </div>
                </div>
                <div className="col-lg-6 col-sm-6 order-2">
                    <div className="feature-box wow fadeInDown" data-wow-delay=".4s" style={{ visibility: 'visible', animationDelay: '0.4s', animationName: 'fadeInDown' }}>
                    <h1>Vision</h1>
                    <p className="description" style={{ textAlign: 'justify', color: 'var(--text-color)' }} binding-subdescription="Based on the founders' strengths and experience of more than 10 years of pioneering in developing high-end customer service in Vietnam, with a global network of partners, we wish to turn NiceTrip into a NATIONAL ORGANIZATION has a strong service and network of suppliers and partners of great stature by 2025.">Based on the founders' strengths and experience of more than 10 years of pioneering in developing high-end customer service in Vietnam, with a global network of partners, we wish to turn NiceTrip into a NATIONAL ORGANIZATION has a strong service and network of suppliers and partners of great stature by 2025. </p>
                    {/* <!--<span class="count">02</span>--> */}
                    </div>
                </div>
            </div>
            </div>
        </section>
        <section class="text-block bg-black with-pattern">
        <div class="container">
            <div class="introduction row align-items-center justify-content-center">
            <div class="col-lg-6 col-md-10 order-2 order-lg-1">
                <div class="block-text">
                    <div class="section-title mb-20">
                        <span class="title-tag" binding-name="ABOUT US">ABOUT US</span>
                        <h2 binding-name="General introduction">General introduction</h2>
                    </div>
                    <p style={{textalign: 'justify'}} class="pr-50" binding-subdescription="NiceTrip is the first and only vacation exchange service platform in Vietnam, advised by leading experts in the fields of Resort Tourism, Customer Service, Technology and Construction and Development Strategy.">NiceTrip is the first and only vacation exchange service platform in Vietnam, advised by leading experts in the fields of Resort Tourism, Customer Service, Technology and Construction and Development Strategy. </p> 
                    <p style={{textalign: 'justify'}} class="pr-50" binding-subdescription="NiceTrip creates a technology platform to book and exchange resort services and high-end living amenities such as resort properties,... In addition, NiceTrip also provides providing experience programs and exclusive preferential benefits from a network of leading international partners.">NiceTrip creates a technology platform to book and exchange resort services and high-end living amenities such as resort properties,... In addition, NiceTrip also provides providing experience programs and exclusive preferential benefits from a network of leading international partners.</p>
                </div>
            </div>
            <div class="col-lg-6 col-md-10 order-1 order-lg-2 wow fadeInRight" data-wow-delay=".3s" style= {{visibility: 'visible', animationDelay: '0.3s', animationName: 'fadeInRight'}}>
                <div class="hero__img-box"><img src={heroImg02} alt="" /></div>
            </div>
            </div>
        </div>
        <div class="pattern-wrap">
        <div class="pattern"></div>
        </div>
        </section>

        <section>
      <Container>
        <Row>
            <Col lg='2'>
          <div className='hero__img-box'>
            <img src={tourImg06} alt="" />
          </div>
            </Col>
            <Col lg='2'>
          <div className='hero__img-box mt-4'>
            <video src={heroVideo} alt="" controls/>
          </div>
            </Col> 
            <Col lg='2'>
          <div className='hero__img-box mt-5'>
            <img src={tourImg04} alt="" />
          </div>
            </Col>
            <Col lg='6'>
            <div className='hero__content section-title'>
                <div className='hero__subtitle d-flex align-items-center'>
 
                </div>
                <h2> Experience with <span className="hightlight">Nice Trip</span> </h2>
                <p>NiceTrip brings you resort experiences and specialized high-end services along with many incentives from major domestic and international brand partners. Thanks to the modern technology platform and optimal membership program system, customers can have high-end service & resort experiences around the world.</p>
            </div>
            </Col>
        </Row>
      </Container>
    </section>

        <Footer />
        </>
    );
}