import React, { useRef, useState } from 'react'
import '../styles/timeshare-details.css'
import { GetPostById, GetReviewByResortId } from '../services/post.service'
import { Container, Row, Col, Form, ListGroup } from 'reactstrap'
import { useParams, useNavigate } from 'react-router-dom'
import calculateAvgRating from '../utils/avgRating'
import Button from '@mui/material/Button';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { convertDate, convertDateTime } from '../utils/date'
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css"
import convertImageArray from '../utils/convertImageArray'
import { Box } from '@mui/material';
import { useSelector } from "react-redux";
import { useSnackbar } from 'notistack';
import { Typography } from '@mui/joy'
import Rating from '@mui/material/Rating';
import { UploadReview } from '../services/post.service'

const TimeShareDetails = () => {
    const user = useSelector((state) => state?.auth?.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const reviewMsgRef = useRef('');
    const [post, setPost] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        GetPostById(id)
            .then((data) => {
                console.log(data);
                setPost(data);
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response.status)
                }
                else console.error("Cannot get data from server!")
            });
    }, []);
    React.useEffect(() => {
        // Check if user is logged in and show snackbar
        if (post) {
            getReviews();
        }
    }, [post]);

    const getReviews = async () => {
        console.log(post?.resortId?._id)
        const data = await GetReviewByResortId(post?.resortId?._id);
        console.log(data);
        setReviews(data);
    }
    //destructure properties from tour object
    //const { photo, title, desc, price, address, reviews, city, distance, maxGroupSize, time } = tour

    const { totalRating, avgRating } = calculateAvgRating([1, 2, 3]);

    //format date
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    //submit request to server
    const submitHandler = async (e) => {
        try {
            e.preventDefault()
            if (rating) {
                const reviewText = reviewMsgRef.current.value;
                await UploadReview({
                    resortId: post?.resortId?._id,
                    star: rating,
                    description: reviewText,
                })
                await getReviews();
                reviewMsgRef.current.value = ""; // Clear input field
                setRating(0); // Reset rating state if needed
            }
            else enqueueSnackbar(`Star rating is required!`, { variant: "error" });
        }
        catch (error) {
            enqueueSnackbar(`${error}`, { variant: "error" });
        }
    }

    return <>
        <Header />
        <section>
            <Container>
                <Row>
                    {/* {(user?._id === post?.current_owner?._id) &&
                        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                            <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '60%' }}>
                                CAN'T RENT/EXCHANGE ON YOUR TIMESHARE
                            </MuiAlert>
                        </Snackbar>} */}
                    <Col lg='12'>
                        <div className="tour__content">
                            <Row>
                                <Col lg='6'>
                                    {post && <ImageGallery items={convertImageArray([...post.images, ...post.resortId.image_urls])} showPlayButton={false} />}
                                </Col>
                                <Col lg='6'>
                                    <div className='tour__info'>
                                        <Box sx={{ color: 'white', float: 'right', textAlign: 'center', backgroundColor: 'gray', paddingRight: '15px', paddingLeft: '15px', width: 'fit-content', borderRadius: '5px' }}>
                                            {(post?.is_bookable === false) ? 'SOLD' : ''}
                                        </Box>
                                        <h2>{post?.resortId.name}</h2>
                                        <div className='d-flex align-items-center gap-5'>
                                            <span className='d-flex align-items-center gap-1'>
                                                <span className='tour__rating d-flex align-items-center gap-1'>
                                                    <i class="ri-star-s-fill" style={{ 'color': "var(--secondary-color)" }}></i>
                                                    {avgRating === 0 ? null : avgRating}
                                                    {totalRating === 0 ? 'Not rated' : <span>({'reviews?.length'})</span>
                                                    }
                                                </span>
                                            </span>
                                            <span>
                                                <i class="ri-map-pin-line"></i> {post?.resortId.location}
                                            </span>
                                            <div>
                                                {/* <Renting tour={tour} avgRating={avgRating} /> */}
                                            </div>
                                        </div>
                                        <div className='tour__extra-details'>
                                            <span>
                                                <i class="ri-map-pin-range-line"></i>{post?.resortId.location}
                                            </span>
                                            <span>
                                                <i class="ri-money-dollar-circle-line"></i>{post?.price}
                                            </span>
                                            <span>
                                                <i class="ri-time-line"></i> {convertDate(post?.start_date)} - {convertDate(post?.end_date)}
                                            </span>
                                        </div>
                                        <div>
                                            <h5>Description</h5>
                                            <p>{post?.resortId.description}</p>
                                        </div>
                                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: '5px', marginTop: 10, marginBottom: 10 }}>
                                            <img style={{ borderRadius: "50%", margin: 0, width: 40, height: 40 }} src={post?.current_owner?.profilePicture} />
                                            <p style={{ margin: 0 }}>Post by: {post?.current_owner?.username}</p>
                                        </div>
                                        <>
                                            <div className="text-center" style={{ display: "flex", alignItems: "center", gap: '5px' }}>
                                                {user?._id === post?.current_owner?._id ? (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="large"
                                                            onClick={() => navigate(`/me/my-timeshares/timeshares-list/${id}`)}
                                                        >
                                                            Manage
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {post?.is_bookable === true && post?.type === 'rental' && (
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                size="large"
                                                                onClick={() => { navigate(`/timeshare/${post?._id}/book`) }}
                                                            >
                                                                Rent Now
                                                            </Button>
                                                        )}
                                                        {post?.is_bookable === true && post?.type === 'exchange' && (
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                size="large"
                                                                onClick={() => { navigate(`/timeshare/${post?._id}/exchange`) }}
                                                            >
                                                                Request to exchange
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </>

                                    </div>
                                </Col>
                            </Row>
                            {/*===========tour review section first========== */}
                            <div className='tour__reviews mt-4'>
                                <h4>Reviews ({reviews?.length} reviews)</h4>
                                <Box>
                                    <Form onSubmit={submitHandler}>
                                        <Rating
                                            name="simple-controlled"
                                            size='large'
                                            value={rating}
                                            onChange={(event, newValue) => {
                                                setRating(newValue);
                                            }}
                                        />
                                        <div className="review__input">
                                            <input
                                                type="text"
                                                name="description"
                                                ref={reviewMsgRef}
                                                placeholder='Share your thoughts'
                                                required />
                                            <button className='btn primary__btn text-white'
                                                type='submit'>
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Box>
                                <ListGroup className='user__reviews'>
                                    {
                                        reviews?.map(review => (
                                            <div className="review__item">
                                                <img src={review.userId.profilePicture} alt="" />

                                                <div className="w-100">
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <div>
                                                            <h5>{review?.userId?.username}</h5>
                                                            <p>{convertDateTime(review?.timestamp)}</p>
                                                        </div>
                                                        <span className='d-flex align-items-center'>
                                                        <Rating name="read-only" value={review.star} readOnly />
                                                        </span>
                                                    </div>
                                                    <h6>{review.description}</h6>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </ListGroup>
                            </div>
                        </div>
                    </Col>
                    {/* <Col lg='4'>
                        <Renting tour={tour} avgRating={avgRating} />
                    </Col> */}
                </Row>
            </Container>
        </section>
        <Footer />
    </>
}

export default TimeShareDetails