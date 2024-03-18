import React from 'react';
import logo from './logo.svg';
import './App.css';
import RentalDashboard from './pages/RentalDashboard';
import Router from './router/router';
import { Loaded, LoginSuccess } from './features/auth/auth.slice';
import { useSelector, useDispatch } from 'react-redux'
import { api } from './api';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { RootState } from './features/auth/auth.slice';
import {
  createSessionCookies,
  getRefreshToken,
  getToken,
  removeSessionCookies
} from './utils/tokenCookies'
import { SnackbarOrigin, SnackbarProvider, useSnackbar } from 'notistack';


function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = React.useState<boolean | null>(null);
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();
  const checkAuth = async () => {
    try {
      if (getToken()) {
        const response = await api.patch('/auth/isAuth');
        if (response.data) {
          const loginData = response.data.data;
          dispatch(LoginSuccess(loginData));
        }
      }
      dispatch(Loaded());
    }
    catch (error) {
      enqueueSnackbar(`Error while fetching user: ${error}`, { variant: "error" });
    }
  }
  type AnchorOrigin = SnackbarOrigin;
  const customAnchorOrigin: AnchorOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
  };
  React.useEffect(() => {
    console.log("hello");
    checkAuth();
  }, []);
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3} anchorOrigin={customAnchorOrigin}>
        <Router />
      </SnackbarProvider>
    </div>
  );
}

export default App;


// import {BrowserRouter, Routes, Route, Navigate, useNavigate} from "react-router-dom";
// import React, {useEffect, useState} from "react";
// import {publicRoutes, privateRoutes} from './router/routes';
// import './App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(true);
//
//   return (
//     <div className="App">
//       <Routes>
//         <Route>
//           {privateRoutes.map((route, index) => {
//             const Page = route.page;
//             return (
//               <Route
//                 key={index}
//                 path={route.path}
//                 element={
//                   isAuthenticated ? (
//                     <Page/>
//                   ) : (
//                     <Navigate to="/login" />
//                   )
//                 }
//               />
//             )
//           })}
//           {publicRoutes.map((route, index) => {
//             const Page = route.page;
//             return (
//               <Route
//                 key={index}
//                 path={route.path}
//                 element={<Page />}
//               />
//             )
//           })}
//         </Route>
//       </Routes>
//     </div>
//
//   );
// }
//
// export default App;


