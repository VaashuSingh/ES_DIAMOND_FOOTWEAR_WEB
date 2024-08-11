import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../InitialPage/Sidebar/Header";
import Sidebar from "../InitialPage/Sidebar/Sidebar";
import { pagesRoute, posRoutes, publicRoutes } from "./router.link";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeSettings from "../InitialPage/themeSettings";
// import CollapsedSidebar from "../InitialPage/Sidebar/collapsedSidebar";
import Loader from "../feature-module/loader/loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoute } from "./privateRoute";
import TaxReport from "../feature-module/Reports/taxreport";

// import HorizontalSidebar from "../InitialPage/Sidebar/horizontalSidebar";
//import LoadingSpinner from "../InitialPage/Sidebar/LoadingSpinner";

const AllRoutes = () => {
  const isHeaderCollapsed = useSelector((state) => state.toggle_header);

  // const layoutStyles = useSelector((state) => state.layoutstyledata);

  const HeaderLayout = () => (
    <div
      className={`main-wrapper ${isHeaderCollapsed ? "header-collapse" : ""}`}
    >
      <Header />
      <Sidebar />
      <Outlet />
      <ThemeSettings />
      {/* <Loader /> */}
    </div>
  );

  const Authpages = () => (
    <div className={isHeaderCollapsed ? "header-collapse" : ""}>
      <Outlet />
      {/* <Loader /> */}
      <ThemeSettings />
    </div>
  );

  const Pospages = () => (
    <div>
      <Header />
      <Outlet />
      {/* <Loader /> */}
      <ThemeSettings />
    </div>
  );

  return (
    <div>
      <Routes>
        <Route path="/pos" element={<Pospages />}>
          {posRoutes.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>
        <Route
          path="/"
          element={
            <PrivateRoute>
              {" "}
              <HeaderLayout />{" "}
            </PrivateRoute>
          }
        >
          {publicRoutes.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>
        <Route path="/" element={<Authpages />}>
          {pagesRoute.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>
        <Route path="*" element={<TaxReport />} /> {/* Wildcard route */}
      </Routes>
      <ToastContainer />
    </div>
  );
};
export default AllRoutes;
