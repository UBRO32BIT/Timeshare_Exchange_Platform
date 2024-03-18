import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import { GetPostById } from '../../services/post.service';
import Grid from '@mui/joy/Grid';
import { Button, FormHelperText, Typography } from '@mui/joy';
import { useParams } from 'react-router-dom';
import Card from '@mui/joy/Card';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import CountrySelector from '../../components/Profile/CountrySelector';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ImageGallery from "react-image-gallery";
import convertImageArray from "../../utils/convertImageArray";
import {MenuItem} from '@mui/joy';
import InputLabel from '@mui/material/InputLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';
import {GetTimeshareExchangeByCurrentOwner} from '../../services/post.service'
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/joy/Alert';
import { MakeExchange } from '../../services/booking.service'
import '../../styles/exchange.css';
import { RootState } from '../../features/auth/auth.slice';
import * as yup from "yup";
import { InfoOutlined } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {Height, WidthFull} from '@mui/icons-material';
import Avatar from '@mui/joy/Avatar';
import AvatarGroup from '@mui/joy/AvatarGroup';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import {convertDate} from '../../utils/date'
import {useSnackbar} from 'notistack';

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
interface FormData {
    fullName: string,
    email: string,
    phone: string,
    amount: number,
    userId: string,
    postId: any,
    myTimeshareId: string,
    country: string,
    street: string,
    city: string,
    province: string,
    zipCode: number,
}
const schema = yup.object().shape({
    fullName: yup.string()
        .required("Full Name is required!"),
    email: yup.string()
        .required("Email is required!")
        .email("Email is invalid!"),
    phone: yup.string()
        .required("Phone number is required!"),
    street: yup.string(),
    city: yup.string(),
    province: yup.string(),
    zipCode: yup.string(),
})

