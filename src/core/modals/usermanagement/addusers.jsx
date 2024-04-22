/* eslint-disable react/prop-types */
import { PlusCircle } from "feather-icons-react/build/IconComponents";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { apiUrl } from "../../json/api";
import Loader_2 from "../../../feature-module/loader-2/loader-2";
import X from "feather-icons-react/build/IconComponents/X";
import ImageWithBasePath from "../../img/imagewithbasebath";
import { toast } from "react-toastify";

const AddUsers = ({ mode, record, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    userId: 0,
    username: "",
    mobileNo: "",
    emailId: "",
    pwd: "",
    desc: "",
    roleId: 0,
    base64: "",
    deactivate: 0,
  });
  const location = useLocation();
  const [passwordinput, setPasswordInput] = useState({
    password: "",
    confirmPassword: "",
    errorMsg: "",
  });
  const [roleOpt, setRoleOpt] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "add") {
      clearInputField();
      GetOnRoleMaster(`${apiUrl}/GetUserRoleMasters/${1}`);
    } else if (mode === "modify" && record) {
      clearInputField();
      GetOnRoleMaster(`${apiUrl}/GetUserRoleMasters/${1}`);
      getformData(`${apiUrl}/GetUserMasterDetails/${1}?userId=${record.id}`);
    }
  }, [mode, record]);

  const getformData = async (url) => {
    try {
      setIsLoading(true);
      const resp = await fetch(url);
      const json = await resp.json();
      const result = json.data;
      // console.log("result", result);
      //set form fields
      setFormData({
        userId: result[0].userId,
        username: result[0].username,
        mobileNo: result[0].mobileNo,
        emailId: result[0].emailId,
        pwd: result[0].pwd,
        desc: result[0].desc,
        roleId: result[0].roleId,
        base64: result[0].image,
        deactivate: parseInt(result[0].active === 1 ? 0 : 1),
      });
      setPasswordInput({
        password: result[0].pwd,
        confirmPassword: result[0].pwd,
      });
      setSelectedOption({
        value: result[0].roleId,
        label: result[0].roleName,
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const GetOnRoleMaster = async (url) => {
    try {
      setIsLoading(true);
      const resp = await fetch(url);
      const { data } = await resp.json();
      const lidtdata = data.map((item) => ({
        value: item.roleId,
        label: item.name,
      }));
      setRoleOpt(lidtdata);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function (e) {
        const bs64 = e.target.result;
        const fileName = file.name;
        const [name, extension] = fileName.split(".");
        setFormData((prevformdata) => ({
          ...prevformdata,
          base64: bs64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordInput({ ...passwordinput, [e.target.name]: e.target.value });
  };

  const handleValidatePassword = () => {
    if (passwordinput.password !== passwordinput.confirmPassword) {
      setPasswordInput((prevpassword) => ({
        ...prevpassword,
        errorMsg:
          "Confirm Passworrd do not match, Please provide a valid Passworrd",
      }));
      return false;
    } else {
      setPasswordInput((prevpassword) => ({ ...prevpassword, errorMsg: "" }));
      return true;
    }
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormData((prevformdata) => ({
      ...prevformdata,
      roleId: selectedOption.value,
    }));
  };

  const handleRemoveSelectedImages = () => {
    document.getElementById("upload-images").value = null;
    setFormData((prevFormData) => ({ ...prevFormData, base64: "" }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!handleValidatePassword()) return;
      const ValidData = { ...formData, pwd: passwordinput.password };
      const resp = await fetch(`${apiUrl}/SaveUserMastersDetails`, {
        method: "POST",
        headers: {
          "content-type": "Application/json",
        },
        body: JSON.stringify(ValidData),
      });
      const data = await resp.json();
      if (data.status == 1) {
        clearInputField();
        onSubmitSuccess();
        toast.success(data.msg);
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearInputField = () => {
    setFormData({
      userId: 0,
      username: "",
      mobileNo: "",
      emailId: "",
      pwd: "",
      desc: "",
      roleId: 0,
      base64: "",
      deactivate: 0,
    });
    setPasswordInput({ password: "", confirmPassword: "", errorMsg: "" });
    // setRoleOpt([]);
    setSelectedOption(null);
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPassword = () => {
    setConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      {/* Add User */}
      <div className="modal modal-lg fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                {isLoading && <Loader_2 />}
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>{mode === "add" ? "Add User" : "Edit User"}</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form action="#" onSubmit={onSubmitForm}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="new-employee-field">
                          <span>Avatar</span>
                          <div className="add-choosen ">
                            <div className="profile-pic-upload mb-2">
                              <div className="phone-img1 profile-pic">
                                {formData.base64.length == 0 ? (
                                  <span>
                                    <PlusCircle className="plus-down-add" />
                                    Profile Photo
                                  </span>
                                ) : (
                                  <>
                                    <img
                                      src={formData?.base64}
                                      alt="Profile Photo"
                                    />
                                    <Link to="#">
                                      <X
                                        className="remove-product"
                                        onClick={handleRemoveSelectedImages}
                                      />
                                    </Link>
                                  </>
                                )}
                              </div>
                              <div className="input-blocks mb-0">
                                <div className="image-upload mb-0">
                                  <input
                                    type="file"
                                    id="upload-images"
                                    accept=".png, .jpg, .jpeg"
                                    onChange={handleSelectImageFile}
                                  />
                                  <div className="image-uploads">
                                    <h4>
                                      {formData.base64.length
                                        ? "Change Image"
                                        : "Upload Image"}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* </div> */}
                            {/* <div
                            id="collapseThree"
                            className="accordion-collapse collapse show"
                            aria-labelledby="headingThree"
                            data-bs-parent="#accordionExample3"
                          >
                            <div className="accordion-body">
                              <div className="text-editor add-list add">
                                <div className="col-lg-12">
                                  <div className="add-choosen">
                                    <div className="input-blocks">
                                      <div className="image-upload">
                                        <input type="file" />
                                        <div className="image-uploads">
                                          <PlusCircle className="plus-down-add me-0" />
                                          <h4>Add Images</h4>
                                        </div>
                                      </div>
                                    </div>
                                    {isImageVisible1 && (
                                      <div className="phone-img">
                                        <ImageWithBasePath
                                          src="assets/img/products/phone-add-2.png"
                                          alt="image"
                                        />
                                        <Link to="#">
                                          <X
                                            className="x-square-add remove-product"
                                            // onClick={handleRemoveProduct1}
                                          />
                                        </Link>
                                      </div>
                                    )}
                                    {isImageVisible && (
                                      <div className="phone-img">
                                        <ImageWithBasePath
                                          src="assets/img/products/phone-add-1.png"
                                          alt="image"
                                        />
                                        <Link to="#">
                                          <X
                                            className="x-square-add remove-product"
                                            // onClick={handleRemoveProduct}
                                          />
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Name</label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            className={`${
                              formData.username ? "is-valid" : "is-invalid"
                            } form-control`}
                            onChange={handleInputChange}
                            required
                          />
                          <div className="invalid-feedback">
                            Please provide a valid User Name.
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Phone</label>
                          <input
                            type="text"
                            name="mobileNo"
                            value={formData.mobileNo}
                            className={`${
                              formData.mobileNo ? "is-valid" : "is-invalid"
                            } form-control`}
                            onChange={handleInputChange}
                            required
                          />
                          <div className="invalid-feedback">
                            Please provide a valid Phone.
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Email</label>
                          <input
                            type="email"
                            name="emailId"
                            value={formData.emailId}
                            className={`${
                              formData.emailId ? "is-valid" : "is-invalid"
                            } form-control`}
                            onChange={handleInputChange}
                            placeholder="example@gmail.com"
                            required
                          />
                          <div className="invalid-feedback">
                            Please provide a valid Email.
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Role</label>
                          <Select
                            className={`${
                              formData.roleId ? "is-valid" : "is-invalid"
                            } select`}
                            value={selectedOption}
                            onChange={handleSelectChange}
                            options={roleOpt}
                            placeholder="Choose Status"
                            required
                          />
                          <div className="invalid-feedback">
                            Please provide a valid Role.
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Password</label>
                          <div className="pass-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`${
                                passwordinput.password
                                  ? "is-valid"
                                  : "is-invalid"
                              } pass-input`}
                              placeholder="Enter your password"
                              name="password"
                              value={passwordinput.password}
                              onChange={handlePasswordChange}
                              required
                            />
                            <span
                              className={`fas toggle-password ${
                                showPassword ? "fa-eye" : "fa-eye-slash"
                              }`}
                              onClick={handleTogglePassword}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Confirm Passworrd</label>
                          <div className="pass-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className={`${
                                passwordinput.confirmPassword
                                  ? `${
                                      passwordinput.errorMsg
                                        ? "is-invalid"
                                        : "is-valid"
                                    }`
                                  : "is-invalid"
                              } pass-input`}
                              placeholder="Enter your password"
                              name="confirmPassword"
                              value={passwordinput.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                            <span
                              className={`fas toggle-password ${
                                showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                              }`}
                              onClick={handleToggleConfirmPassword}
                            />
                            <div className="invalid-feedback">
                              {passwordinput.errorMsg}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-0 input-blocks">
                          <label className="form-label">Descriptions</label>
                          <textarea
                            className="form-control mb-1"
                            placeholder="Type Message"
                            name="desc"
                            value={formData.desc}
                            onChange={handleInputChange}
                          />
                          <p>Maximum 600 Characters</p>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add User */}
    </div>
  );
};

export default AddUsers;
