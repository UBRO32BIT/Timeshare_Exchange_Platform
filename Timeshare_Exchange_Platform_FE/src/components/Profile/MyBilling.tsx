import * as React from "react"; 
import { useState } from "react";
import { useSelector } from "react-redux";
import { ChangeEvent } from "react";
import { styled } from "@mui/joy";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import AspectRatio from "@mui/joy/AspectRatio";
import IconButton from "@mui/joy/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from "@mui/joy/Input";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CardOverflow from "@mui/joy/CardOverflow";
import CardActions from "@mui/joy/CardActions";
import Button from "@mui/joy/Button";
import { CreateVNPay } from "../../services/auth.service";
import Table from '@mui/joy/Table';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { red } from '@mui/material/colors';
import '../../styles/billing.css';
// Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import {useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StyledBox = styled(Box)({
  marginTop: '20px', // Đã thay đổi giá trị này
  backgroundColor: 'white', // Màu nền
  maxWidth: '80%', // Chiều rộng tối đa
  padding: '20px', // Khoảng cách nội dung
  borderRadius: '8px', // Bo góc
  marginLeft: '45px', // Canh giữa
  border: '1px solid #C0C0C0', // Thêm viền xám

});
const BillingBox = styled(Box)({
  marginTop: '10px',
  margin: '5px',
  backgroundColor: "white",
  border: '1px solid #ddd', // Khung
  padding: '30px', // Khoảng cách nội dung và biên
  marginBottom: '5px', // Khoảng cách giữa các hộp
  borderRadius: '10px', // Bo góc
  textAlign: 'center', // Canh giữa nội dung
});


interface ServicePack {
  _id: string;
  name: string;
  amount: number;
  numberPosts: number | null;
}

const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });


interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}
function createData(
    name: string,
    calories: any,
  ) {   
    return { name, calories};
  }
  function createDataBoolean(
    calories: any,
  ) {
    return {calories};
  }
  const tableCellStyle: React.CSSProperties = {
    padding: '8px',
    border: '1px solid #ddd',
    textAlign: 'left', // hoặc 'right', 'center', 'justify'
  };

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

// Custom CSS styles
const formLabelStyle = {
    marginBottom: '10px', 
    fontSize: 'large', // Set font size to large for Typography
    color: 'red'
};


export default function MyBilling(props: any) {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [amount, setAmount] = useState("100000");
    const [amount1, setAmount1] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [selectedServicePack, SetSelectedServicePack] = useState<string | null>(null);
    const [language, setLanguage] = useState("vn");
    const [selectedService, setSelectedService] = useState("BASIC");
    const handleAmountChange = (amount: number) => {
      // Handle amount change
      // You can set the selected amount and perform other actions here
    };
    const [servicePacks, setServicePacks] = useState<ServicePack[]>([]);

    useEffect(() => {
      const fetchServicePacks = async () => {
          try {
              const response = await axios.get<ServicePack[]>('http://localhost:8080/api/v2/servicePack/getAllServicePack');
              setServicePacks(response.data);
          } catch (error) {
              console.error('Error fetching service packs:', error);
          }
      };

      fetchServicePacks();
  }, []);


  const navigate = useNavigate(); // Use navigate hook

  const handlePayNowClick = (servicePack: ServicePack) => {
    const { _id, amount } = servicePack;
    setSelectedAmount(amount);
    SetSelectedServicePack(_id);
    if (user?.servicePack?.role === 'member-fullservice') {
      alert(`You are already a ${user?.servicePack?.name} and cannot upgrade further.`);
      navigate(''); // Redirect to homepage using navigate
    }
    else {
      // Proceed with payment
    }
  };

  
  
    const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLanguage(event.target.value);
    };
    console.log(user);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((form as any).entries());
        console.log(formJson);
        const result = await CreateVNPay(form);
        if (result) {
            console.log(result);
            window.location.replace(result);
        }
        console.log(formJson);
    };
    const isBasic = user?.servicePack?.role === 'member-basic';
    const isProtected = user?.servicePack?.role === 'member-protected';
    const isFullService = user?.servicePack?.role === 'member-fullservice';
    return (
      <StyledBox>
        {!user?.servicePack ? (
      <Typography component="h3" style={{ fontSize: '1.2rem', padding: '20px', textAlign: 'center', color: 'gray', borderRadius: '10px', marginBottom: '10px' }}>
       You want to upload  your timeshare for rental or exchange? <br/> Please click button "Pay now"
      </Typography>
        ) : (
          <Typography component="h3" style={{ fontSize: '1.5rem', padding: '20px', textAlign: 'center', color: 'red', borderRadius: '10px', marginBottom: '10px' }}>MY ROLE: {user?.servicePack?.name}</Typography>
        )} 
        <form onSubmit={handleSubmit}>
        <input type='hidden' name='userId' value={user?._id} />
        <input type='hidden' name='servicePackId' value={selectedServicePack ?? ''} />
        <input type="hidden" name="amount" value={selectedAmount ?? ''} />
        <div className="mb-3" style={{ display: 'none' }} >
            <FormLabel component="legend" >Choose Payment Method:</FormLabel>
            <RadioGroup
              aria-label="bankCode"
              name="bankCode"
              style={{ marginLeft: '15px', paddingTop: '5px' }}
              value=""
            >
              <FormControlLabel
                value=""
                control={<Radio />}
                label="VNPay"
              />
            </RadioGroup>
          </div>
          <div className="mb-3" style={{ display: 'none' }}>
            <FormLabel component="legend">Language:</FormLabel>
            <RadioGroup
              aria-label="language"
              name="language"
              style={{ marginLeft: '15px', paddingTop: '5px' }}
              value="en"
            >
              <FormControlLabel
                value="en"
                control={<Radio />}
                label="English"
              />

            </RadioGroup>
          </div>
          <div className="mb-3">
            <Row>
              {servicePacks.map(servicePack => (
                <Col key={servicePack._id} className="here-col">
                  <BillingBox sx={{ marginBottom: '10px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 0 1px 0 rgba(0,0,0,0.2)' }} >
                    <Typography component="h3" sx={{ order: '10px', color: '#FF9900', marginBottom: '10px', borderRadius: '10px', fontWeight: 'bold' }}>
                      {servicePack.name}
                    </Typography> 
                    <Divider sx={{ margin: '20px 0', backgroundColor: 'gray' }} />
                    <Typography component="h5" sx={{ marginBottom: '10px' }}>Price: {servicePack.amount.toLocaleString('vi-VN')} VND</Typography>
                    <Typography component="h5">Number Posts: {servicePack.numberPosts || 'Unlimited'}</Typography>
                    <Divider sx={{ margin: '20px 0 20px 0', backgroundColor: 'gray' }} />
                    <Button 
                      type="submit" 
                      onClick={() => handlePayNowClick(servicePack)} 
                      className="pay-now-button"
                      disabled={
                        (isProtected && (servicePack.name === 'MEMBER BASIC' || servicePack.name === 'MEMBER PROTECTED')) ||
                        (isBasic && (servicePack.name === 'MEMBER BASIC')) ||
                        (isFullService && (servicePack.name === 'MEMBER BASIC' || servicePack.name === 'MEMBER PROTECTED' ||  servicePack.name === 'MEMBER FULL-SERVICE'))
                    }
                      sx={{ 
                        background: '#FF9900', 
                        color: 'white', 
                        paddingLeft: '50px',
                        paddingRight: '50px',  
                        borderRadius: '10px',
                      }} 
                    >
                      Pay now
                    </Button>
                  </BillingBox>
                </Col>
              ))}
            </Row>
          </div>
        </form>
      </StyledBox>
    );    
  }