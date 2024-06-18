/* eslint-disable react/prop-types */
import { PlusCircle } from "feather-icons-react/build/IconComponents";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { apiUrl } from "../../json/api";
import Loader_2 from "../../../feature-module/loader-2/loader-2";
import X from "feather-icons-react/build/IconComponents/X";
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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (mode === "add") {
      clearInputField();
      GetRoleMaster(`${apiUrl}/GetUserRoleMasters/${1}`);
    } else if (mode === "modify" && record) {
      clearInputField();
      GetRoleMaster(`${apiUrl}/GetUserRoleMasters/${1}`);
      getformData(`${apiUrl}/GetUserMasterDetails/${1}?userId=${record.id}`);
    }
  }, [mode, record]);

  const getformData = async (url) => {
    try {
      setIsLoading(true);
      const resp = await fetch(url);
      const result = await resp.json();
      setFormData({
        userId: result?.data[0].userId,
        username: result?.data[0].username,
        mobileNo: result?.data[0].mobileNo,
        emailId: result?.data[0].emailId,
        pwd: result?.data[0].pwd,
        desc: result?.data[0].desc,
        roleId: result?.data[0].roleId,
        base64: result?.data[0].image,
        deactivate: parseInt(result?.data[0].active === 1 ? 0 : 1),
      });
      setPasswordInput({
        password: result?.data[0].pwd,
        confirmPassword: result?.data[0].pwd,
      });
      setSelectedOption({
        value: result?.data[0].roleId,
        label: result?.data[0].roleName,
      });
      setIsSuperAdmin(parseInt(result?.data[0].superAdmin) === 1 ? true : false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const GetRoleMaster = async (url) => {
    try {
      setIsLoading(true);
      const resp = await fetch(url);
      const json = await resp.json();
      // console.log("json", json);
      const filteredData = json.data
        .filter((item) => item.admin === 0)
        .map((item) => ({
          value: item.roleId,
          label: item.name,
        }));
      setRoleOpt(filteredData);
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

  const handleFormSubmit = async (e) => {
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
    setSelectedOption(null);
    setIsSuperAdmin(false);
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
                  <form action="#" onSubmit={handleFormSubmit}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="new-employee-field">
                          <span>Avatar</span>
                          <div className="add-choosen ">
                            <div className="profile-pic-upload mb-2">
                              <div className="phone-img1 profile-pic">
                                {formData.base64.length === 0 ? (
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
                            disabled={isSuperAdmin}
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
                            isDisabled={isSuperAdmin}
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
                              disabled={isSuperAdmin}
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
                              disabled={isSuperAdmin}
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
