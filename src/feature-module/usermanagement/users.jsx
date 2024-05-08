/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import AddUsers from "../../core/modals/usermanagement/addusers";
import { apiUrl } from "../../core/json/api";
import { toast } from "react-toastify";
import Loader_2 from "../loader-2/loader-2";
import No_Images from "../../core/assets/img/no-img.png";
import {
  TableHeadButton,
  TableDataSearch,
  PageTopRight,
  PageTopHeaderLeft,
} from "../../core/reusable_components/table/tables";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add"); // add or edit mode
  const [tableData, setTableData] = useState([]);
  const data = useSelector((state) => state.toggle_header);
  // const dataSource = useSelector((state) => state.userlist_data);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTable, setSearchTable] = useState(null);

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

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

  const handleRefresh = () => {
    getTableData(`${apiUrl}/GetUserMasterDetails/${1}`);
    setSelectedRecord(null);
  };

  const deleteRecord = async (userId) => {
    try {
      setLoading(true);
      let url = `${apiUrl}/DeleteMasters/2/1/${parseInt(userId)}`;
      const resp = await fetch(url);
      const json = await resp.json();
      console.log("json", json);
      if (!json?.status) throw new Error(json?.msg);
      else {
        handleRefresh();
      }
      return json;
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleRefresh = () => {
  //   setRefresh((prev) => !prev);
  // };

  //Searching Input Box In Table
  const onSearchHandler = (value) => {
    const filteredData = tableData.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setSearchTable(filteredData);
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
        const deleted = await deleteRecord(record.id);
        console.log("deleted", deleted);
        if (deleted?.status === 1) {
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
          MySwal.fire({
            title: "Not Deleted!",
            icon: "error",
            text: deleted?.msg || "Error : Data Not Deleted",
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

  return (
    <div>
      {loading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <PageTopHeaderLeft
              title={`User List`}
              subTitle={`Manage Your Users`}
            />
            {/* <PageTopRight onRefresh={handleRefresh} /> */}
            <TableHeadButton
              title={`Add New User`}
              target={`add-units`}
              handleModalOpen={handleModalOpen}
            />
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <TableDataSearch onSearch={onSearchHandler} />
                </div>
              </div>
              {/* /Filter */}
              <div
                className={`card${isFilterVisible ? " visible" : ""}`}
                id="filter_inputs"
                style={{ display: isFilterVisible ? "block" : "none" }}
              >
                {/* <div className="card-body pb-0">
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
                </div> */}
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={searchTable || tableData}
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
        onSubmitSuccess={handleRefresh}
      />
    </div>
  );
};

export default Users;
