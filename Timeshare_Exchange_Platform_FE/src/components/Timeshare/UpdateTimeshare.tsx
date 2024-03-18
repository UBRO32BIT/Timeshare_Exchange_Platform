import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import { useSelector } from 'react-redux';
import ResortInput from './ResortInput'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { UploadPost } from '../../services/post.service';
import CardContent from '@mui/joy/CardContent';
import { Routes, Route, useParams } from 'react-router-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { GetPostById } from '../../services/post.service';

interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}
function sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}
export default function UpdateTimeshare() {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [imageFiles, setImageFiles] = React.useState<any[]>([]);
    const [startDate, setStartDate] = React.useState<string>('');
    const [endDate, setEndDate] = React.useState<string>('');
    const [price, setPrice] = React.useState<string>('');
    const [uploading, setUploading] = React.useState<boolean>();
    const [post, setPost] = React.useState<any>([]);
    const navigate = useNavigate()
    let { postId } = useParams();
    React.useEffect(() => {
        Load()
    }, [])
    async function Load() {
        if (postId) {
            const postData = await GetPostById(postId);
            if (postData) {
                setPost(postData)
                setStartDate(postData?.start_date);
                setEndDate(postData?.end_date);
                setPrice(postData?.price);
                setImageFiles(postData?.images);
            }
        }
    }
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
    };

    async function handleSubmit(e: any) {
        setUploading(true);
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        imageFiles.forEach((file, index) => {
            formData.append('imageFiles', file);
        });
        const formJson = Object.fromEntries((formData as any).entries());
        console.log(formJson)
        const result = await UploadPost(formData);
        if (result) {
            setUploading(false)
        }
        window.location.reload();
    }
    const calculateNumberOfNights = () => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const timeDiff = Math.abs(end.getTime() - start.getTime());
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return nights;
        }
        return 0;
    };

    const calculatePricePerNight = () => {
        const nights = calculateNumberOfNights();
        if (nights > 0 && price) {
            const totalPrice = parseFloat(price);
            const pricePerNight = totalPrice / nights;
            return pricePerNight.toFixed(2);
        }
        return '0.00';
    };

    return (
        post._id && <Box sx={{ flex: 1, width: '100%' }}>
            <Stack
                spacing={4}
                sx={{
                    display: 'flex',
                    maxWidth: '800px',
                    // mx: 'auto',
                    px: { xs: 2, md: 6 },
                    py: { xs: 2, md: 3 },
                }}
            >
                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Update timeshare post</Typography>
                        <Typography level="body-sm">
                            Customize your timeshare post 
                        </Typography>
                    </Box>
                    <Divider />
                    <Stack
                        direction="row"
                        spacing={3}
                        sx={{ display: { xs: '12', md: 'flex' }, my: 1 }}
                    >
                        <Stack direction="column" spacing={1}>

                        </Stack>
                        <Stack spacing={2} sx={{ flexGrow: 1, gap: 2, display: { sm: 'flex-column', md: 'flex-row' } }}>
                            <Stack spacing={1}>
                                <FormControl
                                    sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                >
                                    <form onSubmit={handleSubmit}>
                                        <ResortInput post={post}/>
                                        <FormLabel sx={{ mt: 2 }}>Type</FormLabel>
                                        <Select defaultValue={post?.type} name="type" size='sm'>
                                            <Option value="rental">Rental</Option>
                                            <Option value="exchange">Exchange</Option>
                                        </Select>
                                        <input type='hidden' name='current_owner' value={user?._id}></input>
                                        <input type='hidden' name='owner_exchange' value={user?._id}></input>
                                        <FormLabel sx={{ mt: 2 }}>Owner name</FormLabel>
                                        <Input
                                            size="sm"
                                            placeholder="First name"
                                            name="firstname"
                                            defaultValue={post?.current_owner?.firstname}
                                        />

                                        <Stack direction="row" spacing={4} sx={{ width: '100%', mt: 2 }}>
                                            <FormControl sx={{ display: 'inline', gap: 1 }}>
                                                <FormLabel>Start date</FormLabel>
                                                <Input
                                                    type="date"
                                                    size="sm"
                                                    placeholder="Start date"
                                                    name="start_date"
                                                    sx={{}}
                                                    defaultValue={new Date(startDate).toISOString().split('T')[0]}
                                                    onChange={handleStartDateChange}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ display: 'inline', gap: 1 }}>
                                                <FormLabel>End date</FormLabel>
                                                <Input
                                                    type="date"
                                                    size="sm"
                                                    placeholder="End date"
                                                    name="end_date"
                                                    sx={{}}
                                                    defaultValue={new Date(endDate).toISOString().split('T')[0]}
                                                    onChange={handleEndDateChange}
                                                />
                                            </FormControl>
                                        </Stack>
                                        <FormLabel sx={{ mt: 2 }}>Add image</FormLabel>
                                        <Input
                                            size="sm"
                                            type="file"
                                            placeholder="Image"
                                            onChange={(e) => {
                                                const files = e?.target?.files;
                                                if (files) {
                                                    setImageFiles((prev) => [...prev, ...Array.from(files)]);
                                                }
                                            }}
                                        />
                                        {imageFiles?.length !== 0 && (
                                            <Box sx={{ display: 'flex', width: 1, flexWrap: 'wrap', mt: 2 }}>
                                                {imageFiles.map(function (url, imageIndex) {
                                                    return (<div style={{ position: "relative" }}>
                                                        <img src={typeof url === 'string' ? url : URL.createObjectURL(url)} alt="Pasted Image" height={90} style={{ borderRadius: "5px", margin: '2px' }} />
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setImageFiles((prev) => prev.filter((_, index) => index !== imageIndex));
                                                            }}
                                                            style={{
                                                                position: 'absolute',
                                                                top: 5,
                                                                right: 5,
                                                            }}
                                                        >
                                                            <DeleteForeverIcon />
                                                        </button>
                                                    </div>

                                                    )
                                                })}
                                            </Box>)}
                                        <FormLabel sx={{ mt: 2 }}>Price</FormLabel>
                                        <Input
                                            size="sm"
                                            placeholder="Total cost"
                                            name="price"
                                            defaultValue={price}
                                            onChange={handlePriceChange}
                                        />

                                        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2, }}>
                                            <CardContent orientation="horizontal">
                                                <div>
                                                    <Typography level="body-xs">Total price:</Typography>
                                                    <Typography fontSize="lg" fontWeight="lg">

                                                        ${price}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography level="body-xs">Number of nights:</Typography>
                                                    <Typography fontSize="lg" fontWeight="lg">
                                                        <input type='hidden'
                                                            name='numberOfNights'
                                                            value={calculateNumberOfNights()}
                                                        >
                                                        </input>
                                                        {calculateNumberOfNights()}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography level="body-xs">Price per night:</Typography>
                                                    <Typography fontSize="lg" fontWeight="lg">
                                                        <input type='hidden'
                                                            name='pricePerNight'
                                                            value={calculatePricePerNight()}
                                                        ></input>
                                                        ${calculatePricePerNight()}
                                                    </Typography>
                                                </div>
                                            </CardContent>
                                            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                                                <Button size="sm" variant="outlined" color="neutral">
                                                    Cancel
                                                </Button>
                                                {uploading ? (<Button loading size="sm" variant="solid" type='submit'>
                                                    Save
                                                </Button>) : <Button size="sm" variant="solid" type='submit'>
                                                    Save
                                                </Button>}

                                            </CardActions>
                                        </CardOverflow>
                                    </form>


                                </FormControl>

                            </Stack>

                        </Stack>

                    </Stack>

                </Card>


            </Stack>
        </Box>
    );
}
