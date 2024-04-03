/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { ChevronUp, RotateCcw } from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import {
  Filter,
  PlusCircle,
  Sliders,
  StopCircle,
  User,
  Zap,
} from "react-feather";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import AddUsers from "../../core/modals/usermanagement/addusers";
import EditUser from "../../core/modals/usermanagement/edituser";
import { apiUrl } from "../../core/json/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader_2 from "../loader-2/loader-2";
import No_Images from "../../core/assets/img/no-img.png";

const Users = () => {
  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const users = [
    { value: "Choose Name", label: "Choose Name" },
    { value: "Lilly", label: "Lilly" },
    { value: "Benjamin", label: "Benjamin" },
  ];
  const status = [
    { value: "Choose Name", label: "Choose Status" },
    { value: "Active", label: "Active" },
    { value: "InActive", label: "InActive" },
  ];
  const role = [
    { value: "Choose Role", label: "Choose Role" },
    { value: "AcStore Keeper", label: "Store Keeper" },
    { value: "Salesman", label: "Salesman" },
  ];

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add"); // add or edit mode
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  // const dataSource = useSelector((state) => state.userlist_data);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      render: (text, record) => (
        <span className="userimgname">
          <Link to="#" className="userslist-img bg-img h-auto">
            <img src={record.img ? record.img : No_Images} alt="User Image" />
          </Link>
          <div>
            <Link to="#">{text}</Link>
          </div>
        </span>
      ),
      sorter: (a, b) => a.username.length - b.username.length,
    },

    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: "Created On",
      dataIndex: "createdon",
      sorter: (a, b) => a.createdon.length - b.createdon.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          <span
            className={`badge ${
              record.status === 1 ? "badge-linesuccess" : "badge-linedanger"
            }`}
          >
            {record.status === 1 ? "Active" : "Deactive"}
          </span>
        </>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <td className="action-table-data">
          <div className="edit-delete-action">
            {/* <Link className="me-2 p-2" to="#">
              <i
                data-feather="eye"
                className="feather feather-eye action-eye"
              />
            </Link> */}
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add-units"
              onClick={() => OnRowClickEditUser(record)}
            >
              <i data-feather="edit" className="feather-edit" />
            </Link>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={showConfirmationAlert}
            >
              <i data-feather="trash-2" className="feather-trash-2" />
            </Link>
          </div>
        </td>
      ),
    },
  ];

  useEffect(() => {
    getTableData(`${apiUrl}/GetUserMasterDetails/${1}`);
  }, []);

  const getTableData = async (url) => {
    try {
      setLoading(true);
      const resp = await fetch(url);
      const json = await resp.json();
      const data = json.data;
      const tableList = data.map((item) => ({
        id: item.userId,
        img: item.image,
        username: item.username,
        phone: item.mobileNo,
        email: item.emailId,
        role: item.roleName,
        createdon: item.createdOn,
        status: item.active,
      }));
      setTableData(tableList);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const OnRowClickEditUser = (record) => {
    setMode("modify");
    setSelectedRecord(record);
  };

  const handleModalOpen = () => {
    setSelectedRecord(null);
    setMode("add");
  };

  const handleSubmitSuccess = () => {
    getTableData(`${apiUrl}/GetUserMasterDetails/${1}`);
    setSelectedRecord(null);
  };

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          className: "btn btn-success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        MySwal.close();
      }
    });
  };
  return (
    <div>
      {loading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>User List</h4>
                <h6>Manage Your Users</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link>
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <i data-feather="printer" className="feather-printer" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <RotateCcw />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    className={data ? "active" : ""}
                    onClick={() => {
                      dispatch(setToogleHeader(!data));
                    }}
                  >
                    <ChevronUp />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#add-units"
                onClick={handleModalOpen}
              >
                <PlusCircle className="me-2" />
                Add New User
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="Search"
                      className="form-control form-control-sm formsearch"
                    />
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
                {/* <div className="search-path">
                  <Link
                    className={`btn btn-filter ${
                      isFilterVisible ? "setclose" : ""
                    }`}
                    id="filter_search"
                  >
                    <Filter
                      className="filter-icon"
                      onClick={toggleFilterVisibility}
                    />
                    <span onClick={toggleFilterVisibility}>
                      <ImageWithBasePath
                        src="assets/img/icons/closes.svg"
                        alt="img"
                      />
                    </span>
                  </Link>
                </div>
                <div className="form-sort">
                  <Sliders className="info-img" />
                  <Select
                    className="select"
                    options={oldandlatestvalue}
                    placeholder="Newest"
                  />
                </div> */}
              </div>
              {/* /Filter */}
              <div
                className={`card${isFilterVisible ? " visible" : ""}`}
                id="filter_inputs"
                style={{ display: isFilterVisible ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <User className="info-img" />
                        <Select
                          className="select"
                          options={users}
                          placeholder="Newest"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <StopCircle className="info-img" />

                        <Select
                          className="select"
                          options={status}
                          placeholder="Choose Status"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <Zap className="info-img" />

                        <Select
                          className="select"
                          options={role}
                          placeholder="Choose Role"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <a className="btn btn-filters ms-auto">
                          {" "}
                          <i
                            data-feather="search"
                            className="feather-search"
                          />{" "}
                          Search{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={tableData}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <AddUsers
        mode={mode}
        record={selectedRecord}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
};

export default Users;
