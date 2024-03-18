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
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import {GetPostBelongToOwner, GetPostById} from '../../services/post.service';
import {useSelector} from 'react-redux';
import {NavLink, useNavigate, useParams} from 'react-router-dom';
import Stack from '@mui/joy/Stack';
import Chip from '@mui/joy/Chip';
import {GetReservationOfPost, ConfirmReservation} from '../../services/booking.service';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Sheet from "@mui/joy/Sheet";
import RentRequestList from "./RentRequestList";
import ExchangeRequestList from "./ExchangeRequestList";
import {GetExchangeRequestOfTimeshare} from "../../services/booking.service";

interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}

export default function ManageTimeshares() {
    const [requestList, setRequestList] = React.useState<any[]>([]);
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [open, setOpen] = React.useState<boolean>(false);

    const [post, setPost] = React.useState<any>([]);
    const [reservationList, setReservationList] = React.useState<any>([]);
    let {timeshareId} = useParams();
    const navigate = useNavigate()
    const row = { 
        _id: "some_id", 
        myTimeshareId: { 
            is_bookable: false 
        } 
    };
    React.useEffect(() => {
        Load();
    }, [])

    async function Load() {
        try {
            if (timeshareId) {
                // Fetch post data based on timeshareId
                const postData = await GetPostById(timeshareId);
                if (postData) {
                    setPost(postData);
                }
                
                // Fetch rent requests based on timeshareId
                const response = await GetExchangeRequestOfTimeshare(timeshareId);
                if (response) {
                    setRequestList(response);
                }
            }
        } catch (error: any) {
            console.error('Error loading data:', error.message);
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

    async function handleConfirmReservation(reservationId: string) {
        const response = await ConfirmReservation(reservationId);
        console.log(response);
        if (response?.code === 200) window.location.reload();
    }
 
    return (
        <Grid container spacing={1}
              sx={{flexGrow: 1, mx: {xs: 2, md: 6}, mt: 2, flexWrap: 'wrap', gap: 1}}>
            <Grid xs={12} md={12}>
            <Card
                variant="outlined"
                orientation="horizontal"
                sx={{
                    width: 1,
                    '&:hover': {boxShadow: 'lg', borderColor: 'neutral.outlinedHoverBorder'},
                }}
            >
                <AspectRatio ratio="1" sx={{width: 240}}>
                    <img
                        src={post?.resortId?.image_urls}
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
                <CardContent>
                    <Typography level="title-lg" id="card-description">
                        {post?.resortId?.name}
                    </Typography>
                    <Typography level="body-sm" aria-describedby="card-description" mb={1}>
                        <Link
                            overlay
                            underline="none"
                            href="#interactive-card"
                            sx={{color: 'text.tertiary'}}
                        >
                            {post?.resortId?.location}
                        </Link>
                    </Typography>
                    {requestList.length > 0 &&
                        <Chip
                            key={requestList[0]._id} // Add a unique key
                            variant="outlined"
                            color="primary"
                            sx={{ pointerEvents: 'none', mr: 1, mb: 1 }} // Adjust styling as needed
                        >

                            {post?.is_bookable === false ? "Completed" : "Pending"}
                        </Chip>
                    }

                    <Grid container spacing={2} sx={{flexGrow: 1, mt: 1}}>
                        <Grid xs={12} md={4}>
                            <Typography fontWeight={700} fontSize={16} >
                                Resort info
                            </Typography>
                            <Stack sx={{mt: 1}} direction="column" spacing={0} justifyContent="center">
                                <Typography fontWeight={400} fontSize={16}>
                                    <b>Name:</b> {post?.resortId?.name}
                                </Typography>
                                <Typography fontWeight={400} fontSize={16}>
                                    <b>Location:</b> {post?.resortId?.location}
                                </Typography>

                            </Stack>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Typography fontWeight={700} fontSize={16} >
                                Room type
                            </Typography>
                            <Stack sx={{mt: 1}} direction="column" spacing={0} justifyContent="center">
                                <Typography fontWeight={400} fontSize={16} >
                                    <b>Unit</b> {post?.unitId?.name}
                                </Typography>
                                <Typography fontWeight={400} fontSize={16} >
                                    <b>Detail</b> {post?.unitId?.details}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Typography fontWeight={700} fontSize={16} >
                                Time & price
                            </Typography>
                            <Stack sx={{mt: 1}} direction="column" spacing={0} justifyContent="center">
                                <Typography fontWeight={400} fontSize={16}>
                                    <b>Check-in:</b>  {formatDate(post?.start_date)}
                                </Typography>
                                <Typography fontWeight={400} fontSize={16}>
                                    <b>Check-out:</b>  {formatDate(post?.end_date)}
                                </Typography>
                                <Typography fontWeight={400} fontSize={16} >
                                    <b>Night:</b>  {post?.numberOfNights}
                                </Typography>
                                <Typography fontWeight={400} fontSize={16} >
                                    <b>Price:</b>  ${post?.price} (${post?.pricePerNight}/night)
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            </Grid>
            <Grid xs={12} md={12}>
                <Typography fontWeight={700} fontSize={16} >
                    Renting request
                </Typography>
                <RentRequestList timeshareId={timeshareId}/>
                <Typography fontWeight={700} fontSize={16} >
                    Exchange request
                </Typography>
                <ExchangeRequestList timeshareId={timeshareId}/>
            </Grid>
            {/*<Grid xs={12} md={8} sx={{ p: 1, boxShadow: '0 0 2px gray' }}>*/}

            {/*    <Box sx={{ flexGrow: 1, width: 1 }}>*/}
            {/*        <Typography fontWeight={400} fontSize={14}>*/}
            {/*            <b>Post id:</b> {post?._id}*/}
            {/*        </Typography>*/}
            {/*        <Typography color="primary" fontWeight={500} fontSize={30}>*/}
            {/*            {post?.resortId?.name}*/}
            {/*        </Typography>*/}
            {/*        <Typography fontWeight={500} fontSize={16}>*/}
            {/*            {post?.resortId?.location}*/}
            {/*        </Typography>*/}
            {/*        <AspectRatio maxHeight={360} sx={{ mt: 1 }} >*/}
            {/*            <img*/}
            {/*                src={post?.resortId?.image_urls}*/}
            {/*                alt="A beautiful landscape."*/}
            {/*            />*/}
            {/*        </AspectRatio>*/}

            {/*        <Box>*/}
            {/*            <Typography fontWeight={600} fontSize={22} sx={{ mt: 2 }}>*/}
            {/*                /!* <strong>Unit</strong> *!/*/}
            {/*            </Typography>*/}
            {/*            <Card variant="outlined"*/}
            {/*                orientation="horizontal" sx={{ display: 'flex', width: 1 }}  >*/}
            {/*                <img src={post?.unitId?.image_urls}*/}
            {/*                    style={{ width: '200px', height: 'auto' }} />*/}
            {/*                <Box>*/}
            {/*                    <Typography fontWeight={700} fontSize={26}>*/}
            {/*                        {post?.unitId?.name}*/}
            {/*                    </Typography>*/}
            {/*                    <Typography fontWeight={400} fontSize={18}>*/}
            {/*                        {post?.unitId?.details}*/}
            {/*                    </Typography>*/}
            {/*                </Box>*/}

            {/*            </Card>*/}
            {/*        </Box>*/}
            {/*        <Box sx={{ mt: 2 }}>*/}
            {/*            <Typography fontWeight={600} fontSize={22}>*/}
            {/*                <strong>Description</strong>*/}
            {/*            </Typography>*/}
            {/*            <Typography fontWeight={400} fontSize={16}>*/}
            {/*                <p>{post?.resortId?.description}</p>*/}
            {/*            </Typography>*/}
            {/*        </Box>*/}
            {/*        <Box>*/}
            {/*            <Typography fontWeight={600} fontSize={22}>*/}
            {/*                <strong>Feature</strong>*/}
            {/*            </Typography>*/}
            {/*            <Typography fontWeight={400} fontSize={16}>*/}
            {/*                <p>{post?.resortId?.nearby_attractions + ", "} </p>*/}
            {/*            </Typography>*/}
            {/*        </Box>*/}
            {/*        <Box>*/}
            {/*            <Typography fontWeight={600} fontSize={22}>*/}
            {/*                <strong>Facilities</strong>*/}
            {/*            </Typography>*/}
            {/*            <Typography fontWeight={400} fontSize={16}>*/}
            {/*                <p>{post?.resortId?.facilities + ", "}</p>*/}
            {/*            </Typography>*/}
            {/*        </Box>*/}
            {/*        <Box>*/}
            {/*            <Typography fontWeight={600} fontSize={22}>*/}
            {/*                <strong>Additional image</strong>*/}
            {/*            </Typography>*/}
            {/*            <Stack direction="row" spacing={1} sx={{*/}
            {/*                display: 'flex',*/}
            {/*                gap: 1,*/}
            {/*                py: 1,*/}
            {/*                overflow: 'auto',*/}
            {/*                width: 1,*/}
            {/*                scrollSnapType: 'x mandatory',*/}
            {/*                '& > *': {*/}
            {/*                    scrollSnapAlign: 'center',*/}
            {/*                },*/}
            {/*                '::-webkit-scrollbar': { display: 'none' },*/}
            {/*            }}>*/}
            {/*                {(post?.images || []).map((imageUrl: string, index: number) => (*/}
            {/*                    <AspectRatio ratio="1" sx={{ minWidth: 120 }}>*/}
            {/*                        <img*/}
            {/*                            key={index} // Add a unique key for each image*/}
            {/*                            src={imageUrl}*/}
            {/*                            alt={`Image ${index + 1}`}*/}
            {/*                            style={{ width: '200px', height: 'auto' }} // Adjust the style as needed*/}
            {/*                        />*/}
            {/*                    </AspectRatio>*/}
            {/*                ))}*/}
            {/*            </Stack>*/}

            {/*        </Box>*/}
            {/*    </Box>*/}
            {/*</Grid>*/}
            {/*<Grid xs={12} md={4} sx={{ p: 0, height: 'fit-content' }}>*/}
            {/*    <Stack sx={{ width: 1, display: 'flex', justifyContent: 'center', textAlign: 'center', boxShadow: '0 0 2px gray', }} direction="column" spacing={2} justifyContent="center">*/}
            {/*        <Typography fontWeight={600} fontSize={28} color="primary">*/}
            {/*            ${post?.price}(${post?.pricePerNight}/night)*/}
            {/*        </Typography>*/}
            {/*        <Typography fontWeight={600} fontSize={28} color="primary">*/}
            {/*            {post?.numberOfNights} night-stays*/}
            {/*        </Typography>*/}
            {/*        <Typography fontWeight={600} fontSize={22}>*/}
            {/*            Check-in: {formatDate(post?.start_date)}*/}
            {/*        </Typography>*/}
            {/*        <Typography fontWeight={600} fontSize={22}>*/}
            {/*            Check-out: {formatDate(post?.end_date)}*/}
            {/*        </Typography>*/}
            {/*        <Typography fontWeight={400} fontSize={20}>*/}
            {/*            Post by: {post?.current_owner?.username}*/}
            {/*        </Typography>*/}
            {/*    </Stack>*/}
            {/*    <Stack sx={{ width: 1, display: 'flex', justifyContent: 'flex-start', boxShadow: '0 0 0px gray', mt: 1 }} direction="column" spacing={1} justifyContent="center">*/}
            {/*        <strong>Reservation list</strong>*/}
            {/*        {(reservationList || []).map((item: any, index: number) => (*/}
            {/*            <Card*/}
            {/*                variant="outlined"*/}
            {/*                orientation="horizontal"*/}
            {/*                onClick={() => setOpen(true)}*/}
            {/*                sx={{*/}
            {/*                    width: 1,*/}
            {/*                    '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder', cursor: 'pointer'},*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <AspectRatio ratio="1" sx={{ width: 50, borderRadius: '50%' }}>*/}
            {/*                    <img*/}
            {/*                        src={item?.userId?.profilePicture}*/}
            {/*                        loading="lazy"*/}
            {/*                        alt=""*/}
            {/*                    />*/}
            {/*                </AspectRatio>*/}
            {/*                <CardContent>*/}
            {/*                    <Typography level="title-lg" id="card-description">*/}
            {/*                        {item?.userId?.username}*/}
            {/*                    </Typography>*/}
            {/*                    <Typography level="body-sm" aria-describedby="card-description" mb={1}>*/}

            {/*                        {formatDate(item?.reservationDate)}*/}

            {/*                    </Typography>*/}
            {/*                    <Chip*/}
            {/*                        variant="outlined"*/}
            {/*                        color="success"*/}
            {/*                        size="sm"*/}
            {/*                        sx={{ pointerEvents: 'none' }}*/}
            {/*                    >*/}
            {/*                        Is paid*/}
            {/*                    </Chip>*/}
            {/*                </CardContent>*/}
            {/*                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, '& > button': { flex: 1 } }}>*/}
            {/*                    {item?.status === 'confirmed' ?*/}
            {/*                        <Typography level="body-md" aria-describedby="card-description" mb={1}>*/}
            {/*                            <CheckCircleRoundedIcon color="success" />*/}
            {/*                            Confirmed*/}
            {/*                        </Typography>*/}
            {/*                        : <>*/}
            {/*                            <Button variant="solid" color="success" onClick={() => handleConfirmReservation(item?._id)}>*/}
            {/*                                Accept*/}
            {/*                            </Button>*/}
            {/*                            <Button variant="outlined" color="danger">*/}
            {/*                                Reject*/}
            {/*                            </Button>*/}
            {/*                        </>}*/}

            {/*                </Box>*/}

            {/*            </Card>*/}
            {/*        ))}*/}

            {/*    </Stack>*/}
            {/*</Grid>*/}
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose variant="plain" sx={{m: 1}}/>
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        This is the modal title
                    </Typography>
                    <Typography id="modal-desc" textColor="text.tertiary">
                        Make sure to use <code>aria-labelledby</code> on the modal dialog with an
                        optional <code>aria-describedby</code> attribute.
                    </Typography>
                </Sheet>
            </Modal>
        </Grid>

    );
}
