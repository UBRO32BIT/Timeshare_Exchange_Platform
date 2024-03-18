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


export default function OrderDetailModal(props: any) {
    let item = props?.item;
    const open = props.open;
    const setOpen = props.setOpen; // Ensure you pass setOpen as a prop
    const [paymentOpen, setPaymentOpen] = React.useState<boolean>(false);

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
                                        <Chip
                                            variant="outlined"
                                            color="primary"
                                            size="sm"
                                            sx={{pointerEvents: 'none', fontSize: 14}}
                                        >
                                            {item?.status}
                                        </Chip>
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
                            <Button onClick={() => setPaymentOpen(true)}
                                    disabled={!(item?.is_accepted_by_owner)}
                                    startDecorator={<PaymentIcon/>}>Go
                                payment {!item?.is_accepted_by_owner}</Button>
                        </ModalDialog>

                    </Modal>
                )}
            </Transition>

        </>
    )

}