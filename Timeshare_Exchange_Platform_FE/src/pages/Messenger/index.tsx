import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from '../../components/Messenger/Sidebar';
import Header from '../../components/Messenger/Header';
import MyMessages from '../../components/Messenger/MyMessages';

export default function MessengerPage() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', p: 0}}>
        {/*<Sidebar />*/}
        <Header />
        <Box sx={{ flex: 1, height: '100vh', overflow: 'hidden',  p: 0, m: 0,  }}>
          <MyMessages />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
