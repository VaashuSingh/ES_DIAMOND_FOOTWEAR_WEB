/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const PrivateRoute = (props) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const { children } = props;

  // if (!sessionStorage.getItem("token"))
  //   return <Navigate replace={true} to="/signin" />;

  const isLoggedIn = sessionStorage.getItem("token") !== null;

  // console.log("gdgdgd", `${location.pathname}${location.search}`);

  // useEffect(() => {
  //   console.log("Private pathname", location.pathname);
  //   console.log("Private search", location.search);

  //   if (!isLoggedIn && location.pathname !== "/signin") {
  //     window.alert("You must log in first!");
  //     return <Navigate replace={true} to="/signin" />;
  //   } else if (isLoggedIn && location.pathname === "/signin") {
  //     return <Navigate replace={true} to="/signin" />;
  //   }
  // }, [location]);

  // const isLoggedIn = localStorage.getItem("userData") !== null;
  // console.log("isLoggedIn", isLoggedIn);

  // const isAuthenticated = () => {
  //   return new Promise((resolve) => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       resolve(false); // No token found, user is not authenticated
  //     }
  //     // Decode the token (assuming it's a JWT) to check its validity
  //     try {
  //       const decodedToken = jwtDecode(token);
  //       const currentTime = Date.now() / 1000; // Current time in seconds
  //       resolve(decodedToken.exp > currentTime);
  //     } catch (error) {
  //       resolve(false); // Error occurred, user is not authenticated
  //     }
  //   });
  // };

  // useEffect(() => {
  //   checkAuthentication();
  // }, []);

  // const checkAuthentication = async () => {
  //   try {
  //     const authenticated = await isAuthenticated();
  //     console.log("Authentication status:", authenticated);
  //     setIsLoggedIn(authenticated);
  //   } catch (error) {
  //     console.error("Error checking authentication:", error);
  //   }
  // };

  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     try {
  //       const authenticated = await isAuthenticated();
  //       console.log("Authentication status:", authenticated);
  //       const isLoged = authenticated;
  //       console.log("Private Route Loged : ", isLoged);
  //       setIsLoggedIn(isLoged);
  //     } catch (error) {
  //       console.error("Error checking authentication:", error);
  //     }
  //   };

  //   checkAuthentication();
  // }, []); // Empty dependency array to run only once on mount

  // console.log("from", { from: `${location.pathname}${location.search}` });

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/signin"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  );
};
