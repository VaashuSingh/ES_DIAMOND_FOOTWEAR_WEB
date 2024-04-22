import React, { useState } from "react";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { apiUrl } from "../../../core/json/api";
import Loader_2 from "../../loader-2/loader-2";
import logo from "../../../core/assets/img/logo.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [signin, setSignIn] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const route = all_routes;
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputChange = (event) => {
    setSignIn({ ...signin, [event.target.name]: event.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loading) {
      try {
        setLoading(true);
        let url = `${apiUrl}/ValidateUser`;
        const resp = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signin),
        });
        const data = await resp.json();
        const token = data.token;

        // Store the token securely (e.g., in local storage)
        sessionStorage.setItem("token", token);
        if (data.status === 1 && data.msg === "Valid") {
          sessionStorage.setItem("users", JSON.stringify(data.data));
          // console.log("Ram ji", sessionStorage.getItem("token"));
          navigate(route.dashboard);
          // window.location.href = "/dashboard";
        } else {
          toast.warning(`${data.msg}`);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && <Loader_2 />}
      <div className="main-wrapper">
        <div className="account-content">
          <div className="login-wrapper bg-img">
            {/* <img className="bg-img" src={mountain} alt="img" /> */}
            <div className="login-content">
              <form onSubmit={handleLogin}>
                <div className="login-userset">
                  <div className="login-logo logo-normal">
                    {/* <ImageWithBasePath src="assets/img/logo.png" alt="img" /> */}
                    <img src={logo} alt="img" />
                  </div>
                  <Link to={route?.signin} className="login-logo logo-white">
                    <ImageWithBasePath src="assets/img/lo.go-white.png" alt />
                  </Link>
                  <div className="login-userheading">
                    <h3>Sign In</h3>
                    <h4>
                      Access the Dreamspos panel using your email and passcode.
                    </h4>
                  </div>
                  <div className="form-login mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="form-addons">
                      <input
                        type="text"
                        className={`form-control ${
                          !signin.username ? "is-invalid" : ""
                        }`}
                        name="username"
                        value={signin.username}
                        autoComplete="username"
                        autoCapitalize="off"
                        onChange={handleInputChange}
                        placeholder="Enter Your Email"
                        required
                      />
                      <img
                        src="assets/img/icons/mail.svg"
                        alt="img"
                        style={{ right: signin.username ? "18px" : "35px" }}
                      />
                    </div>
                  </div>
                  <div className="form-login mb-3">
                    <label className="form-label">Password</label>
                    <div className="pass-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`pass-input form-control ${
                          !signin.password ? "is-invalid" : ""
                        }`}
                        name="password"
                        value={signin.password}
                        autoComplete="current-password"
                        onChange={handleInputChange}
                        placeholder="Enter Password"
                        required
                      />
                      <span
                        className={`fas toggle-password  ${
                          showPassword ? "fa-eye" : "fa-eye-slash"
                        }`}
                        style={{ right: signin?.password ? "10px" : "28px" }}
                        onClick={handleTogglePassword}
                      />
                    </div>
                  </div>
                  <div className="form-login authentication-check">
                    <div className="row">
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <div className="custom-control custom-checkbox">
                          <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                            <input type="checkbox" className="form-control" />
                            <span className="checkmarks" />
                            Remember me
                          </label>
                        </div>
                        <div className="text-end">
                          <Link
                            className="forgot-link"
                            to={route.forgotPassword}
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-login">
                    <button className="btn btn-login" type="submit">
                      Sign In
                    </button>
                    {/* <Link to={route.dashboard} className="btn btn-login">
                    Sign In
                  </Link> */}
                  </div>
                  {/* <div className="signinform">
                  <h4>
                    New on our platform?
                    <Link to={route.register} className="hover-a">
                      {" "}
                      Create an account
                    </Link>
                  </h4>
                </div>
                <div className="form-setlogin or-text">
                  <h4>OR</h4>
                </div> */}
                  <div className="form-sociallink">
                    {/* <ul className="d-flex">
                    <li>
                      <Link to="#" className="facebook-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/facebook-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/icons/google.png"
                          alt="Google"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="apple-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/apple-logo.svg"
                          alt="Apple"
                        />
                      </Link>
                    </li>
                  </ul> */}
                    <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                      <p>
                        Copyright © 2024 Diamond Footwear. All rights reserved
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
