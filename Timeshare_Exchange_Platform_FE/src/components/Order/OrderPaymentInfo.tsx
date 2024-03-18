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
import {GetOrderPaymentInfo} from "../../services/booking.service";


export default function OrderPaymentInfoModal(props: any) {
    const reservation = props?.item;
    const open = props.open;
    const setOpen = props.setOpen; // Ensure you pass setOpen as a prop
    const [paymentOpen, setPaymentOpen] = React.useState<boolean>(false);
    const [paymentInfo, setPaymentInfo] = React.useState<any>({});
    async function Load() {
        try{
            const data = await GetOrderPaymentInfo(reservation?.userId?._id, reservation?._id);
            if (data) {
                setPaymentInfo(data)
            }
        }catch (err: any) {
            console.log(err)
        }

    }
    React.useEffect(()=>{
        Load();
        console.log(paymentInfo)
    }, [])
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
                            <DialogContent>
                                <h2>Payment Info</h2>
                            </DialogContent>
                            <DialogContent>
                                <div>
                                    <p>
                                        <strong>Amount:</strong> ${paymentInfo.amount}
                                    </p>
                                    <p>
                                        <strong>App Payment ID:</strong> {paymentInfo.app_paymentId}
                                    </p>
                                    <p>
                                        <strong>Method:</strong> {paymentInfo.method?.name}
                                    </p>
                                    <p>
                                        <strong>Reservation ID:</strong> {paymentInfo.reservationId}
                                    </p>
                                    <p>
                                        <strong>Paid at:</strong> {formatDate(paymentInfo.timestamp)}
                                    </p>
                                    <p>
                                        <strong>User ID:</strong> {paymentInfo.userId}
                                    </p>
                                    <img src={paymentInfo.method?.logoImg} alt="Logo" style={{ width: '50px', height: 'auto' }} />
                                    {/* Add other payment details as needed */}
                                </div>
                            </DialogContent>


                        </ModalDialog>

                    </Modal>
                )}
            </Transition>

        </>
    )

}