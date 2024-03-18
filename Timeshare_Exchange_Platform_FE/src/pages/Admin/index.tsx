import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from '../../components/Admin/Sidebar';
import Header from '../../components/Profile/Header';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../features/auth/auth.slice';
import AccountManagement from '../../components/Account';
import RequestManagement from '../../components/Request';
import ResortManagement from '../../components/Resort';
import userEvent from '@testing-library/user-event';
import ResortList from '../../components/Resort/ResortList';
import CreateResort from '../../components/Resort/CreateResort';
import PaymentDashboard from '../../components/Payment';

export default function JoyOrderDashboardTemplate() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state?.auth?.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAuthLoaded = useSelector((state: RootState) => state.auth.isLoaded);
  React.useEffect(() => {
    console.log("account role:" + user?.role);
    if (isAuthLoaded) {
      if(!isAuthenticated){
        navigate('/login');
      }else if(user?.role !== "admin"){
        navigate('/login');
      }
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
                pb: { xs: 2, sm: 2, md: 3 },
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
                    <Route path="/account-list/*" element={<AccountManagement />} />
                    <Route path="/request-list/*" element={<RequestManagement />} />
                    <Route path="/resort-list/" element={<ResortManagement/>} />
                    <Route path="/resort-list/create" element={<CreateResort/>} />
                    <Route path="/payment-list" element={<PaymentDashboard/>}/>
                </Route>
              </Routes>
            </Box>
          </Box>
        </CssVarsProvider>}
    </>
  );
}
