import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Box from "@mui/joy/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/joy/Stack";
import {useSelector} from "react-redux";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {GetPostById} from "../../services/post.service";
import CssBaseline from "@mui/joy/CssBaseline";
import Grid from "@mui/joy/Grid";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CountrySelector from "../../components/Profile/CountrySelector";
import CardActions from "@mui/joy/CardActions";
import {CssVarsProvider} from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import {GetReservationById, ConfirmReservationByToken} from "../../services/booking.service";
import {GetExchangeById} from "../../services/booking.service";
import {SendConfirmReservationEmail} from "../../services/email.service";
import FeedIcon from '@mui/icons-material/Feed';

interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}

const VerificationCard = () => {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [post, setPost] = React.useState<any>([]);
    const [exchange, setExchange] = React.useState<any>([]);
    const [sendingEmail, setSendingEmail] = React.useState<boolean>(false);
    const [sendButtonDisabled, setSendButtonDisabled] = React.useState<boolean>(false);
    const navigate = useNavigate();
    let {timeshareId, exchangeId} = useParams();
    let [searchParams, setSearchParams] = useSearchParams();
    let token = searchParams.get('token');

    React.useEffect(() => {
        Load()
    }, [timeshareId, exchangeId, token])

    async function Load() {
        if (timeshareId) {
            const postData = await GetPostById(timeshareId);
            if (postData) {
                setPost(postData)
            }
        }
        if (exchangeId) {
            const exchangeData = await GetExchangeById(exchangeId);
            if (exchangeData) {
                setExchange(exchangeData)
            }
        }
        if (token) {
            const data = await ConfirmReservationByToken(exchangeId, token);
        }
    }

    const SendEmail = async () => {
        if (exchange) {
            setSendingEmail(true);
            const emailSent = await SendConfirmReservationEmail(exchange);
            if (emailSent?.status?.code === 200) {
                setSendingEmail(false);
                setSendButtonDisabled(true);
            }
        }
    };

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
        <>
            <Header/>
            <CssVarsProvider disableTransitionOnChange>
                <CssBaseline/>
                {/*<NavBar />*/}
                <Grid container spacing={0}
                      sx={{flexGrow: 1, width: 1, px: 10, mt: 2, gap: 1, flexWrap: {xs: 'wrap', md: 'nowrap',}}}>
                    <Grid xs={12} md={8} sx={{p: 1, boxShadow: '0 0 0px gray'}}>
                        <Typography fontWeight={700} fontSize={26}>
                            Request Exchange
                        </Typography>
                        <Box sx={{width: 1}}>
                            <Card
                                size="lg"
                                variant="outlined"
                                orientation="horizontal"
                                sx={{
                                    textAlign: 'center',
                                    maxWidth: '100%',
                                    width: 1,
                                    mx: 'auto',
                                    mb: 20,
                                    // to make the demo resizable
                                    resize: 'horizontal',
                                    overflow: 'auto',
                                }}
                            >
                                <CardOverflow
                                    variant="outlined"
                                    // color="primary"
                                    sx={{
                                        flex: '0 0 300px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        px: 1
                                        // justifyContent: 'center',
                                        // px: 'var(--Card-padding)',
                                    }}
                                >
                                    <Typography fontWeight={500} fontSize={22}>
                                        <FeedIcon/>
                                        Information
                                    </Typography>

                                    <Box sx={{
                                        width: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 2,
                                        mt: 2
                                    }}>
                                        <Typography fontWeight={500} fontSize={18}>
                                            Fullname:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={18}>
                                            {exchange?.fullName}
                                        </Typography>

                                    </Box>
                                    <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography fontWeight={500} fontSize={18}>
                                            Phone:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={18}>
                                            {exchange?.phone}
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography fontWeight={500} fontSize={18}>
                                            Email:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={18}>
                                            {exchange?.email}
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between', mt: 2}}>
                                        <Typography fontWeight={500} fontSize={18}>
                                            Address:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={18}>

                                        </Typography>
                                    </Box>
                                    <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography fontWeight={500} fontSize={16}>
                                            Street:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={16}>
                                            {exchange?.address?.street}
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography fontWeight={500} fontSize={16}>
                                            City:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={16}>
                                            {exchange?.address?.city}
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography fontWeight={500} fontSize={16}>
                                            Province:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={16}>
                                            {exchange?.address?.province}
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography fontWeight={500} fontSize={16}>
                                            Country:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={16}>
                                            {exchange?.address?.country}
                                        </Typography>
                                    </Box>
                                    <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                        <Typography fontWeight={500} fontSize={16}>
                                            Zip code:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={16}>
                                            {exchange?.address?.zipCode}
                                        </Typography>
                                    </Box>
                                </CardOverflow>
                                <CardContent sx={{gap: 1.5, minWidth: 200}}>
                                    <AspectRatio ratio="19/8" objectFit="contain" variant="plain"
                                                 sx={{display: 'flex', justifyContent: 'center'}}>
                                        <img src={'https://www.modify.in.th/wp-content/uploads/Gmail_icon.png'}
                                             width={2}/>
                                    </AspectRatio>
                                    <CardContent>
                                        <Typography level="title-lg">Confirm reservation</Typography>
                                        <Typography fontSize="sm" sx={{mt: 0.5}}>
                                            To finish, go to mail application to confirm your reservation
                                        </Typography>
                                    </CardContent>


                                    {(exchange?.is_confirmed === true) ?
                                        <Typography color={'success'} fontWeight={500} fontSize={20}>Confirm
                                            successfully</Typography> :
                                        <CardContent>
                                            <Button
                                                variant="solid"
                                                color="primary"
                                                loading={sendingEmail}
                                                disabled={sendButtonDisabled}
                                                sx={{
                                                    '--variant-borderWidth': '2px',
                                                    borderRadius: 40,
                                                    borderColor: 'primary.500',
                                                    mx: 'auto',
                                                }}
                                                onClick={SendEmail}
                                            >
                                                Send mail
                                            </Button>
                                            <Typography>Haven't received email yet !</Typography>
                                            <a href={''}
                                               onClick={(e) => {
                                                   e.preventDefault();
                                                   setSendButtonDisabled(false);
                                               }
                                               }>
                                                Resend email</a>
                                        </CardContent>}

                                </CardContent>

                            </Card>
                        </Box>
                    </Grid>
                    <Grid xs={12} md={4} sx={{p: 1, boxShadow: '0 0 4px gray', height: 'fit-content',}}>
                        <Stack sx={{width: 1, display: 'flex', justifyContent: 'center'}} direction="column" spacing={0}
                               justifyContent="center">
                            <img src={post?.resortId?.image_urls}/>
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
                        </Stack>
                    </Grid>
                </Grid>
            </CssVarsProvider>


            <Footer/>
        </>

    );
};

export default VerificationCard;