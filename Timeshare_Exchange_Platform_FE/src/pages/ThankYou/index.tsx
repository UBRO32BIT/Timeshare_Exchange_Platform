import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import NavBar from '../../components/Rental/NavBar';
import { GetPostById } from '../../services/post.service';
import Grid from '@mui/joy/Grid';
import { Button, Typography } from '@mui/joy';
import { Routes, Route, useParams } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import { shadows } from '@mui/system';
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
import { useSelector } from 'react-redux';
import { NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { MakeReservation, ExecutePayPalPayment, GetReservationById } from '../../services/booking.service';
import Sheet from '@mui/joy/Sheet';
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

export default function ThankYou() {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [post, setPost] = React.useState<any>([]);
    let [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const paymentData = useLocation();
    let { postId, reservationId } = useParams();
    let paymentId = searchParams.get('paymentId');
    let PayerID = searchParams.get('PayerID');
    const [uploading, setUploading] = React.useState<boolean>(false);
    async function handleAccept(e: any) {
        setUploading(true)
        e.preventDefault();
        const reservationData = await GetReservationById(reservationId);
        const totalAmount = reservationData?.amount
        const data = {
            reservationId,
            paymentId,
            PayerID,
            totalAmount
        }
        const executed = await ExecutePayPalPayment(data);
        if (executed) {
            setUploading(false)
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
            <CssBaseline />
            <NavBar />
            <Grid container spacing={0} sx={{ flexGrow: 1, width: 1, pr: 4, pl: 4, mt: 2, gap: 1, flexWrap: { xs: 'wrap', md: 'nowrap', } }}>
                <Sheet variant="outlined" color="neutral" sx={{ p: 4 }}>
                    Thanh toán thành công
                    <NavLink to="/me/my-order"  >
                    <Typography level="title-sm">Return to My orders</Typography>
                </NavLink>
                </Sheet>
                
            </Grid>
        </CssVarsProvider>
    );
}