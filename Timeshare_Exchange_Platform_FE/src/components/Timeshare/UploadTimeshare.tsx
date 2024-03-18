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
import { isValidDateRange } from '../../utils/date';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { DialogContent, DialogTitle, Grid, Modal, ModalClose, ModalDialog, styled } from "@mui/joy";
import {CountUploadTimeshareByUser} from '../../services/post.service'
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
export default function MyProfile() {
    const [remainingUploads, setRemainingUploads] = React.useState(0);
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [imageFiles, setImageFiles] = React.useState<File[]>([]);
    const [startDate, setStartDate] = React.useState<string>('');
    const [endDate, setEndDate] = React.useState<string>('');
    const [price, setPrice] = React.useState<string>('');
    const [uploading, setUploading] = React.useState<boolean>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let isValid = true;
        if (endDate !== '') {
            isValid = isValidDateRange(e.target.value, endDate)
        }
        if (isValid) {
            setStartDate(e.target.value);
        }
        else enqueueSnackbar("Invalid date range", { variant: "error" });
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let isValid = true;
        if (startDate !== '') {
            isValid = isValidDateRange(startDate, e.target.value)
        }
        if (isValid) {
            setEndDate(e.target.value);
        }
        else enqueueSnackbar("Invalid date range", { variant: "error" });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            if (parseInt(e.target.value) > 0) {
                setPrice(e.target.value);
            }
            else enqueueSnackbar("Price must be a positive number!", { variant: "error" });
        }
        else setPrice('');
    };

    async function handleSubmit(e: any) {
        try {
            setUploading(true)
            e.preventDefault();
            const formData = new FormData(e.currentTarget)
            if (!formData.get(`price`)) {
            throw Error(`price required`)
        }
            imageFiles.forEach((file, index) => {
                formData.append('imageFiles', file);
            });
            const formJson = Object.fromEntries((formData as any).entries());
            console.log(formJson)
            const result = await UploadPost(formData);
            navigate('/me/my-timeshares')
        }
        catch (error: any) {
            enqueueSnackbar(`${error.message}`, { variant: "error" });
            setUploading(false);
        }
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
    React.useEffect(() => {
        const fetchRemainingUploads = async () => {
            try {
                const userId = user?._id;
                const count = await CountUploadTimeshareByUser(userId);
                setRemainingUploads(count);
            } catch (error) {
                console.error('Error fetching remaining uploads:', error);
            }
        };

        fetchRemainingUploads();

        return () => {
        };
    }, [user?._id]);
    
    const servicePackId = user && user.servicePack ? user.servicePack._id : null;
    const totalUploads = user && user.servicePack ? user.servicePack.numberPosts : null;

    let remaining;

    if (totalUploads !== null) {
        remaining = totalUploads - remainingUploads;
    } else {
        remaining = servicePackId !== null ? 'Unlimited' : 0;
    }

    return (
        <Box sx={{  flex: 1, width: '100%' }}>
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
                        <Typography level="title-md">Post a timeshare</Typography>
                        <Typography level="body-sm">
                            Let people enjoy at your resort and more.
                        </Typography>
                        <Typography level="body-sm">
                            Remaining Uploads: {remaining.toString()} 
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
                                        <ResortInput />
                                        <FormLabel sx={{ mt: 2 }}>Type</FormLabel>
                                        <Select defaultValue="rental" name="type" size='sm'>
                                            <Option value="rental">Rental</Option>
                                            <Option value="exchange">Exchange</Option>
                                        </Select>
                                        <input type='hidden' name='current_owner' value={user?._id}></input>
                                        <Stack direction="row" spacing={4} sx={{ width: '100%', mt: 2 }}>
                                            <FormControl sx={{ display: 'inline', gap: 1 }}>
                                                <FormLabel>Start date</FormLabel>
                                                <Input
                                                    type="date"
                                                    size="sm"
                                                    placeholder="Start date"
                                                    name="start_date"
                                                    value={startDate}
                                                    sx={{}}
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
                                                    value={endDate}
                                                    sx={{}}
                                                    onChange={handleEndDateChange}
                                                />
                                            </FormControl>
                                        </Stack>
                                        <FormLabel sx={{ mt: 2 }}>Add image</FormLabel>
                                        <Input
                                            size="sm"
                                            type="file"
                                            slotProps={{
                                                input: {
                                                    accept: "image/*",
                                                }
                                            }}
                                            placeholder="Image"
                                            onChange={(e) => {
                                                const files = e?.target?.files;
                                                if (files) {
                                                    if (imageFiles.length < 5) {
                                                        setImageFiles((prev) => [...prev, ...Array.from(files)]);
                                                    }
                                                    else enqueueSnackbar(`You can only upload up to five images!`, { variant: "error" });
                                                }
                                            }}
                                        />
                                        {imageFiles?.length !== 0 && (
                                            <Box sx={{ display: 'flex', width: 1, flexWrap: 'wrap', mt: 2 }}>
                                                {imageFiles.map(function (url, imageIndex) {
                                                    return (<div style={{ position: "relative" }}>
                                                        <img src={URL.createObjectURL(url)} alt="Pasted Image" height={90} style={{ borderRadius: "5px", margin: '2px' }} />
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
                                            type="number"
                                            size="sm"
                                            placeholder="Total cost"
                                            name="price"
                                            value={price}
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
            <Stack
                spacing={4}
                sx={{
                    display: 'flex',
                    maxWidth: 'calc(50% - 20px)',
                    // mx: 'auto',
                    px: { xs: 2, md: 6 },
                    py: { xs: 2, md: 3 },
                    marginLeft: 'auto',
                    
                }}
            >
            </Stack>
        </Box>
    );
}
