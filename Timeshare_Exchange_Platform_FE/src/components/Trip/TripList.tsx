import * as React from 'react';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { styled, Grid } from '@mui/joy';
import { useSelector } from 'react-redux';
import { UpdateUser } from '../../services/auth.service';
import { GetReservationOfUser, GetTripOfUser } from '../../services/booking.service';
import { Routes, Route, Navigate, useNavigate, NavLink, Link } from "react-router-dom";
import AspectRatio from '@mui/joy/AspectRatio';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import Chip from '@mui/joy/Chip';
import JsBarcode from 'jsbarcode';
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
var { createCanvas } = require("canvas");
// import Canvas
interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}

export default function TripList() {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [myTrips, setTrips] = React.useState([]);
    const navigate = useNavigate()

    function formatDate(dateString?: string): string {
        if (!dateString) return '';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    async function GetMyReservations(userId: string) {
        const tripData = await GetTripOfUser(userId);
        if (tripData && tripData.length > 0) {
            console.log(tripData);
            setTrips(tripData);
        }
    }

    var canvas = createCanvas(40, 40, 'svg');

    console.log(JsBarcode(canvas, "Hello"));
    React.useEffect(() => {
        if (user?._id) {
            GetMyReservations(user?._id)
        }
    }, [user])
    return (
        <Grid container spacing={2} sx={{ flexGrow: 1, mx: { xs: 2, md: 5 }, mt: 2, }}>
            <Grid
                md={12} xs={12}
                sx={{
                    display: 'flex',
                    gap: 3,
                    // p: 0,
                    mb: 2
                }}>
                <FormControl size="sm">
                    <FormLabel>Status</FormLabel>
                    <Select
                        size="sm"
                        placeholder="Filter by status"
                        slotProps={{button: {sx: {whiteSpace: 'nowrap'}}}}
                    >
                        <Option value="paid">Paid</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="refunded">Refunded</Option>
                        <Option value="cancelled">Cancelled</Option>
                    </Select>
                </FormControl>
                <FormControl size="sm">
                    <FormLabel>Category</FormLabel>
                    <Select size="sm" placeholder="All">
                        <Option value="all">All</Option>
                        <Option value="refund">Refund</Option>
                        <Option value="purchase">Purchase</Option>
                        <Option value="debit">Debit</Option>
                    </Select>
                </FormControl>
                <FormControl size="sm">
                    <FormLabel>Customer</FormLabel>
                    <Select size="sm" placeholder="All">
                        <Option value="all">All</Option>
                        <Option value="olivia">Olivia Rhye</Option>
                        <Option value="steve">Steve Hampton</Option>
                        <Option value="ciaran">Ciaran Murray</Option>
                        <Option value="marina">Marina Macdonald</Option>
                        <Option value="charles">Charles Fulton</Option>
                        <Option value="jay">Jay Hoper</Option>
                    </Select>
                </FormControl>
            </Grid>
                {myTrips.length > 0 && myTrips.map((item: any) => {
                    return (<Grid xs={12} md={6} lg={4} >
                        <Card orientation="horizontal" variant="outlined" sx={{}}>
                            <CardOverflow>
                                <AspectRatio ratio="0.6" sx={{ width: 120, height: 1 }}>
                                    <img
                                        src={item?.resortId?.image_urls}
                                        // srcSet="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90&dpr=2 2x"
                                        loading="lazy"
                                        alt=""
                                    />
                                </AspectRatio>
                            </CardOverflow>
                            <CardContent>
                                <Typography fontWeight="md" textColor="success.plainColor">
                                    {item?.resortId?.name}
                                </Typography>
                                <Typography level="body-sm">{item?.unitId?.name}</Typography>
                                <Typography level="body-sm"><strong>Check-in:  </strong>{formatDate(item?.check_in)}</Typography>
                                <Typography level="body-sm"><strong>Check-out:  </strong>{formatDate(item?.check_out)}</Typography>
                                {/* <svg id="code"></svg> */}
                            </CardContent>
                            <CardOverflow
                                variant="soft"
                                color="primary"
                                sx={{
                                    px: 0.2,
                                    writingMode: 'vertical-rl',
                                    justifyContent: 'center',
                                    fontSize: 'xs',
                                    fontWeight: 'xl',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    borderLeft: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                Ticket
                            </CardOverflow>
                        </Card>
                    </Grid>)
                })}
        </Grid>

    )
}
