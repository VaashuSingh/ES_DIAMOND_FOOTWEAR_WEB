import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiUrl } from "../../core/json/api";
import Loader_2 from "../loader-2/loader-2";

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    email: "",
    mobile: "",
    username: "",
    pwd: "",
    img: "",
  });

  const userdet = JSON.parse(sessionStorage.getItem("users"));

  useEffect(() => {
    getUserDetails(
      `${apiUrl}/GetUserMasterDetails/1?UserId=${userdet?.userId}`
    );
  }, []);

  const getUserDetails = async (url) => {
    try {
      setIsLoading(true);
      const resp = await fetch(url);
      const json = await resp.json();
      if (!json.status == 1) throw new Error(await json.msg);
      // console.log("data", json.data[0]);
      setUserData({
        name: json.data[0].username,
        role: json.data[0].roleName,
        email: json.data[0].emailId,
        mobile: `+91 ${json.data[0].mobileNo}`,
        // username: userdet.username,
        pwd: json.data[0].pwd,
        img: json.data[0].image,
      });
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {isLoading && <Loader_2 />}
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Profile</h4>
            <h6>User Profile</h6>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <div className="profile-set">
              <div className="profile-head"></div>
              <div className="profile-top">
                <div className="profile-content">
                  <div className="profile-contentimg">
                    <div className="avatar avatar-xxxxl m-0">
                      <img
                        className="avatar-img rounded-circle"
                        src={
                          userData?.img || "assets/img/customer/customer5.jpg"
                        }
                        alt="img"
                        id="blah"
                      />
                      {/* <div className="profileupload">
                      <input type="file" id="imgInp" />
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/icons/edit-set.svg"
                          alt="img"
                        />
                      </Link>
                    </div> */}
                    </div>
                  </div>
                  <div className="profile-contentname">
                    <h2>{userData?.name}</h2>
                    <h4>Your Photo and Personal Details.</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={userData?.name}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    name="role"
                    defaultValue={userData?.role}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    defaultValue={userData?.email}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    name="mobile"
                    defaultValue={userData?.mobile}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    defaultValue={userData?.name}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="pass-input form-control"
                      name="pwd"
                      defaultValue={userData?.pwd}
                      readOnly
                    />
                    <span
                      className={`fas toggle-password ${
                        showPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="col-12">
               <Link to="#" className="btn btn-submit me-2">
                  Submit
                </Link>
               <Link to="#" className="btn btn-cancel">
                  Cancel
                </Link>
              </div> */}
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default Profile;
