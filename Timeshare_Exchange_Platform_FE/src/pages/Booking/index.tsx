import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import NavBar from '../../components/Rental/NavBar';
import { GetPostById } from '../../services/post.service';
import Grid from '@mui/joy/Grid';
import { Button, FormHelperText, Typography } from '@mui/joy';
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
import { NavLink, useNavigate } from 'react-router-dom';
import { MakeReservation } from '../../services/booking.service';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InfoOutlined } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { RootState } from '../../features/auth/auth.slice';

interface FormData {
    fullName: string,
    email: string,
    phone: string,
    amount: number,
    userId: string,
    timeshareId: any,
    country: string,
    street: string,
    city: string,
    province: string,
    zipCode: number,
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
const schema = yup.object().shape({
    fullName: yup.string()
        .required("Full Name is required!"),
    email: yup.string()
        .required("Email is required!")
        .email("Email is invalid!"),
    phone: yup.string()
        .required("Phone number is required!"),
    street: yup.string(),
    city: yup.string(),
    province: yup.string(),
    zipCode: yup.string(),
})

export default function Booking() {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const isAuthLoaded = useSelector((state: RootState) => state.auth.isLoaded);
    React.useEffect(() => {
        if (!isAuthenticated && isAuthLoaded) {
            navigate('/login');
        }
    }, [isAuthenticated, isAuthLoaded]);
    const [timeshare, setTimeshare] = React.useState<any>([]);
    const [country, setCountry] = React.useState<any>({ code: 'VN', label: 'Vietnam', phone: '84' });
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    let { timeshareId } = useParams();
    const [uploading, setUploading] = React.useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
    })

    async function handleRental(e: any) {
        try {
            console.log(e)
            setUploading(true)
            //e.preventDefault();
            const formData: FormData = {
                fullName: e.fullName,
                email: e.email,
                phone: e.phone,
                amount: timeshare?.price,
                userId: user?._id,
                timeshareId: timeshareId,
                country: country.label,
                street: e?.street,
                city: e?.city,
                province: e?.province,
                zipCode: e?.zipCode,
            }
            console.log(formData);
            const reservation = await MakeReservation('rent', formData);
            if (reservation) {
                // console.log(reservation)
                navigate(`/timeshare/${timeshareId}/reservation/${reservation?._id}/confirm`)
                enqueueSnackbar("Booked successully", { variant: "success" });
                setUploading(false)
            }
        }
        catch (error: any) {
            console.log(error)
            enqueueSnackbar(`Error while booking: ${error?.message}`, { variant: "error" });
            setUploading(false)
        }
    }

    React.useEffect(() => {
        Load()
    }, [])

    async function Load() {
        try {
            if (timeshareId) {
                const timeshareData = await GetPostById(timeshareId);
                if (timeshareData) {
                    setTimeshare(timeshareData)
                }
            }
        }
        catch (error) {
            navigate('/home');
            enqueueSnackbar(`${error}`, { variant: "error" });
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
        <>
            {isAuthenticated &&
                <>
                    <Header />
                    <CssVarsProvider disableTransitionOnChange>
                        <CssBaseline />
                        {/*<NavBar />*/}
                        <Grid container spacing={0}
                            sx={{ flexGrow: 1, width: 1, px: 10, mt: 2, gap: 1, flexWrap: { xs: 'wrap', md: 'nowrap', } }}>
                            <Grid xs={12} md={8} sx={{ p: 1, boxShadow: '0 0 0px gray' }}>
                                <Typography fontWeight={700} fontSize={26}>
                                    Booking request
                                </Typography>
                                <form onSubmit={handleSubmit(handleRental)}>
                                    <Box sx={{
                                        width: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 2,
                                        p: 1,
                                        boxShadow: '0 0 4px gray',
                                    }}>
                                        <Stack direction="column" spacing={4} sx={{ width: 1, mt: 1 }}>
                                            {/* <FormControl sx={{ display: 'inline', gap: 1, width: 0.15 }}>
                                    <FormLabel>Guest number</FormLabel>
                                    <Select defaultValue="1">
                                        <Option value="1">1</Option>
                                        <Option value="2">2</Option>
                                        <Option value="3">3</Option>
                                        <Option value="4">4</Option>
                                        <Option value="5">5</Option>
                                        <Option value="6">6</Option>
                                    </Select>
                                </FormControl> */}

                                            {/* ////////// */}
                                            <FormControl sx={{ display: 'inline', gap: 1, width: 0.5 }}>
                                                <FormLabel>Full name</FormLabel>
                                                <Input
                                                    type="text"
                                                    size="md"
                                                    placeholder="Full name"
                                                    {...register('fullName')}
                                                    defaultValue={user?.firstname + " " + user?.lastname}
                                                    error={!!errors.fullName}
                                                    sx={{}}
                                                />
                                                {errors.fullName && <FormHelperText><InfoOutlined />{errors.fullName.message}</FormHelperText>}
                                                <FormLabel sx={{ mt: 2 }}>Email</FormLabel>
                                                <Input
                                                    size="md"
                                                    type="email"
                                                    startDecorator={<EmailRoundedIcon />}
                                                    placeholder="email"
                                                    {...register('email')}
                                                    defaultValue={user?.email}
                                                    error={!!errors.email}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                {errors.email && <FormHelperText><InfoOutlined />{errors.email.message}</FormHelperText>}
                                                <FormLabel sx={{ mt: 2 }}>Phone</FormLabel>
                                                <Input
                                                    size="md"
                                                    placeholder="Phone"
                                                    {...register('phone')}
                                                    defaultValue={user?.phone}
                                                    error={!!errors.phone}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                {errors.phone && <FormHelperText><InfoOutlined />{errors.phone.message}</FormHelperText>}
                                                <FormLabel sx={{ mt: 2 }}>Country</FormLabel>
                                                <CountrySelector/>
                                            </FormControl>
                                            <FormControl sx={{ display: 'inline', gap: 1, width: 1 }}>
                                                <FormLabel sx={{}}>Street</FormLabel>
                                                <Input
                                                    size="md"
                                                    placeholder="Street"
                                                    {...register('street')}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ display: 'inline-flex', gap: 1, width: 1 }}>
                                                <Grid container spacing={0} sx={{
                                                    flexGrow: 1,
                                                    width: 1,
                                                    gap: 1,
                                                    flexWrap: { xs: 'wrap', md: 'nowrap', }
                                                }}>
                                                    <Grid xs={12} md={4}>
                                                        <FormLabel sx={{}}>City</FormLabel>
                                                        <Input
                                                            size="md"
                                                            placeholder="City"
                                                            {...register('city')}
                                                            sx={{ flexGrow: 1 }}
                                                        />
                                                    </Grid>
                                                    <Grid xs={12} md={4}>
                                                        <FormLabel sx={{}}>Province</FormLabel>
                                                        <Input
                                                            size="md"
                                                            placeholder="Province"
                                                            {...register('province')}
                                                            sx={{ flexGrow: 1 }}
                                                        />
                                                    </Grid>
                                                    <Grid xs={12} md={4}>
                                                        <FormLabel sx={{}}>ZipCode</FormLabel>
                                                        <Input
                                                            size="md"
                                                            placeholder="Zip code"
                                                            {...register('zipCode')}
                                                            sx={{ flexGrow: 1 }}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <FormControl sx={{ display: 'none' }}>
                                                    <Input type="hidden" name="amount" value={timeshare?.price} />
                                                </FormControl>
                                                <FormControl sx={{ display: 'none' }}>
                                                    <Input type="hidden" name="userId" value={user?._id} />
                                                </FormControl>
                                                <FormControl sx={{ display: 'none' }}>
                                                    <Input type="hidden" name="timeshareId" value={timeshareId} />
                                                </FormControl>
                                                <FormControl sx={{ display: 'none' }}>
                                                    <Input type="hidden" name="reservationDate"
                                                        value={new Date().toLocaleString() + ""} />
                                                </FormControl>
                                            </FormControl>

                                        </Stack>
                                    </Box>
                                    <CardOverflow sx={{
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        mt: 2,
                                        width: 1,
                                        display: 'flex',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <CardActions sx={{ alignSelf: 'flex-end', pt: 2, gap: 2 }}>
                                            <Button size="sm" variant="outlined" color="neutral">
                                                Cancel
                                            </Button>
                                            <Button loading={uploading} size="sm" variant="solid" type='submit'>
                                                Book Now
                                            </Button>
                                        </CardActions>
                                    </CardOverflow>
                                </form>
                            </Grid>
                            <Grid xs={12} md={4} sx={{ p: 1, boxShadow: '0 0 4px gray', height: 'fit-content', }}>
                                <Stack sx={{ width: 1, display: 'flex', justifyContent: 'center' }} direction="column" spacing={0}
                                    justifyContent="center">
                                    <img src={timeshare?.resortId?.image_urls} />
                                    <Typography fontWeight={600} fontSize={28}>
                                        {timeshare?.resortId?.name}
                                    </Typography>
                                    <Typography fontWeight={400} fontSize={18}>
                                        Post: #{timeshare?._id}
                                    </Typography>
                                    <Typography fontWeight={400} fontSize={18}>
                                        Owner: {timeshare?.current_owner?.username}
                                    </Typography>
                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Typography fontWeight={500} fontSize={20}>
                                            Unit:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={20}>
                                            {timeshare?.unitId?.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography fontWeight={500} fontSize={20}>
                                            Stay:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={20}>
                                            {timeshare?.numberOfNights} night
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', }}>
                                        <Typography fontWeight={500} fontSize={20}>
                                            Check-in:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={20}>
                                            {formatDate(timeshare?.start_date)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography fontWeight={500} fontSize={20}>
                                            Check-out:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={20}>
                                            {formatDate(timeshare?.end_date)}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mt: 1, mb: 1 }} />
                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography fontWeight={500} fontSize={20}>
                                            Price/night:
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={20}>
                                            ${timeshare?.pricePerNight}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography fontWeight={500} fontSize={20}>
                                            Total:
                                        </Typography>
                                        <Typography fontWeight={600} fontSize={20}>
                                            ${timeshare?.price}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CssVarsProvider>
                    <Footer />
                </>
            }
        </>
    );

}