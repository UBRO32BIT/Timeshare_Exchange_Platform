import * as React from 'react';
import "../../styles/home.css";

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import {Container, Row, Col} from 'reactstrap';
import heroImg from '../../assets/images/hero-img01.jpg';
import heroImg02 from '../../assets/images/hero-img02.jpg';
import heroVideo from '../../assets/images/hero-video.mp4';
import Subtitle from '../../shared/Subtitle';
import worldImg from '../../assets/images/world.png';
import SearchBar from '../../shared/SearchBar';
import ServiceList from '../../components/services/ServiceList';
import FeaturedTourList from '../../components/Featured-tours/FeaturedTourList';
import experienceImg from '../../assets/images/experienceImg.jpg';
import Testimonial from '../../components/Testimonial/Testimonial';
import {GetPost} from '../../services/post.service';

const Home = () => {
    const [posts, setPosts] = React.useState([]);
    React.useEffect(() => {
        GetPost()
            .then((data) => {
                console.log(data);
                setPosts(data);
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response.status)
                } else console.error("Cannot get data from server!")
            });
    }, []);
    return (
        <>
            <Header/>
            <section>
                <Container>
                    <Row>
                        <Col lg='6'>
                            <div className='hero__content'>
                                <div className='hero__subtitle d-flex align-items-center'>
                                    <Subtitle subtitle={'Know Before You Go'}/>
                                    <img src={worldImg} alt=""/>
                                </div>
                                <h1><span className="hightlight">No mater</span> where you’re going to, we’ll take you
                                    there </h1>
                                <p>NiceTrip's resort rental and exchange service is a great choice for travelers who
                                    want to experience diverse and exciting vacations</p>
                            </div>
                        </Col>
                        <Col lg='2'>
                            <div className='hero__img-box'>
                                <img src={heroImg} alt=""/>
                            </div>
                        </Col>
                        <Col lg='2'>
                            <div className='hero__img-box mt-4'>
                                <video src={heroVideo} alt="" controls/>
                            </div>
                        </Col>
                        <Col lg='2'>
                            <div className='hero__img-box mt-5'>
                                <img src={heroImg02} alt=""/>
                            </div>
                        </Col>
                        <SearchBar/>
                    </Row>
                </Container>
            </section>
            {/*===============hero end ============*/}
            <section>
                <Container>
                    <Row>
                        <Col lg='3'>
                            <h5 className='services__subtitle'> What we serve</h5>
                            <h2 className='services__title'>We offer our best services</h2>
                        </Col>
                        <ServiceList/>
                    </Row>
                </Container>
            </section>

            {/*===================== featured tour or timeshare start==============*/}
            <section>
                <Container>
                    <Row>
                        <Col lg='12' className='mb-5'>
                            <Subtitle subtitle={'Explore'}/>
                            <h2 className='featured__tour-title'> Our featured timeshares</h2>
                        </Col>
                        {posts.length > 0 && <FeaturedTourList posts={posts}/>}
                    </Row>
                </Container>
            </section>
            {/*===================== featured tour or timeshare end==============*/}
            {/*===================== experience section tour or timeshare start==============*/}
            <section>
                <Container>
                    <Row>
                        <Col lg='6'>
                            <div className="experience__content">
                                <Subtitle subtitle={'Experience'}/>
                                <h2>With our all experience <br/> we will serve you
                                </h2>
                                <p>
                                    We are always there to serve the needs of renting <br/> and exchanging timeshares
                                    with each other
                                </p>
                            </div>
                            <div className="counter__wrapper d-flex align-items-center gap-5">
                                <div className="counter__box">
                                    <span>10k+</span>
                                    <h6>Successfull Timeshare</h6>
                                </div>
                                <div className="counter__box">
                                    <span>2k+</span>
                                    <h6>Regular clients</h6>
                                </div>
                                <div className="counter__box">
                                    <span>2</span>
                                    <h6>Years experience</h6>
                                </div>
                            </div>
                        </Col>
                        <Col lg='6'>
                            <div className="experience__img">
                                <img src={experienceImg} alt=""/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            {/*===================== experience section tour or timeshare end==============*/}
            <section>
                <Container>
                    <Row>
                        <Col lg='12'>
                            <Subtitle subtitle={'Fans Love'}/>
                            <h2 className="testimonial__title">
                                What our fans say about us
                            </h2>
                        </Col>
                        <Col lg='12'>
                            <Testimonial/>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Footer/>
        </>
    )
}

export default Home
