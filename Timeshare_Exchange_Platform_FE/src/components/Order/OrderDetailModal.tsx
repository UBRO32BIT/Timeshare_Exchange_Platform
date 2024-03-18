import * as React from 'react';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {styled, Grid, Button} from '@mui/joy';
import {useSelector} from 'react-redux';
import {UpdateUser} from '../../services/auth.service';
import {GetReservationOfUser} from '../../services/booking.service';
import {Routes, Route, Navigate, useNavigate, NavLink, Link} from "react-router-dom";
import AspectRatio from '@mui/joy/AspectRatio';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import Chip from '@mui/joy/Chip';
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {Transition} from "react-transition-group";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import DialogContent from "@mui/joy/DialogContent";
import MenuItem from "@mui/joy/MenuItem";
import Stack from "@mui/joy/Stack";
import PaymentIcon from '@mui/icons-material/Payment';
import Input from "@mui/joy/Input";
import {InfoOutlined} from "@mui/icons-material";
import Checkbox from "@mui/joy/Checkbox";
import {CreatePayPalPayment} from "../../services/booking.service";
import OrderPaymentInfoModal from "./OrderPaymentInfo";

import LuggageIcon from '@mui/icons-material/Luggage';

import Countdown from "react-countdown";

function CreditCardIcon() {
    return null;
}

