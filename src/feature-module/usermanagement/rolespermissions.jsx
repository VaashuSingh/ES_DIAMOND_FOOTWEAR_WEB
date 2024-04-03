import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { ChevronUp, RotateCcw } from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import { Filter, PlusCircle, Sliders, Zap } from "react-feather";
import Select from "react-select";
import { DatePicker } from "antd";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import AddRole from "../../core/modals/usermanagement/addrole";
import EditRole from "../../core/modals/usermanagement/editrole";
import { all_routes } from "../../Router/all_routes";
import { apiUrl } from "../../core/json/api";
import { toast } from "react-toastify";
import Loader_2 from "../loader-2/loader-2";

// import { all_routes } from "../../Router/all_routes";

const RolesPermissions = () => {
  const route = all_routes;
  const data = useSelector((state) => state.toggle_header);
  const dataSource = useSelector((state) => state.rolesandpermission_data);

  const dispatch = useDispatch();
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [tabledata, setTableData] = useState([]);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns = [
    {
      title: "Role Name",
      dataIndex: "rolename",
      sorter: (a, b) => a.rolename.length - b.rolename.length,
    },
    {
      title: "Created On",
      dataIndex: "createdon",
      sorter: (a, b) => a.createdon.length - b.createdon.length,
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <td className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add-units"
              onClick={() => handleRowClick(record)}
            >
              <i data-feather="edit" className="feather-edit" />
            </Link>
            {/* <Link className="me-2 p-2" to={route.permissions}>
              <i
                data-feather="sheild"
                className="feather feather-shield shield"
              />
            </Link> */}
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(record)}
            >
              <i data-feather="trash-2" className="feather-trash-2" />
            </Link>
          </div>
        </td>
      ),
    },
  ];

  useEffect(() => {
    handleShowTableData(`${apiUrl}/GetUserRoleMasters/${1}`);
  }, []);

  const handleShowTableData = async (url) => {
    setLoading(true);
    try {
      const resp = await fetch(url);
      const { data } = await resp.json();
      if (data.length > 0) {
        const formattedData = data.map((item) => ({
          id: item.roleId,
          rolename: item.name,
          createdon: item.createdOn,
        }));
        setTableData(formattedData);
      } else {
        toast.error("No Data Found!");
      }
    } catch (err) {
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  };

  // Define a function to handle row click
  const handleRowClick = (record) => {
    setMode("modify"); // Set mode to modify when a row is clicked
    setSelectedRecord(record); // Set the selected record
  };

  const handleModalOpen = () => {
    setSelectedRecord(null);
    setMode("add");
  };

  const handleSubmitSuccess = () => {
    handleShowTableData(`${apiUrl}/GetUserRoleMasters/${1}`);
    setSelectedRecord(null);
  };

  const handleRowDelete = async (roleId) => {
    setLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/DeleteMasters/${1}/${1}/${roleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      const data = await resp.json();
      return data;
    } catch (err) {
      toast.error(String(err.message));
      return err;
    } finally {
      setLoading(false);
      handleShowTableData(`${apiUrl}/GetUserRoleMasters/${1}`);
    }
  };
  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (record) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deletionSuccess = await handleRowDelete(record.id);
        if (deletionSuccess.status == 1) {
          MySwal.fire({
            title: "Deleted!",
            text: "Your User Role has been deleted.",
            className: "btn btn-success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          MySwal.fire({
            title: "Not Deleted!",
            icon: "error",
            text: deletionSuccess.msg,
            className: "btn btn-error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-error",
            },
          });
        }
      } else {
        MySwal.close();
      }
    });
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  const role = [
    { value: "Choose Role", label: "ose Role" },
    { value: "AcStore ", label: "AcStore" },
    { value: "Admin", label: "Admin" },
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // const renderTooltip = (props) => (
  //   <Tooltip id="pdf-tooltip" {...props}>
  //     Pdf
  //   </Tooltip>
  // );

  // const renderExcelTooltip = (props) => (
  //   <Tooltip id="excel-tooltip" {...props}>
  //     Excel
  //   </Tooltip>
  // );

  // const renderPrinterTooltip = (props) => (
  //   <Tooltip id="printer-tooltip" {...props}>
  //     Printer
  //   </Tooltip>
  // );

  // const renderRefreshTooltip = (props) => (
  //   <Tooltip id="refresh-tooltip" {...props}>
  //     Refresh
  //   </Tooltip>
  // );

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  return (
    <div>
      {loading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Roles &amp; Permission</h4>
                <h6>Manage your roles</h6>
              </div>
            </div>
            {/* <ul className="table-top-head">
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
            </ul> */}
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#add-units"
                onClick={handleModalOpen}
              >
                <PlusCircle className="me-2" />
                Add New Role
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
                        <i data-feather="calendar" className="info-img" />
                        <div className="input-groupicon">
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            type="date"
                            className="filterdatepicker"
                            dateFormat="dd-MM-yyyy"
                            placeholder="Choose Date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
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
                  dataSource={tabledata}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <AddRole
        mode={mode}
        record={selectedRecord}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
};

export default RolesPermissions;
