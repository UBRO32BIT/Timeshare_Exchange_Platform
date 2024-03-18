import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { styled, Grid, TabPanel, Button, FormLabel, Input, CardOverflow, CardContent, Card, Divider, Stack, FormControl, CardActions, Textarea, Chip } from '@mui/joy';
import { Routes, Route, Navigate, useNavigate, NavLink } from "react-router-dom";
import { useSnackbar } from 'notistack';
import React from 'react';
import { Add } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Unit {
    name: string,
    sleeps: number,
    beds: number,
    bathrooms: number,
    kitchenType: string,
    features: string[],
}

export default function CreateResort() {
    const [facilities, setFacilities] = React.useState<string[]>([]);
    const [attractions, setAttractions] = React.useState<string[]>([]);
    const [policies, setPolicies] = React.useState<string[]>([]);
    const [images, setImages] = React.useState<string[]>([]);
    const [units, setUnits] = React.useState<Unit[]>([]);
    const [newFacility, setNewFacility] = React.useState<string>('');
    const [newAttraction, setNewAttraction] = React.useState<string>('');
    const [newPolicy, setNewPolicy] = React.useState<string>('');
    //const [imageFiles, setImageFiles] = React.useState<File[]>([]);
    const [uploading, setUploading] = React.useState<boolean>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const addAttraction = () => {
        console.log(newAttraction)
        if (newAttraction.trim() !== '') {
            setAttractions([...attractions, newAttraction]);
            setNewAttraction('');
        }
    }
    const deleteAttraction = (index: number) => {
        const updatedAttractions = [...attractions];
        updatedAttractions.splice(index, 1);
        setAttractions(updatedAttractions);
    }
    const addPolicy = () => {
        console.log(newPolicy)
        if (newPolicy.trim() !== '') {
            setPolicies([...policies, newPolicy]);
            setNewPolicy('');
        }
    }
    const deletePolicy = (index: number) => {
        const updatedPolicies = [...policies];
        updatedPolicies.splice(index, 1);
        setPolicies(updatedPolicies);
    }
    const addFacitity = () => {
        console.log(newFacility)
        if (newFacility.trim() !== '') {
            setFacilities([...facilities, newFacility]);
            setNewFacility('');
        }
    }
    const deleteFacility = (index: number) => {
        const updatedFacilities = [...facilities];
        updatedFacilities.splice(index, 1);
        setFacilities(updatedFacilities);
    }
    return (<>
        <Box sx={{ flex: 1, width: '100%', padding: '10px' }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: { sm: -100, md: -110 },
                    bgcolor: 'background.body',
                    // zIndex: 9995,
                }}
            >
                <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                    <Box
                        component="main"
                        className="MainContent"
                        sx={{
                            px: { xs: 2, md: 6 },
                            pt: {
                                xs: 'calc(12px + var(--Header-height))',
                                sm: 'calc(12px + var(--Header-height))',
                                md: 3,
                            },
                            pb: { xs: 2, sm: 2, md: 3 },
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 0,
                            height: '100dvh',
                            gap: 1,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Breadcrumbs
                                size="sm"
                                aria-label="breadcrumbs"
                                separator={<ChevronRightRoundedIcon fontSize='small' />}
                                sx={{ pl: 0 }}
                            >
                                <Link
                                    underline="none"
                                    color="neutral"
                                    href="#some-link"
                                    aria-label="Home"
                                >
                                    <HomeRoundedIcon />
                                </Link>
                                <Link
                                    underline="hover"
                                    color="neutral"
                                    href="#some-link"
                                    fontSize={12}
                                    fontWeight={500}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    underline="hover"
                                    color="neutral"
                                    href="#some-link"
                                    fontSize={12}
                                    fontWeight={500}
                                >
                                    Resorts
                                </Link>
                                <Typography color="primary" fontWeight={500} fontSize={12}>
                                    Create
                                </Typography>
                            </Breadcrumbs>
                        </Box>
                        <Box
                            sx={{
                                mb: 1,
                                gap: 1,
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'start', sm: 'center' },
                                flexWrap: 'wrap',
                            }}
                        >
                            <Typography level="h2" component="h1">
                                New resort
                            </Typography>
                        </Box>
                        <Card>
                            <Box sx={{ mb: 1 }}>
                                <Typography level="title-md">Create new resort</Typography>
                                <Typography level="body-sm">
                                    TAO LA SIEU PHAN DONG VO CUC.
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
                                            <form>
                                                <FormLabel sx={{ mt: 2 }}>Name</FormLabel>
                                                <Input
                                                    type="text"
                                                    size="sm"
                                                    placeholder="Name of the resort"
                                                    name="name"
                                                />
                                                <FormLabel sx={{ mt: 2 }}>Description</FormLabel>
                                                <Textarea
                                                    size="sm"
                                                    placeholder="Details of the resort"
                                                    name="descripiton"
                                                />
                                                <FormLabel sx={{ mt: 2 }}>Facilities</FormLabel>
                                                <Box sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                }}>
                                                    <Input
                                                        type="text"
                                                        size="sm"
                                                        placeholder="Facilities"
                                                        name="facilities"
                                                        value={newFacility}
                                                        onChange={(e: any) => setNewFacility(e.target.value)}
                                                    />
                                                    <Button variant="soft" size="sm" onClick={addFacitity}><Add /></Button>
                                                </Box>
                                                <Box sx={{
                                                    mt: 2
                                                }}>
                                                    {facilities && facilities.map && facilities.map((facility: string, index: number) => {
                                                        return (
                                                            <Box key={index}>
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    gap: 1,
                                                                    my: 1
                                                                }}>
                                                                    <Chip
                                                                        color="neutral"
                                                                        size="md"
                                                                        variant="soft"
                                                                    >
                                                                        {facility}
                                                                    </Chip>
                                                                    <Button size="sm" color='danger' variant='soft' onClick={() => deleteFacility(index)}><DeleteIcon/></Button>
                                                                </Box>
                                                            </Box>
                                                        )
                                                    })}
                                                </Box>
                                                <FormLabel sx={{ mt: 2 }}>Nearby Attractions</FormLabel>
                                                <Box sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                }}>
                                                    <Input
                                                        type="text"
                                                        size="sm"
                                                        placeholder="Nearby Acctractions"
                                                        name="attractions"
                                                        value={newAttraction}
                                                        onChange={(e: any) => setNewAttraction(e.target.value)}
                                                    />
                                                    <Button variant="soft" size="sm" onClick={addAttraction}><Add /></Button>
                                                </Box>
                                                <Box sx={{
                                                    mt: 2
                                                }}>
                                                    {attractions && attractions.map && attractions.map((attraction: string, index: number) => {
                                                        return (
                                                            <Box key={index}>
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    gap: 1,
                                                                    my: 1
                                                                }}>
                                                                    <Chip
                                                                        color="neutral"
                                                                        size="md"
                                                                        variant="soft"
                                                                    >
                                                                        {attraction}
                                                                    </Chip>
                                                                    <Button size="sm" color='danger' variant='soft' onClick={() => deleteAttraction(index)}><DeleteIcon/></Button>
                                                                </Box>
                                                            </Box>
                                                        )
                                                    })}
                                                </Box>
                                                <FormLabel sx={{ mt: 2 }}>Policies</FormLabel>
                                                <Box sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                }}>
                                                    <Input
                                                        type="text"
                                                        size="sm"
                                                        placeholder="Policies"
                                                        name="Policies"
                                                        value={newPolicy}
                                                        onChange={(e: any) => setNewPolicy(e.target.value)}
                                                    />
                                                    <Button variant="soft" size="sm" onClick={addPolicy}><Add /></Button>
                                                </Box>
                                                <Box sx={{
                                                    mt: 2
                                                }}>
                                                    {policies && policies.map && policies.map((policy: string, index: number) => {
                                                        return (
                                                            <Box key={index}>
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    gap: 1,
                                                                    my: 1
                                                                }}>
                                                                    <Chip
                                                                        color="neutral"
                                                                        size="md"
                                                                        variant="soft"
                                                                    >
                                                                        {policy}
                                                                    </Chip>
                                                                    <Button size="sm" color='danger' variant='soft' onClick={() => deletePolicy(index)}><DeleteIcon/></Button>
                                                                </Box>
                                                            </Box>
                                                        )
                                                    })}
                                                </Box>

                                                <FormLabel sx={{ mt: 2 }}>Add image</FormLabel>
                                                {/* <Input
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
                                                /> */}
                                                {/* {imageFiles?.length !== 0 && (
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
                                                    </Box>
                                                )} */}
                                                <FormLabel sx={{ mt: 2 }}>Price</FormLabel>
                                                <Input
                                                    type="text"
                                                    size="sm"
                                                    placeholder="Total cost"
                                                    name="price"
                                                />

                                                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2, }}>
                                                    <CardContent orientation="horizontal">
                                                        <div>
                                                            <Typography level="body-xs">Total price:</Typography>
                                                            <Typography fontSize="lg" fontWeight="lg">

                                                                $13131
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography level="body-xs">Number of nights:</Typography>
                                                            <Typography fontSize="lg" fontWeight="lg">
                                                                <input type='hidden'
                                                                    name='numberOfNights'
                                                                    value={131}
                                                                >
                                                                </input>
                                                                {131313}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography level="body-xs">Price per night:</Typography>
                                                            <Typography fontSize="lg" fontWeight="lg">
                                                                <input type='hidden'
                                                                    name='pricePerNight'
                                                                    value={413331}
                                                                ></input>
                                                                ${1413112}
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
                    </Box>
                </Box>
            </Box>
        </Box>
    </>
    );
}