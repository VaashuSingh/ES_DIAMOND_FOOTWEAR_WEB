import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Table from "../../core/pagination/datatable";
import AddRole from "../../core/modals/usermanagement/addrole";
import { apiUrl } from "../../core/json/api";
import { toast } from "react-toastify";
import Loader_2 from "../loader-2/loader-2";
import {
  PageTopRight,
  TableHeadButton,
  TableDataSearch,
  PageTopHeaderLeft,
} from "../../core/reusable_components/table/tables";
import { all_routes } from "../../Router/all_routes";
import {
  getfilteredData,
  showConfirmationAlert,
  cancelCallback,
} from "../../core/json/functions";

const RolesPermissions = () => {
  const route = all_routes;
  const [loading, setLoading] = useState(false);
  const [tabledata, setTableData] = useState([]);
  const [mode, setMode] = useState("add");
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
        <div className="action-table-data-new">
          <div className="edit-delete-action">
            {state?.permissions?.right2 !== 0 && (
              <Link
                className="me-2 p-2"
                data-bs-toggle="modal"
                data-bs-target="#add-units"
                onClick={() => handleRowClick(record)}
              >
                <i data-feather="edit" className="feather-edit" />
              </Link>
            )}
            <Link
              className="me-2 p-2"
              to={route.permissions}
              state={{ record }}
            >
              <i
                data-feather="sheild"
                className="feather feather-shield shield"
              />
            </Link>
            {state?.permissions?.right3 !== 0 && (
              <Link
                className="confirm-text p-2"
                to="#"
                onClick={() => handleRecordDelete(record.id)}
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
    getTableData(`${apiUrl}/GetUserRoleMasters/${1}`);
  }, []);

  const getTableData = async (url) => {
    setLoading(true);
    try {
      const resp = await fetch(url);
      const json = await resp.json();
      // console.log("json", json);
      if (!json.status) throw new Error(json.msg);
      const formattedData = json.data.map((item) => ({
        id: item.roleId,
        rolename: item.name,
        createdon: item.createdOn,
      }));
      setTableData(formattedData);
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

  const handleRecordDelete = (roleId) => {
    const deleteRecord = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${apiUrl}/DeleteMasters/${1}/${1}/${roleId}`);
        const json = await resp.json();
        // console.log("json", json);
        if (json.status === 1) {
          handleRefresh();
          toast.success(json?.msg, { position: "top-center" });
        } else {
          toast.warning(json?.msg, { position: "top-center" });
        }
      } catch (err) {
        toast.error(String(err.message), { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    showConfirmationAlert(
      "do you want to delete in this role master",
      deleteRecord,
      cancelCallback
    );
  };

  const handleRefresh = () => {
    setSelectedRecord(null);
    getTableData(`${apiUrl}/GetUserRoleMasters/${1}`);
  };

  return (
    <>
      {loading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            {/* Table top header component */}
            <PageTopHeaderLeft
              title={"Roles Permission"}
              subTitle={"Manage your roles"}
            />
            {/* <PageTopRight onRefresh={handleRefresh} /> */}
            {state?.permissions.right1 !== 0 && (
              <TableHeadButton
                title={"Add New Role"}
                target={"add-units"}
                handleModalOpen={handleModalOpen}
              />
            )}
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <TableDataSearch
                  onSearch={(e) =>
                    setSearchTable(getfilteredData(e, tabledata))
                  }
                />
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={searchTable || tabledata}
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
        onSubmitSuccess={handleRefresh}
      />
    </>
  );
};

export default RolesPermissions;
