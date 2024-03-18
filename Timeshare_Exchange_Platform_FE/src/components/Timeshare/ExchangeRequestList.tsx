/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import {ColorPaletteProp} from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, {iconButtonClasses} from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import ImageGallery from "react-image-gallery";
import {convertDate} from '../../utils/date'

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import {GetExchangeRequestOfTimeshare} from "../../services/booking.service";
import { Transition } from 'react-transition-group';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import {AcceptExchangeByOwner} from "../../services/booking.service";
import {CancelExchangeByOwner} from "../../services/booking.service";
import { useState } from "react";
import axios from 'axios';
import {useEffect } from 'react';
import convertImageArray from '../../utils/convertImageArray'
import { Height } from '@mui/icons-material';
import '../../styles/exchangeRequestList.css';
import {useSnackbar} from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';

interface ServicePack {
    _id: string;
    name: string;
    amount: number;
    numberPosts: number | null;
  }

interface Timeshare {
    type: 'rental' | 'exchange';
    start_date: Date;
    end_date: Date;
    current_owner: string;
    resortId: string;
    unitId: string;
    numberOfNights: number;
    price: string;
    pricePerNight: string;
    images: Array<string>; // Assuming the array contains paths to images
    is_bookable?: boolean;
    is_verified?: boolean;
    timestamp?: Date;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
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



function RowMenu(props: any) {
    const [isLoading, setIsLoading] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const reservationData = props.reservationData; // Assuming you pass the reservation data to the component
    const [open, setOpen] = React.useState<boolean>(false);
    async function HandleAcceptExchangeByOwner(exchangeId: any) {
        try {
            const confirmed = window.confirm("Are you sure you want to accept this exchange request?");
            if (confirmed) {
            setIsLoading(true);
            const data = await AcceptExchangeByOwner(exchangeId)
            if (data) {
                enqueueSnackbar("Accept successfully", {variant: "success"});
            }
        }
        } catch (err: any) {
            enqueueSnackbar("Accept successfully", {variant: "error"});
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => setOpen(true)}>View detail</MenuItem>
                    <MenuItem>Edit</MenuItem>
                    <Divider />
                    <MenuItem color="danger">Delete</MenuItem>
                </Menu>
            </Dropdown>
            <Transition in={open} timeout={400}>
                {(state: string) => (
                    <Modal
                        
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setOpen(false)}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    ...(state === 'entering' || state === 'entered'
                                        ? { opacity: 1, backdropFilter: 'blur(8px)' }
                                        : {}),
                                },
                            },
                        }}
                        
                    >
                        <ModalDialog
                            sx={{
                                transition: `opacity 300ms`,
                                ...(state === 'entering' || state === 'entered'
                                    ? { opacity: 1 }
                                    : {}),
                            }}
                        ><Box sx={{
                            maxWidth: 600,
                            maxHeight: 'fixed',
                            borderRadius: 'md',
                            p: 1,
                        }}>
                            
                            <ImageGallery items={convertImageArray([...reservationData?.myTimeshareId?.images, ...reservationData?.myTimeshareId?.resortId.image_urls])}/>
                                
                                <h2>{reservationData?.myTimeshareId?.resortId.name}</h2>
                                <span>
                                    <h5>Unit: {reservationData?.myTimeshareId?.unitId?.name}</h5>
                                </span>
                                <span>
                                    <h6>Number of Nights: {reservationData?.myTimeshareId?.numberOfNights}</h6>
                                </span>
                                <div className='tour__extra-details'>
                                    <span>
                                        <i className="ri-map-pin-range-line"></i>{reservationData?.myTimeshareId?.resortId.location}
                                    </span>
                                    <span>
                                        <i className="ri-money-dollar-circle-line"></i>{reservationData?.myTimeshareId?.price}
                                    </span>
                                    <span>
                                        <i className="ri-time-line"></i> {convertDate(reservationData?.myTimeshareId?.start_date)} - {convertDate(reservationData?.myTimeshareId?.end_date)}
                                    </span>
                                </div>
                                <td> 
                                <Typography level="body-xs" sx={{ marginLeft:'400px' }}>
                                {reservationData?.myTimeshareId?.is_bookable === false || reservationData?.timeshareId?.is_bookable === false || reservationData?.status === 'Canceled' || reservationData?.status === 'Expired'? (
                                    <Box sx={{ textAlign:'center' ,width: 'fit-content', fontSize: '15px', border: '1px', backgroundColor: 'gray', color: 'white', padding: '8px', borderRadius: '5px' }}>
                                        {reservationData?.status}
                                    </Box>
                                ) : (
                                    <>
                                            <Button  variant="solid" color="success" onClick={() => {
                                                HandleAcceptExchangeByOwner(reservationData?._id);
                                            }}>
                                                Accept
                                            </Button>

                                            <Button sx={{ margin: 1 }} variant="solid" color="danger" onClick={() => {
                                                const isConfirmed = window.confirm('You sure about that????');
                                                if (isConfirmed) {
                                                    CancelExchangeByOwner(reservationData?._id);
                                                    setOpen(false);
                                                }
                                            }}>
                                                Denied
                                            </Button>

                                        
                                    </>
                                )}
                                </Typography>
                                    </td>
                                {/* <div>
                                    <strong>Address:</strong> {reservationData?.address?.street},{' '}
                                    {reservationData?.address?.city}, {reservationData?.address?.province},{' '}
                                    {reservationData?.address?.zipCode}, {reservationData?.address?.country}
                                </div>
                                <div>
                                    <strong>Amount:</strong> {reservationData?.amount}
                                </div>
                                <div>
                                    <strong>Email:</strong> {reservationData?.email}
                                </div>
                                <div>
                                    <strong>Full Name:</strong> {reservationData?.fullName}
                                </div>
                                <div>
                                    <strong>Phone:</strong> {reservationData?.phone}
                                </div>
                                <div>
                                    <strong>Exchange Date:</strong> {formatDate(reservationData?.request_at)}
                                </div>
                                <div>
                                    <strong>Status:</strong> {reservationData?.status}
                                </div> */}
                            </Box>
                           
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>
        </>
    );
}


