import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from '../../components/Profile/Sidebar';
import Header from '../../components/Profile/Header';
import MyProfile from '../../components/Profile/MyProfile';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import MyOrder from '../../components/Order/MyOrder';
import MyTrip from '../../components/Trip';
import MyMessage from '../../components/Messenger/MyMessages';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/auth/auth.slice';
import MyTimeshares from '../../components/Timeshare/MyTimeshares';

export default function JoyOrderDashboardTemplate() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAuthLoaded = useSelector((state: RootState) => state.auth.isLoaded);
  React.useEffect(() => {
    if (!isAuthenticated && isAuthLoaded) {
      navigate('/login');
    }
  }, [isAuthenticated, isAuthLoaded]);
  return (
    <>
      {isAuthenticated &&
        <CssVarsProvider disableTransitionOnChange>
          <CssBaseline />
          <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
            <Sidebar />
            <Header />
            <Box
              component="main"
              className="MainContent"
              sx={{
                pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
                // pb: { xs: 2, sm: 2, md: 3 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                height: '100dvh',
                gap: 1,
                overflow: 'auto',
              }}
            >
              <Routes>
                <Route>
                  <Route path="/" element={<MyProfile />} />
                  <Route path="/my-profile/*" element={<MyProfile />} />
                  <Route path="/my-timeshares/*" element={<MyTimeshares />} />
                  <Route path="/my-trips/*" element={<MyTrip />} />
                  <Route path="/my-orders/*" element={<MyOrder />} />
                  <Route path="/my-messages/*" element={<MyMessage />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </CssVarsProvider>}
    </>
  );
}
