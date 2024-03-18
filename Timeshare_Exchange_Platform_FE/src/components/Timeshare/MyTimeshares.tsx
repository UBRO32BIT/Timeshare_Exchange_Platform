import * as React from 'react';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import TimeshareList from './TimeshareList';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { styled, Grid } from '@mui/joy';
import { useSelector } from 'react-redux';
import { UpdateUser } from '../../services/auth.service';
import { Routes, Route, Navigate, useNavigate, NavLink } from "react-router-dom";
import AddNewPost from './UploadTimeshare'
import ResortInput from './ResortInput';
import ManageTimeshares from './ManageTimeshares';
import UpdateTimeshare from './UpdateTimeshare';
import UploadTimeshare from './UploadTimeshare';
interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}
export default function MyTimeshares() {
    const [imageFiles, setImageFiles] = React.useState([]);
    const [imagePreview, setImagePreview] = React.useState([]);
    return (
        <Box sx={{ flex: 1, width: '100%' }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: { sm: -100, md: -110 },
                    bgcolor: 'background.body',
                    // zIndex: 9995,
                }}
            >
                <Box sx={{ px: { xs: 2, md: 6 } }}>
                    <Breadcrumbs
                        size="sm"
                        aria-label="breadcrumbs"
                        separator={<ChevronRightRoundedIcon />}
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
                            Users
                        </Link>
                        <Typography color="primary" fontWeight={500} fontSize={12}>
                            My timeshares
                        </Typography>
                    </Breadcrumbs>
                    <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
                        My timeshares
                    </Typography>
                </Box>
                <Tabs
                    defaultValue={0}
                    sx={{
                        bgcolor: 'transparent',
                    }}
                >
                    <TabList
                        tabFlex={1}
                        size="sm"
                        sx={{
                            pl: { xs: 0, md: 4 },
                            justifyContent: 'left',
                            [`&& .${tabClasses.root}`]: {
                                fontWeight: '600',
                                flex: 'initial',
                                color: 'text.tertiary',
                                [`&.${tabClasses.selected}`]: {
                                    bgcolor: 'transparent',
                                    color: 'text.primary',
                                    '&::after': {
                                        height: '2px',
                                        bgcolor: 'primary.500',
                                    },
                                },
                            },
                        }}
                    >
                        <NavLink to="/me/my-timeshares/timeshares-list" style={{ textDecoration: 'none' }}>
                            <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={0}>
                                My timeshares
                            </Tab>
                        </NavLink>
                        <NavLink to="/me/my-timeshares/upload-new-timeshare" style={{ textDecoration: 'none' }}>
                        <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={1}>
                            Upload new timeshare
                        </Tab>
                        </NavLink>
                    </TabList>
                </Tabs>
                <Routes>
                    <Route>
                        <Route path="/timeshares-list/:timeshareId" element={<ManageTimeshares />} />
                        <Route path="/timeshares-list" element={<TimeshareList />} />
                        <Route path="/" element={<TimeshareList />} />
                        <Route path="/update/:timeshareId" element={<UpdateTimeshare />} />
                        <Route path="/upload-new-timeshare" element={<UploadTimeshare />} />
                    </Route>
                </Routes>
            </Box>
        </Box>
    );
}
