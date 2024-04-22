import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import AddRole from "../../core/modals/usermanagement/addrole";
// import { all_routes } from "../../Router/all_routes";
import { apiUrl } from "../../core/json/api";
import { toast } from "react-toastify";
import Loader_2 from "../loader-2/loader-2";
import {
  TableTopHead,
  AddTableTopButton,
  TableDataSearch,
  PageTopHeaderLeft,
} from "../../core/reusable_components/table/TableHead";

const RolesPermissions = () => {
  // const route = all_routes;
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabledata, setTableData] = useState([]);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTable, setSearchTable] = useState(null);

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

  const handleRowDelete = async (roleId) => {
    setLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/DeleteMasters/${1}/${1}/${roleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      const json = await resp.json();
      // console.log("json", json);
      if (json.status === 1) handleRefresh();
      return json;
    } catch (err) {
      toast.error(String(err.message));
      return err;
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSelectedRecord(null);
    getTableData(`${apiUrl}/GetUserRoleMasters/${1}`);
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

  //Searching Input Box In Table
  const onSearchHandler = (value) => {
    const filteredData = tabledata.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setSearchTable(filteredData);
  };

  return (
    <div>
      {loading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            {/* Table top header component */}
            <PageTopHeaderLeft
              title={"Roles Permission"}
              subTitle={"Manage your roles"}
            />
            <TableTopHead onRefresh={handleRefresh} />
            <AddTableTopButton
              title={"Add New Role"}
              target={"add-units"}
              handleModalOpen={handleModalOpen}
            />
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <TableDataSearch onSearch={onSearchHandler} />
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
    </div>
  );
};

export default RolesPermissions;
