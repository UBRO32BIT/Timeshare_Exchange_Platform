import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from "react-redux";
import NavBar from '../../components/Rental/NavBar';
import Grid from '@mui/joy/Grid';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Sheet from '@mui/joy/Sheet';
import { NavLink } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Snackbar} from '@mui/material';
import { Alert } from '@mui/material';

interface VNPayReturnParams {
    vnp_Amount: string | null;
    vnp_OrderInfo: string | null;
    vnp_ResponseCode: string | null;
}
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

export default function VNPayReturn() {
    const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  
    const user = useSelector((state: RootState) => state?.auth?.user);
    const { postId, reservationId } = useParams<{ postId: string; reservationId: string }>();
    const queryParams = new URLSearchParams(window.location.search);
    const [paymentData, setPaymentData] = useState<VNPayReturnParams>({
        vnp_Amount: queryParams.get('vnp_Amount'),
        vnp_OrderInfo: queryParams.get('vnp_OrderInfo'),
        vnp_ResponseCode: queryParams.get('vnp_ResponseCode')
    });
    const amount = paymentData.vnp_Amount ? parseFloat(paymentData.vnp_Amount) : 0;
    const price = amount / 100;
    const formattedPrice = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const theme = createTheme({
        palette: {
          primary: {
            main: '#00C853', // Green color
          },
          success: {
            main: '#00C853', // Green color
          },
          // Other color definitions...
        },
      });
    useEffect(() => {
        async function handlePaymentResponse() {
            try {
                // If payment is successful, send data to backend
                    const queryString = `/payment/:userId/vnpay_return${window.location.search}`;
                    const response = await axios.get(`http://localhost:8080/api/v2${queryString}`);
                    console.log('Payment status updated:', response.data);
                
            } catch (error) {
                console.error('Error updating payment status:', error);
            }
        }

        if (paymentData.vnp_ResponseCode) {
            handlePaymentResponse();
        }
    }, [paymentData]);

    return (
        <React.Fragment>
          <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <NavBar />
            <Grid
              container
              spacing={0}
              sx={{
                flexGrow: 1,
                width: 1,
                pr: 4,
                pl: 4,
                mt: 2,
                gap: 1,
                flexWrap: { xs: 'wrap', md: 'nowrap' },
              }}
            >
              <Sheet variant="outlined" sx={{ backgroundColor: '#F8F8FF', p: 4, borderRadius: '10px' }}>
                <Typography variant="h3" color={paymentData.vnp_ResponseCode === '00' ? 'green' : 'red'} textAlign={'center'} marginBottom={'10px'}>
                  {paymentData.vnp_ResponseCode === '00' ? 'PAYMENT SUCCESSFUL' : 'PAYMENT FAILED'}
                </Typography>
                <Typography variant="h5">
                  {paymentData.vnp_ResponseCode === '00' ? 'Now, you can upload your timeshare' : 'Please pay again'}
                </Typography>
                <Typography variant="h6" marginTop={2} color="gray">
                    Price: {formattedPrice}
                    </Typography>
                {paymentData.vnp_ResponseCode === '00' ? (
                  <NavLink to="/me/my-timeshares/upload-new-timeshare" style={{ textDecoration: 'none' }}>
                    <Box bgcolor="#fe622f" p={1} borderRadius={4} marginTop={3} color="white">
                      <Typography variant="body1" textAlign="center">
                        Upload now
                      </Typography>
                    </Box>
                  </NavLink>
                ) : (
                  <NavLink to="/me/my-profile/billing" style={{ textDecoration: 'none' }}>
                    <Box bgcolor="green" p={1} borderRadius={4} marginTop={3} color="white">
                      <Typography variant="body1" textAlign="center">
                        Pay now
                      </Typography>
                    </Box>
                  </NavLink>
                )}
              </Sheet>
            </Grid>
          </CssVarsProvider>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}   
          style={{ position: 'fixed', bottom: '85%', left:'50%',transform: 'translateX(-50%)', zIndex: 9999 }}>
            <Alert onClose={handleClose} severity={paymentData.vnp_ResponseCode === '00' ? 'success' : 'error'}>
                {paymentData.vnp_ResponseCode === '00' ? 'Payment Successful' : 'Payment Failed'}
            </Alert>
            </Snackbar>

        </React.Fragment>
      );
    }
