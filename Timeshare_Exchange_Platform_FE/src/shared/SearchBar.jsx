import React, {useRef, useState} from 'react'
import './search-bar.css';
import { Col, Button, Form, FormGroup } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchBar = ({props}) => {
    console.log(props)
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar();
    const locationRef = useRef('')
    const maxGroupSizeRef = useRef(0)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const searchHandler = (e) => {
        e.preventDefault();
        const location = locationRef.current.value

        if (location === '' && (startDate === '' || endDate === '')) {
            enqueueSnackbar("At least one field is required!", { variant: "error" });
        }
        else {
            //navigate to the search result
            navigate(`/timeshare?query=${location}&startDate=${startDate}&endDate=${endDate}`)
            //refresh the page
            navigate(0)
        }
    }



    return <Col lg='12'>
        <div className='search__bar'>
            <Form className='d-flex align-items-center gap-5'>
                <FormGroup className='d-flex gap-3 form__group form__group-fast'>
                    <span>
                        <i class="ri-map-pin-line"></i>
                        <div>
                            <h6>Location</h6>
                            <input type='text' placeholder='Search For A Destination' defaultValue={props} ref={locationRef} />
                        </div>
                    </span>
                </FormGroup>
                <FormGroup className='d-flex gap-3 form__group form__group-last'>
                    <span>
                        <i class="ri-calendar-line"></i> {/* Change the icon to a calendar icon */}
                        <div>
                        <h6>Date</h6>
                                <DatePicker
                                    selectsRange
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(dates) => {
                                        const [start, end] = dates;
                                        setStartDate(start);
                                        setEndDate(end);
                                    }}
                                    placeholderText='Select a date!'
                                />
                        </div>
                    </span>
                </FormGroup>
                <Button className='search__btn' type='submit' onClick={searchHandler}>Search</Button>
            </Form>
        </div>
    </Col>

}

export default SearchBar