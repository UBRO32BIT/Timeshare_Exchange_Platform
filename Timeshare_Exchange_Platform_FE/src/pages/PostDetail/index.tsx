import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import NavBar from '../../components/Rental/NavBar';
import { GetPostById } from '../../services/post.service';
import Grid from '@mui/joy/Grid';
import { Button, Typography } from '@mui/joy';
import { Routes, Route, useParams } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

export default function RentalDashboard() {
    const [post, setPost] = React.useState<any>([]);
    const user = useSelector((state: RootState) => state?.auth?.user);
    let { postId } = useParams();
    const navigate = useNavigate()

    React.useEffect(() => {
        Load()
    }, [])
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
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <NavBar />
            <Grid container spacing={0} sx={{ flexGrow: 1, width: 1, pr: 5, pl: 5, mt: 2, gap: 1, flexWrap: { xs: 'wrap', md: 'nowrap', } }}>
                <Grid xs={12} md={8} sx={{ p: 1, boxShadow: '0 0 1px gray' }}>
                    <Box sx={{ flexGrow: 1, width: 1 }}>
                        <Typography fontWeight={400} fontSize={14}>
                            <b>Post id:</b> {post?._id}
                        </Typography>
                        <Typography color="primary" fontWeight={500} fontSize={30}>
                            {post?.resortId?.name}
                        </Typography>
                        <Typography fontWeight={500} fontSize={16}>
                            {post?.resortId?.location}
                        </Typography>
                        <AspectRatio maxHeight={360} sx={{ mt: 1 }} >
                            <img
                                src={post?.resortId?.image_urls}
                                alt="A beautiful landscape."
                            />
                        </AspectRatio>
                        <Stack direction="row" spacing={1} sx={{
                            display: 'flex',
                            gap: 1,
                            py: 1,
                            overflow: 'auto',
                            width: 1,
                            scrollSnapType: 'x mandatory',
                            '& > *': {
                                scrollSnapAlign: 'center',
                            },
                            '::-webkit-scrollbar': { display: 'none' },
                        }}>
                            {(post?.resortId?.image_urls || []).map((imageUrl: string, index: number) => (
                                <AspectRatio ratio="1" sx={{ minWidth: 100 }}>
                                    <img
                                        key={index} // Add a unique key for each image
                                        src={imageUrl}
                                        alt={`Image ${index + 1}`}
                                        style={{ width: '200px', height: 'auto' }} // Adjust the style as needed
                                    />
                                </AspectRatio>
                            ))}
                        </Stack>
                        <Box>
                            <Typography fontWeight={600} fontSize={22} sx={{ mt: 2 }}>
                                <strong>Unit</strong>
                            </Typography>
                            <Card variant="outlined"
                                orientation="horizontal" sx={{ display: 'flex', width: 1 }}  >

                                <img src={post?.unitId?.image_urls}
                                    style={{ width: '200px', height: 'auto' }} />
                                <Box>
                                    <Typography fontWeight={700} fontSize={26}>
                                        {post?.unitId?.name}
                                    </Typography>
                                    <Typography fontWeight={400} fontSize={18}>
                                        {post?.unitId?.details}
                                    </Typography>
                                </Box>

                            </Card>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography fontWeight={600} fontSize={22}>
                                <strong>Description</strong>
                            </Typography>
                            <Typography fontWeight={400} fontSize={16}>
                                <p>{post?.resortId?.description}</p>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={600} fontSize={22}>
                                <strong>Feature</strong>
                            </Typography>
                            <Typography fontWeight={400} fontSize={16}>
                                <p>{post?.resortId?.nearby_attractions + ", "} </p>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={600} fontSize={22}>
                                <strong>Facilities</strong>
                            </Typography>
                            <Typography fontWeight={400} fontSize={16}>
                                <p>{post?.resortId?.facilities + ", "}</p>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight={600} fontSize={22}>
                                <strong>Additional image</strong>
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{
                                display: 'flex',
                                gap: 1,
                                py: 1,
                                overflow: 'auto',
                                width: 1,
                                scrollSnapType: 'x mandatory',
                                '& > *': {
                                    scrollSnapAlign: 'center',
                                },
                                '::-webkit-scrollbar': { display: 'none' },
                            }}>
                                {(post?.images || []).map((imageUrl: string, index: number) => (
                                    <AspectRatio ratio="1" sx={{ minWidth: 120 }}>
                                        <img
                                            key={index} // Add a unique key for each image
                                            src={imageUrl}
                                            alt={`Image ${index + 1}`}
                                            style={{ width: '200px', height: 'auto' }} // Adjust the style as needed
                                        />
                                    </AspectRatio>
                                ))}
                            </Stack>

                        </Box>
                    </Box>
                </Grid>
                <Grid xs={12} md={4} sx={{ p: 1, boxShadow: '0 0 1px gray', height: 'fit-content', position: { md: 'fixed' }, right: 5 }}>
                    <Stack sx={{ width: 1, display: 'flex', justifyContent: 'center', textAlign: 'center' }} direction="column" spacing={2} justifyContent="center">
                        <Typography fontWeight={600} fontSize={28} color="primary">
                            ${post?.price}(${post?.pricePerNight}/night)
                        </Typography>
                        <Typography fontWeight={600} fontSize={28} color="primary">
                            {post?.numberOfNights} night-stays
                        </Typography>
                        <Typography fontWeight={600} fontSize={22}>
                            Check-in: {formatDate(post?.start_date)}
                        </Typography>
                        <Typography fontWeight={600} fontSize={22}>
                            Check-out: {formatDate(post?.end_date)}
                        </Typography>
                        <Button sx={{ backgroundColor: "green", boxShadow: '0 0 1px gray', fontSize: 22 }} disabled={user?._id === post?.current_owner?._id || !post?.is_bookable} onClick={() => { navigate(`/post/${postId}/book`) }}>
                            Request to book
                        </Button>
                        <Typography fontWeight={400} fontSize={20}>
                            Post by: {post?.current_owner?.username}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </CssVarsProvider>
    );
}