export default function RentRequestList(props: any) {
    const reservationData = props.reservationData; // Assuming you pass the reservation data to the component
    const [requestList, setRequestList] = React.useState<any[]>([]);
    const [servicePacks, setServicePacks] = useState<ServicePack[]>([]);
    const [timeshares, setTimeshares] = useState<Timeshare[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    async function HandleAcceptExchangeByOwner(exchangeId: any) {
        try {
            setIsLoading(true);
            // Disable the button while loading
            const data = await AcceptExchangeByOwner(exchangeId)
            if (data) {
                enqueueSnackbar("Accept successfully", {variant: "success"});
            }
        } catch (err: any) {
            enqueueSnackbar("Accept successfully", {variant: "error"});
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        const fetchTimeshares = async () => {
            try {
                const timesharePromises = requestList.map(async (row) => {

                    const response = await axios.get<Timeshare[]>(`http://localhost:8080/api/v2/timeshare/${row?.myTimeshareId}`);

                    const timeshareData = await Promise.all(timesharePromises);
                    return response.data;
                });
                const timeshareData = await Promise.all(timesharePromises);
                setTimeshares(timeshareData.flat()); // Flatten the array of arrays
            
            } catch (error) {
                console.error('Error fetching service packs:', error);
            }
        };
        fetchTimeshares();
    }, []);

    // useEffect(() => {
    //     const fetchServicePacks = async () => {
    //         try {
    //             const response = await axios.get<ServicePack[]>('http://localhost:8080/api/v2/servicePack/getAllServicePack');
    //             setServicePacks(response.data);
    //         } catch (error) {
    //             console.error('Error fetching service packs:', error);
    //         }
    //     };
  
    //     fetchServicePacks();
    // }, []);
    
    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const timeshareId = props?.timeshareId;
    async function Load() {
        try {
            // Fetch rent requests based on timeshareId
            const response = await GetExchangeRequestOfTimeshare(timeshareId);
            if (response) {
                setRequestList(response);
            }
        } catch (error: any) {
            console.error('Error fetching rent requests:', error.message);
        }
    }

    React.useEffect(() => {
        // Load rent requests when timeshareId changes
        Load();
    }, [timeshareId, isLoading]);

    const [order, setOrder] = React.useState<Order>('desc');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [open, setOpen] = React.useState(false);
    return (

        <Sheet
            className="OrderTableContainer"
            // variant="outlined"
            sx={{
                display: {xs: 'none', sm: 'initial'},
                width: '100%',
                borderRadius: 'sm',
                flexShrink: 1,
                overflow: 'auto',
                minHeight: 1,
            }}
        >
            <Table
                aria-labelledby="tableTitle"
                stickyHeader
                hoverRow
                sx={{

                    '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                    '--Table-headerUnderlineThickness': '1px',
                    '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                    '--TableCell-paddingY': '4px',
                    '--TableCell-paddingX': '8px',
                }}
            >
                <thead>
                <tr>
                    <th style={{width: 50, padding: '12px 6px'}}>No.</th>
                    <th style={{width: 140, padding: '12px 6px'}}>Date</th>
                    <th style={{width: 240, padding: '12px 6px'}}>Customer</th>
                    <th style={{width: 140, padding: '12px 6px'}}>Country</th>
                    <th style={{width: 200, padding: '12px 6px'}}>Accept/Deny</th>
                    <th style={{width: 100, padding: '12px 6px'}}>Status</th>
                    <th style={{width: 100, padding: '12px 6px'}}>Contact</th>
                    <th style={{width: 100, padding: '12px 6px'}}>View detail</th>
                </tr>
                </thead>
                <tbody>
                {requestList?.map((row: any, index: number) => {
                const rowIndex = index + 1;

                    return (
                        
                        <tr key={row._id} style={{
                            backgroundColor:
                                row?.status === 'Canceled' ? '#FFEBE5' :
                                        row?.status === 'Completed' ? '#C8E6C9' : 'inherit',
                            filter: row.pending ? 'brightness(70%)' : 'none',  // Darken the row if pending is true
                            pointerEvents: row.pending ? 'none' : 'auto',  // Disable interaction if pending is true
                        }}>
                            <td>
                            {rowIndex}                            
                            </td>

                            <td>
                                <Typography level="body-xs">{formatDate(row?.request_at)}</Typography>
                            </td>

                            <td>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Avatar size="sm" src={row?.userId?.profilePicture}>{row?.userId?.firstname?.charAt(0)}</Avatar>
                                    <div>
                                        <Typography level="body-xs">{row?.userId?.firstname} {row?.userId?.lastname}</Typography>
                                        <Typography level="body-xs">{row?.userId?.email}</Typography>
                                    </div>
                                </Box>
                            </td>

                            <td>
                            <Typography level="body-xs">{row?.address?.country}</Typography>
                            </td>

                            <td>
                                { row?.myTimeshareId?.is_bookable === false || row?.timeshareId?.is_bookable === false|| row?.status === 'Canceled' || row?.status === 'Expired'? (
                                    <>
                                    {row?.status !== 'Completed' ? (
                                        <Box sx={{  fontWeight: 500, fontSize:'12px', textAlign:'center', width: 'fit-content', border: '1px',  color: "#8d2925" }}>
                                        {row?.status}
                                    </Box>
                                    ) : (
                                        <Box sx={{ fontWeight: 500, fontSize:'12px', textAlign:'center' , width: 'fit-content', border: '1px',  color: "#14813d" }}>
                                        {row?.status}
                                    </Box>
                                    )}

                                    </>
                                    
                                ) : (
                                    <>
                                        <Button 
                                            variant="solid" 
                                            color="success" 
                                            onClick={() => {
                                                HandleAcceptExchangeByOwner(row?._id);
                                            }}
                                            disabled={isLoading} // Disable the button while loading
                                            sx={{
                                                position: 'relative', // Để có thể định vị CircularProgress
                                            }}
                                        >
                                            {isLoading && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '5px', // Tạo hình tròn cho CircularProgress
                                                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền semi-transparent
                                                    }}
                                                >
                                                    <CircularProgress size={24} color="inherit" />
                                                </Box>
                                            )}
                                            Accept
                                            </Button>

                                            <Button sx={{ margin: 1 }} variant="solid" color="danger" onClick={() => {
                                                const isConfirmed = window.confirm('You sure about that????');
                                                if (isConfirmed) {
                                                    CancelExchangeByOwner(row?._id);
                                                    setOpen(false);
                                                }
                                            }}>
                                                Deny
                                            </Button>

                                        
                                    </>
                                )}
                            </td>

                            
                            <td>
                                <Typography level="body-xs">{row?.status}</Typography>
                            </td>

                            <td>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Link level="body-xs" component="button">
                                        Contact
                                    </Link>
                                </Box>
                                
                            </td>

                            <td><RowMenu reservationData={row}/>
                            </td>   
                        </tr>
                        
                    );
                    
                })}
                </tbody>
            </Table>
        </Sheet>
    );
    
}