export default function OrderDetailModal(props: any) {
    let item = props?.item;
    const open = props.open;
    const setOpen = props.setOpen; // Ensure you pass setOpen as a prop
    const [paymentOpen, setPaymentOpen] = React.useState<boolean>(false);
    const [paymentDetailOpen, setPaymentDetailOpen] = React.useState<boolean>(false);
    const targetTime = item?.paymentDeadline;
    // targetTime.setMinutes(targetTime.getMinutes() + 15);

    async function HandlePayPalPayment(reservation: any) {
        try {
            const paymentUrl = await CreatePayPalPayment(reservation);
            if (paymentUrl) {
                window.open(paymentUrl, '_blank');
            } else {
                console.error('Error: PayPal payment URL is undefined.');
            }
        } catch (err: any) {
            console.log(err)
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
            <Transition in={open} timeout={400}>
                {(state: string) => (
                    <Modal
                        keepMounted
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setOpen(false)}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0,
                                    backdropFilter: 'none',
                                    transition: `opacity 400ms, backdrop-filter 400ms`,
                                    ...(state === 'entering' || state === 'entered'
                                        ? {opacity: 1, backdropFilter: 'blur(8px)'}
                                        : {}),
                                },
                            },
                        }}
                        sx={{
                            visibility: state === 'exited' ? 'hidden' : 'visible',
                        }}
                    >
                        <ModalDialog
                            sx={{
                                opacity: 0,
                                transition: `opacity 300ms`,
                                ...(state === 'entering' || state === 'entered'
                                    ? {opacity: 1}
                                    : {}),
                            }}
                        >
                            <DialogTitle>Reservation Details</DialogTitle>
                            <Grid xs={12} md={12}>
                                <Card
                                    variant="outlined"
                                    orientation="horizontal"
                                    sx={{
                                        width: 1,
                                        '&:hover': {
                                            boxShadow: 'lg',
                                            borderColor: 'neutral.outlinedHoverBorder'
                                        },
                                    }}
                                >
                                    <AspectRatio ratio="1" sx={{width: 160}}>
                                        <img
                                            src={item?.timeshareId?.resortId?.image_urls}
                                            loading="lazy"
                                            alt=""
                                        />
                                    </AspectRatio>
                                    <CardContent>
                                        <Typography level="title-lg" id="card-description" fontSize={14}>
                                            {item?.timeshareId?.resortId?.name}
                                        </Typography>
                                        <Typography level="body-sm" aria-describedby="card-description"
                                                    mb={1}
                                                    fontSize={14}>
                                            {item?.timeshareId?.resortId?.location}
                                        </Typography>
                                        {item?.status === "Canceled" ? <Chip
                                            variant="outlined"
                                            color="danger"
                                            size="sm"
                                            sx={{pointerEvents: 'none', fontSize: 14}}
                                        >
                                            {item?.status}
                                        </Chip>:
                                            <Chip
                                                variant="outlined"
                                                color="primary"
                                                size="sm"
                                                sx={{pointerEvents: 'none', fontSize: 14}}
                                            >
                                                {item?.status}
                                            </Chip>
                                        }
                                        {item?.status === "Canceled" && (
                                            <Typography fontWeight={500} fontSize={14}>
                                                Canceled reason: {item?.cancel_reason}
                                            </Typography>
                                        )}
                                        <Grid container spacing={2} sx={{flexGrow: 1, mt: 1}}>
                                            <Grid xs={12} md={4}>
                                                <Typography fontWeight={700} fontSize={14}>
                                                    Resort info
                                                </Typography>
                                                <Stack sx={{mt: 1}} direction="column" spacing={0}
                                                       justifyContent="center">
                                                    <Typography fontWeight={400} fontSize={14}>
                                                        <b>Name:</b> {item?.timeshareId?.resortId?.name}
                                                    </Typography>
                                                    <Typography fontWeight={400} fontSize={14}>
                                                        <b>Location:</b> {item?.timeshareId?.resortId?.location}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12} md={4}>
                                                <Typography fontWeight={700} fontSize={14}>
                                                    Room type
                                                </Typography>
                                                <Stack sx={{mt: 1}} direction="column" spacing={0}
                                                       justifyContent="center">
                                                    <Typography fontWeight={400} fontSize={14}>
                                                        <b>Unit</b> {item?.timeshareId?.unitId?.name}
                                                    </Typography>
                                                    <Typography fontWeight={400} fontSize={14}>
                                                        <b>Detail</b> {item?.timeshareId?.unitId?.details}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12} md={4}>
                                                <Typography fontWeight={700} fontSize={14}>
                                                    Time & price
                                                </Typography>
                                                <Stack sx={{mt: 1}} direction="column" spacing={0}
                                                       justifyContent="center">
                                                    <Typography fontWeight={400} fontSize={14}>
                                                        <b>Check-in:</b> {formatDate(item?.timeshareId?.start_date)}
                                                    </Typography>
                                                    <Typography fontWeight={400} fontSize={14}>
                                                        <b>Check-out:</b> {formatDate(item?.timeshareId?.end_date)}
                                                    </Typography>
                                                    <Typography fontWeight={400} fontSize={14}>
                                                        <b>Night:</b> {item?.timeshareId?.numberOfNights}
                                                    </Typography>
                                                    <Typography fontWeight={400} fontSize={14}>
                                                        <b>Price:</b> ${item?.timeshareId?.price} (${item?.timeshareId?.pricePerNight}/night)
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                                <Avatar size="sm"
                                        src={item?.userId?.profilePicture}>{item?.userId?.firstname?.charAt(0)}</Avatar>
                                <div>
                                    <Typography
                                        level="body-xs">{item?.userId?.firstname} {item?.userId?.lastname}</Typography>
                                    <Typography level="body-xs">{item?.userId?.email}</Typography>
                                </div>
                            </Box>
                            <DialogContent>
                                <div>
                                    <strong>Address:</strong> {item?.address?.street},{' '}
                                    {item?.address?.city}, {item?.address?.province},{' '}
                                    {item?.address?.zipCode}, {item?.address?.country}
                                </div>
                                <div>
                                    <strong>Amount:</strong> {item?.amount}
                                </div>
                                <div>
                                    <strong>Email:</strong> {item?.email}
                                </div>
                                <div>
                                    <strong>Full Name:</strong> {item?.fullName}
                                </div>
                                <div>
                                    <strong>Phone:</strong> {item?.phone}
                                </div>
                                <div>
                                    <strong>Reservation Date:</strong> {formatDate(item?.reservationDate)}
                                </div>
                                <div>
                                    <strong>Status:</strong> {item?.status}
                                </div>
                                {/* Add more details as needed */}
                            </DialogContent>

                            {item?.timeshareId?.type === "exchange" ? (
                            <>
                                {item?.status === "Canceled" ? (
                                    <Button
                                        variant="outlined"
                                        disabled
                                        color="danger"
                                    >
                                        Canceled
                                    </Button>
                                ) : (
                                    <>
                                        {item?.timeshareId?.is_bookable === true && (
                                            <Button
                                                onClick={() => setPaymentOpen(true)}
                                                disabled={item?.timeshareId?.is_bookable}
                                            >
                                                Waiting for accept by owner...
                                            </Button>
                                        )}

                                        {item?.status === 'Completed' && (
                                            <Link to="/me/my-trips">
                                                <Button startDecorator={<LuggageIcon />}>
                                                    View Trip
                                                </Button>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                            {item?.status === "Canceled" ? (
                                <Button
                                    variant="outlined"
                                    disabled
                                    color="danger"
                                >
                                    Canceled
                                </Button>
                            ) : (
                                <>
                                    {!item?.isPaid && (
                                        <Button
                                            onClick={() => setPaymentOpen(true)}
                                            disabled={!item?.is_accepted_by_owner}
                                            startDecorator={<PaymentIcon />}
                                        >
                                            Go payment
                                        </Button>
                                    )}
                                    
                                    {item?.isPaid && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Link to="/me/my-trips" style={{ marginRight: '10px' }}>
                                            <Button startDecorator={<LuggageIcon />}>
                                                View Trip
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => setPaymentDetailOpen(true)}
                                            startDecorator={<PaymentIcon />}
                                        >
                                            View payment detail
                                        </Button>
                                    </div>
                                )}
                                </>
                            )}
                        </>
                        )}

                        <OrderPaymentInfoModal open={paymentDetailOpen} item={item} setOpen={setPaymentDetailOpen} />



                        </ModalDialog>

                    </Modal>
                )}
            </Transition>
            <Transition in={paymentOpen} timeout={400}>
                {(state: string) => (
                    <Modal
                        keepMounted
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setPaymentOpen(false)}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0,
                                    backdropFilter: 'none',
                                    transition: `opacity 400ms, backdrop-filter 400ms`,
                                    ...(state === 'entering' || state === 'entered'
                                        ? {opacity: 1, backdropFilter: 'blur(8px)'}
                                        : {}),
                                },
                            },
                        }}
                        sx={{
                            visibility: state === 'exited' ? 'hidden' : 'visible',
                        }}
                    >
                        <ModalDialog
                            sx={{
                                opacity: 0,
                                transition: `opacity 300ms`,
                                ...(state === 'entering' || state === 'entered'
                                    ? {opacity: 1}
                                    : {}),
                            }}
                        >
                            <Grid container spacing={2} sx={{flexGrow: 1}}>
                                <Grid md={5} xs={12} sx={{}}>
                                    <Typography fontWeight={600} fontSize={16}>
                                        Payment summary
                                    </Typography>
                                    <Divider sx={{mt: 1, mb: 1}}/>
                                    <Stack sx={{width: 1, display: 'flex', justifyContent: 'center'}}
                                           direction="column" spacing={0}
                                           justifyContent="center">
                                        <img width={"100%"} src={item?.timeshareId?.resortId?.image_urls}/>
                                        <Typography fontWeight={600} fontSize={16}>
                                            {item?.timeshareId?.resortId?.name}
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={16}>
                                            Owner: {item?.timeshareId?.current_owner?.username}
                                        </Typography>
                                        <Box sx={{
                                            width: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mt: 2
                                        }}>
                                            <Typography fontWeight={500} fontSize={16}>
                                                Unit:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={16}>
                                                {item?.timeshareId?.unitId?.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Typography fontWeight={500} fontSize={16}>
                                                Stay:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={16}>
                                                {item?.timeshareId?.numberOfNights} night
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}>
                                            <Typography fontWeight={500} fontSize={16}>
                                                Check-in:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={16}>
                                                {formatDate(item?.timeshareId?.start_date)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Typography fontWeight={500} fontSize={16}>
                                                Check-out:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={16}>
                                                {formatDate(item?.timeshareId?.end_date)}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{mt: 1, mb: 1}}/>
                                        <Box sx={{
                                            width: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Typography fontWeight={500} fontSize={16}>
                                                Price/night:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={16}>
                                                ${item?.timeshareId?.pricePerNight}
                                            </Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Typography fontWeight={500} fontSize={16}>
                                                Total:
                                            </Typography>
                                            <Typography fontWeight={600} fontSize={16}>
                                                ${item?.amount}
                                            </Typography>
                                        </Box>
                                        <Typography fontWeight={500} fontSize={15} sx={{color: "red", mt: 2}}>
                                            <p>Payment will expired in</p>
                                            <Countdown date={targetTime} />
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid md={7} xs={12}>
                                    <Button onClick={() => {
                                        HandlePayPalPayment(item)
                                    }} sx={{width: 1, mb: 1}}><img width={'20px'}
                                                                   src={"https://cdn-icons-png.flaticon.com/512/174/174861.png"}/>Pay
                                        with PayPal</Button>
                                    <Button variant="outlined" sx={{width: 1, boxShadow: 1}}><img
                                        width={'20px'}
                                        src={"https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"}/>Pay
                                        with VNpay</Button>
                                    <Divider sx={{mt: 1, mb: 1}}/>
                                    <Typography>
                                        Or pay with credit card
                                    </Typography>
                                    <DialogContent>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                maxHeight: 'max-content',
                                                maxWidth: '100%',
                                                mx: 'auto',
                                                // to make the demo resizable
                                                overflow: 'auto',
                                                resize: 'horizontal',
                                            }}
                                        >
                                            <Typography level="title-lg" startDecorator={<InfoOutlined/>}>
                                                Card info
                                            </Typography>
                                            <Divider inset="none"/>
                                            <CardContent
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                                                    gap: 1.5,
                                                }}
                                            >
                                                <FormControl sx={{gridColumn: '1/-1'}}>
                                                    <FormLabel>Card number</FormLabel>
                                                    <Input endDecorator={<CreditCardIcon/>}/>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Expiry date</FormLabel>
                                                    <Input endDecorator={<CreditCardIcon/>}/>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>CVC/CVV</FormLabel>
                                                    <Input endDecorator={<InfoOutlined/>}/>
                                                </FormControl>
                                                <FormControl sx={{gridColumn: '1/-1'}}>
                                                    <FormLabel>Card holder name</FormLabel>
                                                    <Input placeholder="Enter cardholder's full name"/>
                                                </FormControl>
                                                <Checkbox label="Save card"
                                                          sx={{gridColumn: '1/-1', my: 1}}/>
                                                <CardActions sx={{gridColumn: '1/-1'}}>
                                                    <Button variant="solid" color="primary">
                                                        Check out
                                                    </Button>
                                                </CardActions>
                                            </CardContent>
                                        </Card>
                                    </DialogContent>
                                </Grid>
                            </Grid>


                        </ModalDialog>

                    </Modal>
                )}
            </Transition>
        </>
    )

}