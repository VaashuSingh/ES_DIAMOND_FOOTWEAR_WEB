/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import {
  cancelCallback,
  getfilteredData,
  showConfirmationAlert,
} from "../../core/json/functions";
import { all_routes } from "../../Router/all_routes";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add"); // add or edit mode
  const [tableData, setTableData] = useState([]);
  // const data = useSelector((state) => state.toggle_header);
  // const dataSource = useSelector((state) => state.userlist_data);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTable, setSearchTable] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state?.permissions?.right4 === 0) {
      setTimeout(
        () => navigate(all_routes.accessDeniedRoute, { replace: true }),
        500
      );
    }
  }, [state, navigate]);

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      render: (text, record) => (
        <span className="userimgname">
          <a className="userslist-img bg-img h-auto">
            <img src={record.img ? record.img : No_Images} alt="User Image" />
          </a>
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
        <div className="action-table-data-new">
          <div className="edit-delete-action">
            {state?.permissions?.right2 !== 0 && (
              <Link
                className="me-2 p-2"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#add-units"
                onClick={() => OnRowClickEditUser(record)}
              >
                <i data-feather="edit" className="feather-edit" />
              </Link>
            )}
            {state?.permissions?.right3 !== 0 && (
              <Link
                className="confirm-text p-2"
                to="#"
                onClick={() => handleDeleteRecord(record?.id)}
              >
                <i data-feather="trash-2" className="feather-trash-2" />
              </Link>
            )}
          </div>
        </div>
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
      const result = await resp.json();
      // console.log("result", result);
      const tableList = result.data.map((item) => ({
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

  const handleDeleteRecord = (userId) => {
    const deleteRecord = async () => {
      try {
        setLoading(true);
        const resp = await fetch(
          `${apiUrl}/DeleteMasters/2/1/${parseInt(userId)}`
        );
        const json = await resp.json();
        if (json.status === 1) {
          handleRefresh();
          toast.success(json?.msg, { position: "top-center" });
        } else {
          toast.warning(json?.msg, { position: "top-center" });
        }
      } catch (err) {
        toast.error(err.message, { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    showConfirmationAlert(
      "do you want to delete in this user",
      deleteRecord,
      cancelCallback
    );
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
            {state?.permissions?.right1 !== 0 && (
              <TableHeadButton
                title={`Add New User`}
                target={`add-units`}
                handleModalOpen={handleModalOpen}
              />
            )}
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <TableDataSearch
                    onSearch={(e) =>
                      setSearchTable(getfilteredData(e, tableData))
                    }
                  />
                </div>
              </div>
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
