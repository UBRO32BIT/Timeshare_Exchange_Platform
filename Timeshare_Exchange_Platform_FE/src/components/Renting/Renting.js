import React, { useState } from 'react'
import './renting.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Renting = ({ tour, avgRating }) => {

    const { price, price2, time, reviews } = tour;

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        userId: '01', // later it will be dynamic
        userEmail: 'example@gmail.com',
        fullName: '',
        phone: '',
        guestSize: 1,
        bookAt: ''
    })

    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleDateChange = (date, field) => {
        if (field === 'endDate' && credentials.bookAt && date < credentials.bookAt) {
            alert('End date cannot be before the start date');
            return;
        }
        setCredentials((prev) => ({ ...prev, [field]: date }));
        // Calculate the number of days between start and end dates
        if (field === 'endDate' && credentials.bookAt) {
            const startDate = new Date(credentials.bookAt);
            const endDate = new Date(date);
            const timeDifference = endDate.getTime() - startDate.getTime();
            const numberOfNights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            const newTotalAmount = Number(price2) * numberOfNights;
            setTotalAmount(newTotalAmount);
        }
    };

    const [totalAmount, setTotalAmount] = useState(0);

    //send data to the server
    const handleClick = e => {
        e.preventDefault();

        navigate("/thank-you");
    }


    return <div className='booking'>
        <div className='booking__top d-flex align-items-center justify-content-between'>
            <h3>${price} (${price2}/night) </h3>
        </div>
        {/*========Renting form============*/}
        {/* <div className='booking__form'>
            <h5>Information for Rent</h5>
            <Form className='booking__info-form' onSubmit={handleClick}>
                <FormGroup>
                    <input type='text' placeholder='Full Name' id="fullName"
                        required onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <input type='number' placeholder='Phone' id="phone"
                        required onChange={handleChange} />
                </FormGroup>
                <FormGroup className='d-flex align-items-center gap-3'>
                    <DatePicker
                        selected={credentials.bookAt}
                        onChange={(date) => handleDateChange(date, 'bookAt')}
                        placeholderText='Select start date'
                        required
                    />
                    <DatePicker
                        selected={credentials.endDate}
                        onChange={(date) => handleDateChange(date, 'endDate')}
                        placeholderText='Select end date'
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <input type='number' placeholder='Guest' id="guestSize"
                        required onChange={handleChange} />
                </FormGroup>
            </Form>
        </div>
        <div className='booking__bottom'>
            <ListGroup>
                <ListGroupItem className='border-0 px-0'>
                    <h5 className='d-flex align-items-center gap-1'>
                        ${price2} <i class="ri-close-line"></i> night
                    </h5>
                </ListGroupItem>
                <ListGroupItem className='border-0 px-0 total'>
                    <h5>Total</h5>
                    <span> ${totalAmount}</span>
                </ListGroupItem>
            </ListGroup>
        </div>
        <Button className='btn primary__btn w-100 mt-4 ' onClick={handleClick}>Rent Now</Button>
        <div></div>
        <div className='booking__form'>
            <h5>Information for Exchange</h5>
            <Form className='booking__info-form' onSubmit={handleClick}>
                <FormGroup>
                    <input type='text' placeholder='Full Name' id="fullName"
                        required onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <input type='number' placeholder='Phone' id="phone"
                        required onChange={handleChange} />
                </FormGroup>
            </Form>
        </div>
        <div className='booking__bottom'>
            <ListGroup>
                <ListGroupItem className='border-0 px-0'>
                    <h5 className='d-flex align-items-center gap-1'>
                        {time} 
                    </h5>
                </ListGroupItem>
                <ListGroupItem className='border-0 px-0 total'>
                    <h5>Total</h5>
                    <span> ${price}</span>
                </ListGroupItem>
            </ListGroup>
        </div>
        <Button className='btn primary__btn w-100 mt-4' ><Link to="/exchangesuccess">Exchange Now</Link></Button> */}
    </div>

};

export default Renting