import * as React from 'react';
import { Box, IconButton } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import ColorSchemeToggle from './ColorSchemeToggle';
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom';

interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: any;
  };
}
export default function HeaderSection() {
  const user = useSelector((state: RootState) => state?.auth?.user);
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        top: 0,
        px: 1.5,
        py: 1,
        zIndex: 10000,
        backgroundColor: 'background.body',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <IconButton size="sm" variant="soft">
          <MapsHomeWorkIcon />
        </IconButton>
        <Typography component="h1" fontWeight="xl">
          Timeshare rentals
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3,  }}>
        <Box
          sx={{
            gap: 1,
            alignItems: 'center',
            display: { xs: 'none', sm: 'flex' },
            ':hover':{opacity: 0.9, cursor: 'pointer'}
          }}
        >
          <Avatar
            variant="outlined"
            size="sm"
            src={user?.profilePicture}
          />
          <Box sx={{ minWidth: 0, flex: 1, }} onClick={()=>{navigate('/me/my-profile')}} >
            <Typography level="title-sm">{user?.username}</Typography>
            <Typography level="body-xs">{user?.email}</Typography>
          </Box>
        </Box>
        <ColorSchemeToggle sx={{ alignSelf: 'center' }} />
      </Box>
    </Box>
  );
}
