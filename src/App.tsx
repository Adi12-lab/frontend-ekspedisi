import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import Sidebar from "./components/layout/Sidebar";
import Loader from "./components/ui/loader";
const Home = lazy(() => import("./pages/Home"));
const Gudang = lazy(() => import("./pages/Gudang"));
const Pengirim = lazy(() => import("./pages/Pengirim"));
const Pengiriman = lazy(() => import("./pages/Pengiriman"));
const DetailPengirimanEdit = lazy(() => import("./pages/DetailPengirimanEdit"));
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
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
                path="pengiriman/:resi"
                element={
                  <Suspense fallback={<Loader />}>
                    <DetailPengirimanEdit />
                  </Suspense>
                }
              />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
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
