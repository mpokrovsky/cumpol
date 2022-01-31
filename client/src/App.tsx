import { Grid } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/Topics';
import Auth from './pages/Auth';
import { AuthProvider, RequireAuth } from './providers/AuthProvider';

// TODO: themes
// ffffff-00fff6-1ba5ab-364b60
// ffbda0-ffa780-ff7b40-ff4f00-ff0000-c00000-800000-400000-200000

const App: FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainPage />
              </RequireAuth>
            }
          >
            <Route
              index
              element={
                <h1>
                  select or create
                  <br /> a new Space 🔮
                </h1>
              }
            />
            <Route path=":spaceId" element={<MainContent />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

const Layout: FC = () => {
  return (
    <Grid templateRows="auto 1fr" gap={6} p={7} position="relative" h="100vh">
      <Header />
      <Outlet />
    </Grid>
  );
};

const MainPage: FC = () => {
  return (
    <Grid templateColumns="auto 1fr" gap={6} h="82vh" overflow="auto">
      <Sidebar />
      <Outlet />
    </Grid>
  );
};

export default App;