export default function Exchange() {
    const isAuthenticated = useSelector((state: RootState) => state?.auth?.isAuthenticated);
    const isAuthLoaded = useSelector((state: RootState) => state.auth.isLoaded);
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [post, setPost] = React.useState<any>([]);
    const [myPosts, setMyPosts] = React.useState<any>([]);
    const [country, setCountry] = React.useState<any>({ code: 'VN', label: 'Vietnam', phone: '84' });
    const navigate = useNavigate();
    let { postId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [uploading, setUploading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
    })

    React.useEffect(() => {
        if (!isAuthenticated && isAuthLoaded) {
            navigate('/login');
        }
        else if (post?.is_bookable === false) {
            navigate('/home')
            enqueueSnackbar(`This timeshare is no longer available for exchange!`, { variant: "error" })
        }
        else if (user?._id === post?.current_owner?._id) {
            navigate('/home')
            enqueueSnackbar(`Timeshare owner cannot request exchange!`, { variant: "error" });
        }
    }, [isAuthenticated, isAuthLoaded]);

    async function handleExchange(e: any) {
        //e.preventDefault();
        setUploading(true);
        const formData: FormData = {
            fullName: e.fullName,
            email: e.email,
            phone: e.phone,
            amount: post?.price,
            userId: user?._id,
            postId: postId,
            myTimeshareId: myPosts[selectedResortIndex]?._id,
            country: country.label,
            street: e?.street,
            city: e?.city,
            province: e?.province,
            zipCode: e?.zipCode,
        }
        console.log(formData);
        try {
            const makeExchange = await MakeExchange(postId, formData);
            if (makeExchange) {
                navigate(`/timeshare/${postId}/exchange/${makeExchange._id}/confirm`);
            }
        } catch (error) {
            
            enqueueSnackbar('Request already exists. Please choose another timeshare', { variant: 'error' });
            // Handle error appropriately, e.g., show error message to the user
        } finally {
            setUploading(false);
        }
    }


    const handleButtonClick = () => {
        // Lấy tên của MyTimeshare từ dữ liệu đã có, ví dụ: post.resortId.name
        // const timeshareName = post?.resortId?.name || '';
        // Cập nhật state myTimeshareName với tên của MyTimeshare
        // setPost(timeshareName);
        setOpen(true)
    };
    const [selectedResortIndex, setSelectedResortIndex] = React.useState<any>([]);

    const handleResortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedResortIndex(Number(event.target.value));
    };
    const [selectedPost, setSelectedPost] = React.useState<any>([]);

    const handleCardClick = (index: number) => {
        setSelectedResortIndex(index);
    };
    const handleButtonSubmit = () => {
        if (myPosts && myPosts.length > 0) {
            const selectedResortId = myPosts[selectedResortIndex]?.resortId.name;
            if (selectedResortId) {
                console.log("Selected Resort ID:", selectedResortId);
                setOpen(false);
            } else {
                console.error("Resort ID chưa được chọn.");
            }
        } else {
            console.error("Không tìm thấy bài đăng.");
        }
    };


    async function GetMyPosts() {
        const postsData = await GetTimeshareExchangeByCurrentOwner(user._id);
        console.log(postsData)
        if (postsData && postsData.length > 0) {
            console.log(postsData);
            setMyPosts(postsData)
        }
    }

    React.useEffect(() => {
        if (!isAuthenticated) {

        } else {
            GetMyPosts();
            if (postId) {
                Load();
            }
        }
    }, [user, isAuthenticated, postId]);

    async function Load() {
        if (postId) {
            const postData = await GetPostById(postId);
            if (postData) {
                setPost(postData)
            }
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
            {isAuthLoaded && (
                <>
                    <Header />
                    <CssVarsProvider disableTransitionOnChange>
                        <CssBaseline />
                        {/*<NavBar />*/}
                        <Grid container spacing={0}
                            sx={{ flexGrow: 1, width: 1, px: 10, mt: 2, gap: 1, }}>
                            <Grid container sx={{ p: 1, height: 'fit-content' }}>
                                <Grid xs={12} md={4} lg={4}>
                                    <Stack sx={{
                                        borderRadius: '8px',
                                        width: 1,
                                        p: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        boxShadow: '0 0 4px gray',
                                    }} direction="column" spacing={0}
                                        justifyContent="center">
                                        <React.Fragment>
                                            <Button variant="outlined" color="neutral" onClick={handleButtonClick}>
                                                {myPosts[selectedResortIndex]?.resortId.name || 'Select Resort'}
                                            </Button>
                                            <Modal open={open} onClose={() => setOpen(false)}>
                                                <ModalDialog
                                                    aria-labelledby="nested-modal-title"
                                                    aria-describedby="nested-modal-description"
                                                    sx={(theme) => ({
                                                        [theme.breakpoints.only('xs')]: {
                                                            top: 'unset',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            borderRadius: 0,
                                                            transform: 'none',
                                                            maxWidth: '80%', // Thay đổi maxWidth thành 80%
                                                        },
                                                        overflowY: 'scroll', // Add overflowY to enable vertical scrollbar
                                                        maxHeight: '80vh', // Limit maximum height and enable vertical scrollbar
                                                    })}
                                                >
                                                    <Typography id="nested-modal-title" level="h2">
                                                        Select Timeshare
                                                    </Typography>

                                                    <Box sx={{ overflowX: 'hidden' , width:'600px'}}>
                                                        <Grid container spacing={2} sx={{ overflowX: 'hidden' }}>
                                                            {myPosts.map((post: any, index: number) => (
                                                                <Grid key={index} xs={12} sm={6}>
                                                                    <Card
                                                                        variant="outlined"
                                                                        sx={{
                                                                            width: '100%',
                                                                            cursor: post.is_bookable ? 'pointer' : 'not-allowed', // Kiểm tra nếu không bookable thì sử dụng cursor 'not-allowed'
                                                                            '&:hover': {
                                                                                backgroundColor: post.is_bookable ? '#EEEEEE' : 'none',
                                                                                boxShadow: post.is_bookable ? '0 0 8px rgba(0, 0, 0, 0.2)' : 'none', // Chỉ hiển thị boxShadow khi bookable
                                                                            },
                                                                        }}
                                                                        onClick={() => post.is_bookable && handleCardClick(index)} // Kiểm tra nếu bookable thì mới thực hiện handleCardClick
                                                                    >
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <AvatarGroup size="sm" sx={{ '--Avatar-size': '40px' }}>
                                                                                <Avatar src={post?.resortId?.image_urls?.[0]} />
                                                                                <Avatar src={post?.resortId?.image_urls?.[1]} />
                                                                                <Avatar src={post?.resortId?.image_urls?.[2]} />
                                                                                <Avatar src={post?.resortId?.image_urls?.[3]} />
                                                                                <Avatar>+</Avatar>
                                                                            </AvatarGroup>
                                                                            <Typography sx={{ backgroundColor: post.is_bookable ? '#AEEA00' : 'gray', fontSize: '10px', display: 'inline-block', padding: '3px 8px', borderRadius: '4px', color: post.is_bookable ? '' : '#fff' }}>
                                                                                {post.is_bookable ? "NOT YET" : "SOLD"}
                                                                            </Typography>
                                                                        </Box>
                                                                        <CardContent >
                                                                            <Typography>
                                                                                <h6>{post.resortId.name}</h6>
                                                                            </Typography>
                                                                            <Typography sx={{ fontSize: '12px' }}>
                                                                                Unit: {post.unitId.name}
                                                                            </Typography>
                                                                            <Typography sx={{ fontSize: '10px' }}>
                                                                                Price: {post.price}$
                                                                            </Typography>
                                                                            <Typography sx={{ fontSize: '10px' }}>
                                                                                Start Date: {convertDate(post?.start_date)}
                                                                            </Typography>
                                                                            <Typography sx={{ fontSize: '10px' }}>
                                                                                End Date: {convertDate(post?.end_date)}
                                                                            </Typography>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Box>

                                                    <CardActions sx={{ alignSelf: 'flex-end', pt: 2, gap: 2, justifyContent: 'flex-end' }}>
                                                        <Button sx={{ width: '40%' }} variant="solid" color="primary" type='submit' onClick={handleButtonSubmit}>
                                                            Continue
                                                        </Button>
                                                    </CardActions>

                                                </ModalDialog>
                                            </Modal>







                                        </React.Fragment>
                                        {/*{post && <ImageGallery items={convertImageArray([...post?.images, ...post?.resortId?.image_urls])} showPlayButton={false} />}*/}
                                        {/*<ImageGallery items={post?.resortId?.image_urls} />;*/}

                                        {
                                            selectedResortIndex !== null && (
                                                <>
                                                    <img src={myPosts[selectedResortIndex]?.resortId?.image_urls} />
                                                    <Typography fontWeight={600} fontSize={28}>
                                                        {myPosts[selectedResortIndex]?.resortId?.name}
                                                    </Typography>

                                                    <Typography fontWeight={400} fontSize={18}>
                                                        Owner: {myPosts[selectedResortIndex]?.current_owner?.username}
                                                    </Typography>
                                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                        <Typography fontWeight={500} fontSize={20}>
                                                            Unit:
                                                        </Typography>
                                                        <Typography fontWeight={400} fontSize={20}>
                                                            {myPosts[selectedResortIndex]?.unitId?.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography fontWeight={500} fontSize={20}>
                                                            Stay:
                                                        </Typography>
                                                        <Typography fontWeight={400} fontSize={20}>
                                                            {myPosts[selectedResortIndex]?.numberOfNights} night
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', }}>
                                                        <Typography fontWeight={500} fontSize={20}>
                                                            Check-in:
                                                        </Typography>
                                                        <Typography fontWeight={400} fontSize={20}>
                                                            {formatDate(myPosts[selectedResortIndex]?.start_date)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography fontWeight={500} fontSize={20}>
                                                            Check-out:
                                                        </Typography>
                                                        <Typography fontWeight={400} fontSize={20}>
                                                            {formatDate(myPosts[selectedResortIndex]?.end_date)}
                                                        </Typography>
                                                    </Box>
                                                    <Divider sx={{ mt: 1, mb: 1 }} />
                                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography fontWeight={500} fontSize={20}>
                                                            Price/night:
                                                        </Typography>
                                                        <Typography fontWeight={400} fontSize={20}>
                                                            ${myPosts[selectedResortIndex]?.pricePerNight}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography fontWeight={500} fontSize={20}>
                                                            Total:
                                                        </Typography>
                                                        <Typography fontWeight={600} fontSize={20}>
                                                            ${myPosts[selectedResortIndex]?.price}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )
                                        }

                                    </Stack>
                                </Grid>
                                <Grid xs={12} md={4} lg={4} sx={{
                                    width: 1,
                                    p: 1,
                                    fontSize: '100',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Stack sx={{
                                        p: 1,
                                        fontSize: 'large',
                                        color: '#e87014',
                                        textAlign: 'center',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        height: 'fit-content',
                                        flexDirection: 'column'
                                    }} direction="column">
                                        <Typography fontSize={20} fontWeight={600}>
                                            Exchange
                                        </Typography>
                                        <SwapHorizIcon sx={{ fontSize: 120, color: '#e87014' }} />
                                    </Stack>

                                </Grid>
                                <Grid xs={12} md={4} lg={4}>
                                    <Stack sx={{
                                        borderRadius: '8px',
                                        width: 1,
                                        p: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        boxShadow: '0 0 4px gray'
                                    }} direction="column" spacing={0}
                                        justifyContent="center">
                                        <Box sx={{ width: '100%' }}>
                                            <Alert variant="outlined">{post?.resortId?.name}</Alert>
                                        </Box>
                                        <img src={post?.resortId?.image_urls} />
                                        <Typography fontWeight={600} fontSize={28}>
                                            {post?.resortId?.name}
                                        </Typography>
                                        <Typography fontWeight={400} fontSize={18}>
                                            Owner: {post?.current_owner?.username}
                                        </Typography>
                                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                            <Typography fontWeight={500} fontSize={20}>
                                                Unit:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={20}>
                                                {post?.unitId?.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography fontWeight={500} fontSize={20}>
                                                Stay:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={20}>
                                                {post?.numberOfNights} night
                                            </Typography>
                                        </Box>
                                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', }}>
                                            <Typography fontWeight={500} fontSize={20}>
                                                Check-in:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={20}>
                                                {formatDate(post?.start_date)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography fontWeight={500} fontSize={20}>
                                                Check-out:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={20}>
                                                {formatDate(post?.end_date)}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ mt: 1, mb: 1 }} />
                                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography fontWeight={500} fontSize={20}>
                                                Price/night:
                                            </Typography>
                                            <Typography fontWeight={400} fontSize={20}>
                                                ${post?.pricePerNight}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography fontWeight={500} fontSize={20}>
                                                Total:
                                            </Typography>
                                            <Typography fontWeight={600} fontSize={20}>
                                                ${post?.price}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Grid xs={12} md={8} sx={{ p: 1, boxShadow: '0 0 0px gray' }}>
                                <Typography fontWeight={700} fontSize={26}>
                                    Request to exchange
                                </Typography>
                                <form onSubmit={handleSubmit(handleExchange)}>
                                    <Box sx={{
                                        borderRadius: '8px',
                                        width: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 2,
                                        p: 1,
                                        boxShadow: '0 0 4px gray',
                                    }}>
                                        <Stack direction="column" spacing={4} sx={{ width: 1, mt: 1 }}>
                                            {/* <FormControl sx={{ display: 'inline', gap: 1, width: 0.15 }}>
                                        <FormLabel>Guest number</FormLabel>
                                        <Select defaultValue="1">
                                            <Option value="1">1</Option>
                                            <Option value="2">2</Option>
                                            <Option value="3">3</Option>
                                            <Option value="4">4</Option>
                                            <Option value="5">5</Option>
                                            <Option value="6">6</Option>
                                        </Select>
                                    </FormControl> */}

                                            {/* ////////// */}
                                            <FormControl sx={{ display: 'inline', gap: 1, width: 0.5 }}>
                                                <FormLabel>Full name</FormLabel>
                                                <Input
                                                    type="text"
                                                    size="md"
                                                    placeholder="Full name"
                                                    {...register('fullName')}
                                                    defaultValue={user?.firstname + " " + user?.lastname}
                                                    error={!!errors.fullName}
                                                    sx={{}}
                                                />
                                                {errors.fullName && <FormHelperText><InfoOutlined />{errors.fullName.message}</FormHelperText>}
                                                <FormLabel sx={{ mt: 2 }}>Email</FormLabel>
                                                <Input
                                                    size="md"
                                                    type="email"
                                                    startDecorator={<EmailRoundedIcon />}
                                                    placeholder="email"
                                                    {...register('email')}
                                                    defaultValue={user?.email}
                                                    error={!!errors.email}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                {errors.email && <FormHelperText><InfoOutlined />{errors.email.message}</FormHelperText>}
                                                <FormLabel sx={{ mt: 2 }}>Phone</FormLabel>
                                                <Input
                                                    size="md"
                                                    placeholder="Phone"
                                                    {...register('phone')}
                                                    defaultValue={user?.phone}
                                                    error={!!errors.phone}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                {errors.phone && <FormHelperText><InfoOutlined />{errors.phone.message}</FormHelperText>}
                                                <FormLabel sx={{ mt: 2 }}>Country</FormLabel>
                                                <CountrySelector />
                                            </FormControl>
                                            <FormControl sx={{ display: 'inline', gap: 1, width: 1 }}>
                                                <FormLabel sx={{}}>Street</FormLabel>
                                                <Input
                                                    size="md"
                                                    placeholder="Street"
                                                    {...register('street')}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ display: 'inline-flex', gap: 1, width: 1 }}>
                                                <Grid container spacing={0} sx={{
                                                    flexGrow: 1,
                                                    width: 1,
                                                    gap: 1,
                                                    flexWrap: { xs: 'wrap', md: 'nowrap', }
                                                }}>
                                                    <Grid xs={12} md={4}>
                                                        <FormLabel sx={{}}>City</FormLabel>
                                                        <Input
                                                            size="md"
                                                            placeholder="City"
                                                            {...register('city')}
                                                            sx={{ flexGrow: 1 }}
                                                        />
                                                    </Grid>
                                                    <Grid xs={12} md={4}>
                                                        <FormLabel sx={{}}>Province</FormLabel>
                                                        <Input
                                                            size="md"
                                                            placeholder="Province"
                                                            {...register('province')}
                                                            sx={{ flexGrow: 1 }}
                                                        />
                                                    </Grid>
                                                    <Grid xs={12} md={4}>
                                                        <FormLabel sx={{}}>ZipCode</FormLabel>
                                                        <Input
                                                            size="md"
                                                            placeholder="Zip code"
                                                            {...register('zipCode')}
                                                            sx={{ flexGrow: 1 }}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <FormControl sx={{ display: 'none' }}>
                                                    <Input type="hidden" name="myTimeshareId" value={myPosts[selectedResortIndex]?._id} />

                                                    <Input type="hidden" name="amount" value={post?.price} />

                                                    <FormControl sx={{ display: 'none' }}>
                                                        <Input type="hidden" name="status"
                                                            value="Agreement phase" />
                                                    </FormControl>
                                                </FormControl>
                                                <FormControl sx={{ display: 'none' }}>
                                                    <Input type="hidden" name="userId" value={user?._id} />
                                                </FormControl>
                                                <FormControl sx={{ display: 'none' }}>
                                                    <Input type="hidden" name="postId" value={postId} />
                                                </FormControl>
                                                <FormControl sx={{ display: 'none' }}>
                                                    <Input type="hidden" name="request_at"
                                                        value={new Date().toLocaleString() + ""} />
                                                </FormControl>
                                            </FormControl>

                                        </Stack>
                                    </Box>
                                    <CardOverflow sx={{
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        mt: 2,
                                        width: 1,
                                        display: 'flex',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <CardActions sx={{ alignSelf: 'flex-end', pt: 2, gap: 2 }}>
                                            <Button size="sm" variant="outlined" color="neutral">
                                                Cancel
                                            </Button>
                                            <Button loading={uploading} size="sm" variant="solid" type='submit'>
                                                Save
                                            </Button>
                                        </CardActions>
                                    </CardOverflow>
                                </form>
                            </Grid>
                        </Grid>
                    </CssVarsProvider>
                    <Footer />
                </>
            )}
        </>
    );
}