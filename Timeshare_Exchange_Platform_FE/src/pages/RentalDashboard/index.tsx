import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import NavBar from '../../components/Rental/NavBar';
import RentalCard from '../../components/Rental/RentalCard';
import HeaderSection from '../../components/Rental/HeaderSection';
import Search from '../../components/Rental/Search';
import Filters from '../../components/Rental/Filters';
import Pagination from '../../components/Rental/Pagination';
import { GetResort } from '../../services/resort.service';
import { GetPost } from '../../services/post.service';
import { NavLink, useNavigate } from 'react-router-dom';
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
  is_bookable: boolean;
}

export default function RentalDashboard() {
  const [postList, setPostList] = React.useState([]);
  const navigate = useNavigate()
  React.useEffect(() => {
    Load()
  }, [])
  async function Load() {
    const list = await GetPost();
    if (list) {
      console.log(list)
      setPostList(list)
    }
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <NavBar />
      <Box
        component="main"
        sx={{
          height: 'calc(100vh - 55px)', // 55px is the height of the NavBar
          display: 'grid',
          gridTemplateColumns: { xs: 'auto', md: '60% 40%' },
          gridTemplateRows: 'auto 1fr auto',
        }}
      >
        <Stack
          sx={{
            backgroundColor: 'background.surface',
            px: { xs: 2, md: 4 },
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <HeaderSection />
          <Search />
        </Stack>
        <Box
          sx={{
            gridRow: 'span 2',
            display: { xs: 'none', md: 'flex' },
            backgroundColor: 'background.level1',
            backgroundSize: 'cover',
            backgroundImage:
              'url("https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3731&q=80")',
          }}
        />
        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
          <Filters />
          <Stack spacing={2} sx={{ overflow: 'auto' }}>
            {postList?.map((item: any, i) => {
              return (
                <RentalCard
                  postId={item?._id}
                  title={item?.resortId?.name || "Default Name"}
                  category={item?.unitId?.name}
                  price = {item?.price}
                  image={item?.images[0]}
                  location={item?.resortId?.location}
                  start_date={item?.start_date}
                  end_date={item?.end_date}
                  pricePerNight={item?.pricePerNight}
                  numberOfNights={item?.numberOfNights}
                  is_bookable={item?.is_bookable}
                />              
              )})}
          </Stack>
          <Pagination />
        </Stack>


      </Box>
    </CssVarsProvider>
  );
}