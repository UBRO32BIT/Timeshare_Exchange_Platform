import * as React from 'react';
import {CssVarsProvider} from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import NavBar from '../../components/Rental/NavBar';
import {GetPostById} from '../../services/post.service';
import Grid from '@mui/joy/Grid';
import {Button, Typography} from '@mui/joy';
import {Routes, Route, useParams} from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import {shadows} from '@mui/system';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import CountrySelector from '../../components/Profile/CountrySelector';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import {useSelector} from 'react-redux';
import {NavLink, useNavigate, useSearchParams} from 'react-router-dom';
import {MakeReservation, ExecutePayPalPayment, GetReservationById} from '../../services/booking.service';

interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}

interface Unit {
    _id: string;
    name: string;
    details: string;
}

interface Resort {
    _id: string;
    name: string;
    location: string;
    description: string;
    facilities: string[];
    nearby_attractions: string[];
    policies: string[];
    image_urls: string[];
    units: Unit[];
    start_date: Date;
    end_date: Date;
    numberOfNights: number;
    pricePerNight: string;
}

export default function ReviewOrder() {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [post, setPost] = React.useState<any>([]);
    let [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    let {postId, reservationId} = useParams();
    let paymentId = searchParams.get('paymentId');
    let PayerID = searchParams.get('PayerID');
    const [uploading, setUploading] = React.useState<boolean>(false);

    async function handleAccept(e: any) {
        setUploading(true)
        e.preventDefault();
        const reservationData = await GetReservationById(reservationId);
        const totalAmount = reservationData?.amount
        const postId = reservationData?.postId?._id
        const userId = user?._id
        const data = {
            userId,
            postId,
            reservationId,
            paymentId,
            PayerID,
            totalAmount
        }
        const executed = await ExecutePayPalPayment(data);
        if (executed) {
            setUploading(false)
            if (executed?.state === "approved") navigate('/thank-you', executed)
        }
    }

    React.useEffect(() => {
        Load()
    }, [])

    async function Load() {
        if (postId) {
            const postData = await GetPostById(postId);
            if (postData) {
                setPost(postData)
            }
        }
    }

    function formatDate(dateString?: string): string {
        if (!dateString) return '';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline/>
            <NavBar/>
            <Grid container spacing={0}
                  sx={{flexGrow: 1, width: 1, pr: 4, pl: 4, mt: 2, gap: 1, flexWrap: {xs: 'wrap', md: 'nowrap',}}}>
                <Box sx={{
                    width: 0.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2,
                    p: 1,
                    boxShadow: '0 0 4px gray',
                }}>
                    <Stack sx={{width: 1, display: 'flex', justifyContent: 'center'}} direction="column" spacing={0}
                           justifyContent="center">
                        {/* <img src={post?.resortId?.image_urls} /> */}
                        <Typography fontWeight={600} fontSize={28}>
                            {post?.resortId?.name}
                        </Typography>
                        <Typography fontWeight={400} fontSize={18}>
                            Post: #{post?._id}
                        </Typography>
                        <Typography fontWeight={400} fontSize={18}>
                            Owner: {post?.current_owner?.username}
                        </Typography>
                        <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between', mt: 2}}>
                            <Typography fontWeight={500} fontSize={20}>
                                Unit:
                            </Typography>
                            <Typography fontWeight={400} fontSize={20}>
                                {post?.unitId?.name}
                            </Typography>
                        </Box>
                        <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                            <Typography fontWeight={500} fontSize={20}>
                                Stay:
                            </Typography>
                            <Typography fontWeight={400} fontSize={20}>
                                {post?.numberOfNights} night
                            </Typography>
                        </Box>
                        <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between',}}>
                            <Typography fontWeight={500} fontSize={20}>
                                Check-in:
                            </Typography>
                            <Typography fontWeight={400} fontSize={20}>
                                {formatDate(post?.start_date)}
                            </Typography>
                        </Box>
                        <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                            <Typography fontWeight={500} fontSize={20}>
                                Check-out:
                            </Typography>
                            <Typography fontWeight={400} fontSize={20}>
                                {formatDate(post?.end_date)}
                            </Typography>
                        </Box>
                        <Divider sx={{mt: 1, mb: 1}}/>
                        <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                            <Typography fontWeight={500} fontSize={20}>
                                Price/night:
                            </Typography>
                            <Typography fontWeight={400} fontSize={20}>
                                ${post?.pricePerNight}
                            </Typography>
                        </Box>
                        <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                            <Typography fontWeight={500} fontSize={20}>
                                Total:
                            </Typography>
                            <Typography fontWeight={600} fontSize={20}>
                                ${post?.price}
                            </Typography>
                        </Box>
                        <CardOverflow sx={{
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            mt: 2,
                            width: 1,
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                            <CardActions sx={{alignSelf: 'flex-end', pt: 2, gap: 2}}>
                                <Button size="sm" variant="outlined" color="neutral">
                                    Cancel
                                </Button>
                                {uploading ? (<Button loading size="sm" variant="solid" type='submit'>
                                    Save
                                </Button>) : <Button size="sm" variant="solid" onClick={handleAccept}>
                                    Place order
                                </Button>}
                            </CardActions>
                        </CardOverflow>
                    </Stack>
                </Box>
            </Grid>
        </CssVarsProvider>
    );
}