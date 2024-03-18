import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import {styled, Grid} from '@mui/joy';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import {GetPostBelongToOwner} from '../../services/post.service';
import {useSelector} from 'react-redux';
import {NavLink, useNavigate} from 'react-router-dom';
import Chip from '@mui/joy/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/material/Divider';
import {DeleteTimeshareByOwner} from '../../services/booking.service'
import {useSnackbar} from 'notistack';

interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}

export default function TimeshareList() {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [myPosts, setMyPosts] = React.useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    function formatDate(dateString?: string): string {
        if (!dateString) return '';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    async function DeleteTimeshare(timeshareId: any) {
        try {
            setIsLoading(true);
            const confirmed = window.confirm("Are you sure you want to delete this timeshare?");
            const timeshare = await DeleteTimeshareByOwner(timeshareId);
            if (confirmed) {
                if (timeshare) {
                    enqueueSnackbar("Delete successfully", {variant: "success"});
                } else {
                    enqueueSnackbar("Delete failed" , {variant: "error"});
                }
            }
        } catch (err: any) {
            enqueueSnackbar("Delete Failed", {variant: "error"});
        } finally {
            setIsLoading(false);
        }
    }
    async function GetMyPosts(userId: string) {
        const postsData = await GetPostBelongToOwner(userId);
        if (postsData && postsData.length > 0) {
            console.log(postsData);
            setMyPosts(postsData)
        }
    }

    React.useEffect(() => {
        if (user?._id) {
            GetMyPosts(user?._id)
        }
    }, [user])

    return (
        <Grid container spacing={2} sx={{flexGrow: 1, mx: {xs: 2, md: 5}, mt: 2}}>
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
            <Grid container spacing={2} sx={{flexGrow: 1}}>
                {myPosts.length > 0 && myPosts.map((post: any) => {
                    if (!post?.deleted) {
                return (<Grid xs={12} md={6} lg={4} >
                        <Card sx={{}}>
                        <div>
                            <Typography level="title-lg" noWrap>{post?.resortId?.name}</Typography>
                            <Typography level="body-sm"
                                        sx={{display: 'inline-flex', gap: 1}}>Verified {post?.is_verified ?
                                <VerifiedOutlinedIcon color='success'/> :
                                <VerifiedOutlinedIcon color='success'/>}</Typography>
                            {/* <Typography level="body-sm">{formatDate(post?.start_date)}</Typography>
                                <Typography level="body-sm">{formatDate(post?.end_date)}</Typography> */}
                            <Stack sx={{width: 1, display: 'flex', justifyContent: 'center'}} direction="column"
                                   spacing={0} justifyContent="center">
                                <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between', mt: 2}}>
                                    <Typography fontWeight={500} fontSize={14}>
                                        Unit:
                                    </Typography>
                                    <Typography fontWeight={400} fontSize={14}>
                                        {post?.unitId?.name}
                                    </Typography>
                                </Box>
                                <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography fontWeight={500} fontSize={14}>
                                        Stay:
                                    </Typography>
                                    <Typography fontWeight={400} fontSize={14}>
                                        {post?.numberOfNights} night
                                    </Typography>
                                </Box>
                                <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between',}}>
                                    <Typography fontWeight={500} fontSize={14}>
                                        Check-in:
                                    </Typography>
                                    <Typography fontWeight={400} fontSize={14}>
                                        {formatDate(post?.start_date)}
                                    </Typography>
                                </Box>
                                <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography fontWeight={500} fontSize={14}>
                                        Check-out:
                                    </Typography>
                                    <Typography fontWeight={400} fontSize={14}>
                                        {formatDate(post?.end_date)}
                                    </Typography>
                                </Box>
                                <Divider sx={{mt: 1, mb: 1}}/>
                                <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography fontWeight={500} fontSize={18}>
                                        Price/night:
                                    </Typography>
                                    <Typography fontWeight={400} fontSize={18}>
                                        ${post?.pricePerNight}
                                    </Typography>
                                </Box>
                                <Box sx={{width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography fontWeight={500} fontSize={18}>
                                        Total:
                                    </Typography>
                                    <Typography fontWeight={600} fontSize={18}>
                                        ${post?.price}
                                    </Typography>
                                </Box>
                            </Stack>
                            <IconButton
                                aria-label="bookmark Bahamas Islands"
                                variant="plain"
                                color="neutral"
                                size="sm"
                                sx={{position: 'absolute', top: '0.875rem', right: '0.5rem'}}
                            >
                                <BookmarkAdd/>
                            </IconButton>
                        </div>
                        <AspectRatio minHeight="120px" maxHeight="250px">
                            <img src={post?.images[0]}/>
                        </AspectRatio>
                        <CardContent orientation="horizontal">
                            {/* <div>
                                    <Typography level="body-xs">Total price:</Typography>
                                    <Typography fontSize="lg" fontWeight="lg">
                                        ${post?.price}
                                    </Typography>
                                </div> */}
                            <Button color="success" variant='outlined' sx={{width: '20px'}}
                                    onClick={() => {
                                        navigate(`/me/my-timeshares/update/${post?._id}`)
                                    }}>
                                <EditIcon/>
                            </Button>
                            <Button color="danger" variant='outlined' sx={{width: '20px'}}
                            onClick={() => {
                                DeleteTimeshare(post?._id)
                            }} >
                            
                                <DeleteOutlineIcon/>
                            </Button>
                            <IconButton
                                aria-label="bookmark Bahamas Islands"
                                variant="plain"
                                color="neutral"
                                size="sm"
                                sx={{position: 'absolute', top: '0.875rem', right: '0.5rem'}}
                            >
                                <BookmarkAdd/>
                            </IconButton>
                            {/* <Chip
                                    size="sm"
                                    variant="outlined"
                                    color="danger"
                                >
                                    Remove
                                </Chip> */}
                            <Button
                                variant="solid"
                                size="md"
                                color="primary"
                                aria-label="Explore Bahamas Islands"
                                sx={{ml: 'auto', alignSelf: 'center', fontWeight: 600}}
                                onClick={() => {
                                    navigate(`/me/my-timeshares/timeshares-list/${post?._id}`)
                                }}
                            >
                                Manage
                            </Button>
                        </CardContent>
                        </Card>
                        </Grid>
                        );
                    }
                    return null; 
                })}
            </Grid>
        </Grid>

    );
}
