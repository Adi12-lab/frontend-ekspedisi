import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy, createContext, useState, useEffect } from "react";

import { UserContextType, UserAuth } from "./types";
import Sidebar from "./components/layout/Sidebar";
import Loader from "./components/ui/loader";
import { lookInSession } from "./actions/session";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Gudang = lazy(() => import("./pages/Gudang"));
const Pengirim = lazy(() => import("./pages/Pengirim"));
const Pengiriman = lazy(() => import("./pages/Pengiriman"));
const TrackPengiriman = lazy(() => import("./pages/TrackPengiriman"));
const DetailPengiriman = lazy(() => import("./pages/DetailPengiriman"));
const DetailPengirimanSearch = lazy(()=> import("./pages/DetailPengirimanSearch"))

export const UserContext = createContext<UserContextType>({
  userAuth: {
    accessToken: "",
    role: "",
    email: "",
    username: "",
  },
  setUserAuth: () => {},
});

function App() {
  const [userAuth, setUserAuth] = useState<UserAuth>({
    accessToken: "",
    role: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    const userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ accessToken: "", role: "", email: "", username: "" });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <Suspense>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense>
                <Register />
              </Suspense>
            }
          />
          <Route path="/" element={<Wrapper />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<Loader />}>
                  <Home />
                </Suspense>
              }
            />

            <Route
              path="gudang"
              element={
                <Suspense fallback={<Loader />}>
                  <Gudang />
                </Suspense>
              }
            />
            <Route
              path="pengirim"
              element={
                <Suspense fallback={<Loader />}>
                  <Pengirim />
                </Suspense>
              }
            />
            <Route
              path="pengiriman"
              element={
                <Suspense fallback={<Loader />}>
                  <Pengiriman />
                </Suspense>
              }
            />
            <Route
              path="lacak"
              element={
                <Suspense fallback={<Loader />}>
                  <DetailPengirimanSearch />
                </Suspense>
              }
            />
            <Route
              path="pengiriman/:resi/track"
              element={
                <Suspense fallback={<Loader />}>
                  <TrackPengiriman />
                </Suspense>
              }
            />
            <Route
              path="pengiriman/:resi/details"
              element={
                <Suspense fallback={<Loader />}>
                  <DetailPengiriman />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

function Wrapper() {
  return (
    <>
      <Sidebar />
      <div className="container w-4/5 float-right mt-12">
        <Outlet />
      </div>
    </>
  );
}

export default App;
