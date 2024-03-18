import React, { useEffect } from 'react';
import { Card, CardBody } from "reactstrap";
import { Link } from 'react-router-dom';
import './tour-card.css'
import calculateAvgRating from '../utils/avgRating';
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/joy/Stack";
import Chip from '@mui/material/Chip';
import { convertDate } from '../utils/date';
import stringToArray from '../utils/stringToArray';

const TourCard = ({ props }) => {
    useEffect(() => {
        console.log(props);
    }, [])
    const post = {
        id: props._id,
        title: props.resortId.name,
        location: props.resortId.location,
        image: props.images[0],
        price: props.price,
        pricePerNight: props.pricePerNight,
        numberOfNights: props.numberOfNights,
        unit: stringToArray(props.unitId.details),
        startDate: convertDate(props.start_date),
        endDate: convertDate(props.end_date),
        type: props.type,
        reviews: [3, 4, 5],
    };
    //const { _id, title, city, photo, price, price2, time, newrental, reviews } = tour;

    const { totalRating, avgRating } = calculateAvgRating(post.reviews)

    return <div className='tour__card'>
        <Link to={`/timeshare-details/${post.id}`} style={{ textDecoration: 'none' }}>
            <Card>
            <div className="tour__img">
                <img src={post.image} alt="tour-img" />
                <span className="top"><b>New</b></span>
                <span className="bottom"><b>{post?.type}</b></span>

            </div>

                <CardBody>
                    <div className='card__top d-flex align-items-center justify-content-between'>
                        <span className='tour__location d-flex align-items-center gap-1'>
                            <i class="ri-map-pin-line"></i> {post.location}
                        </span>
                        <span className='tour__rating d-flex align-items-center gap-1'>
                            <i class="ri-star-fill"></i> {avgRating === 0 ? null : avgRating}
                            {totalRating === 0 ? 'Not rated' : <span>({post.reviews.length})</span>
                            }
                        </span>
                    </div>
                    <h5 className='tour__title'>{post.title}</h5>
                    <Stack sx={{ width: 1, display: 'flex', justifyContent: 'center' }} direction="column" spacing={0} justifyContent="center">
                        <Box>
                            <Typography fontWeight={500} fontSize={14}>
                                Unit:
                            </Typography>
                            <Stack direction="row">
                                {post.unit.map(u => (
                                    <Chip 
                                        label={u} 
                                        size="small" 
                                        variant="outlined" 
                                        sx={{ marginRight: '5px',borderRadius: '5px', width: '100%', height: '30px' }} // Set width and height to create square shape
                                    />
                                ))}
                            </Stack>
                        </Box>
                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight={500} fontSize={14}>
                                Stay:
                            </Typography>
                            <Typography fontWeight={400} fontSize={14}>
                                {post.numberOfNights} night
                            </Typography>
                        </Box>
                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', }}>
                            <Typography fontWeight={500} fontSize={14}>
                                Check-in:
                            </Typography>
                            <Typography fontWeight={400} fontSize={14}>
                                {post.startDate}
                            </Typography>
                        </Box>
                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight={500} fontSize={14}>
                                Check-out:
                            </Typography>
                            <Typography fontWeight={400} fontSize={14}>
                                {post.endDate}
                            </Typography>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 1 }} />
                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight={500} fontSize={18}>
                                Price/night:
                            </Typography>
                            <Typography fontWeight={400} fontSize={18}>
                                {post.pricePerNight}$
                            </Typography>
                        </Box>
                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight={500} fontSize={18}>
                                Total:
                            </Typography>
                            <Typography fontWeight={600} fontSize={18}>
                                {post.price}$
                            </Typography>
                        </Box>
                    </Stack>
                    {/*<div className='card__bottom d-flex align-items-center justify-content-between mt-3'>*/}
                    {/*    <h5>${price} (${price2}/night)</h5>*/}
                    {/*    <button className='btn booking__btn'>*/}
                    {/*        <Link to={`/timesharedetails/${id}`}>Rent/Exchange</Link>*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                    {/*<div className='tour__daydetails'>*/}
                    {/*    <h5><span>{time}</span></h5>*/}
                    {/*</div>*/}
                </CardBody>

            </Card>
        </Link>


    </div>;

}

export default TourCard