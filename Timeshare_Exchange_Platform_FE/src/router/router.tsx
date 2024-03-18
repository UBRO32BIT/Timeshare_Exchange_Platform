import { Routes, Route } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './routes';
function Router() {
  return (
    <Routes>
        <Route>
            {/* {privateRoutes.map((route, index) => {
        const Page = route.page;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              isAuthenticated === true ? (
                <Page />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        );
      })} */}
      {publicRoutes.map((route, index) => {
        const Page = route.page;
        return (
          <Route
            key={index}
            path={route.path}
            element={<Page />}
          />
        );
      })}
        </Route>
      
    </Routes>
  )
}

export default Router