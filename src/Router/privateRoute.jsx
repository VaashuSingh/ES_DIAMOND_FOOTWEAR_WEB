/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const PrivateRoute = (props) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const { children } = props;

  if (!sessionStorage.getItem("token")) {
    return (
      <Navigate
        replace={true}
        to="/signin"
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
};
