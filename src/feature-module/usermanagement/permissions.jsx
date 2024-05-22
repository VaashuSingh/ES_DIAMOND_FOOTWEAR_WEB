import React, { useEffect, useState } from "react";
import {
  GoBackToPage,
  PageTopHeaderLeft,
  TableDataSearch,
} from "../../core/reusable_components/table/tables";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader_2 from "../loader-2/loader-2";
import { apiUrl } from "../../core/json/api";
import { searchingHandler } from "../../core/json/functions";

const Permissions = () => {
  const navigate = useNavigate();
  const location = useLocation()
  console.log('location',location)
  const [isLoading, setIsLoading] = useState(false);
  const [permissionData, setPermissionData] = useState([]);
  const { state } = useLocation();
  const roleId = state?.record?.id;

  useEffect(() => {
    getuserRolePermission(
      `${apiUrl}/GetUserRolePermissionMenu/${parseInt(roleId)}`
    );
  }, [roleId]);

  // Fetch data from the API
  const getuserRolePermission = async (url) => {
    try {
      setIsLoading(true);
      const resp = await fetch(url);
      const result = await resp.json();
      // console.log("result", result);
      setPermissionData(result?.data); // Set fetched data to state
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { title: "Module" },
    { title: "Create" },
    { title: "Edit" },
    { title: "Delete" },
    { title: "View" },
  ];

  const prepare_form_Data = (data) => {
    const newData = {
      roleId: roleId,
      permissionData: data?.map((item) => {
        const { menu, ...rest } = item;
        return rest;
      }),
    };
    return newData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/SaveUserRolePermissionResponse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prepare_form_Data(permissionData)),
      });
      const result = await resp.json();
      // console.log("resp", result);
      toast.success(result.msg, { position: "top-center" });
      if (result.status === 1) navigate(-1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (menuId, field) => {
    setPermissionData((prevData) =>
      prevData.map((item) =>
        item.menuId === menuId
          ? { ...item, [field]: !item[field] ? 1 : 0 }
          : item
      )
    );
  };

  const handleSelectAllCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setPermissionData((prevData) =>
      prevData.map((item) => ({
        ...item,
        create: isChecked ? 1 : 0,
        edit: isChecked ? 1 : 0,
        delete: isChecked ? 1 : 0,
        view: isChecked ? 1 : 0,
      }))
    );
  };

  const handleRowCheckboxChange = (menuId, isChecked) => {
    setPermissionData((prevData) =>
      prevData.map((item) =>
        item.menuId === menuId
          ? {
              ...item,
              create: isChecked ? 1 : 0,
              edit: isChecked ? 1 : 0,
              delete: isChecked ? 1 : 0,
              view: isChecked ? 1 : 0,
            }
          : item
      )
    );
  };

  return (
    <>
      {isLoading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <PageTopHeaderLeft
              title={`Permission`}
              subTitle={`Manage your permissions`}
            />
            <GoBackToPage title={"To Role"} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card table-list-card">
              <div className="card-body">
                <div className="table-responsive" style={{ borderTop: "none" }}>
                  <table className="table datanew">
                    <thead>
                      <tr>
                        <th className="no-sort">
                          <label className="checkboxs">
                            <input
                              type="checkbox"
                              id="select-all"
                              onChange={handleSelectAllCheckboxChange}
                            />
                            <span className="checkmarks" />
                          </label>
                        </th>
                        {columns.map((column, index) => (
                          <th key={index}>{column.title}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {permissionData.map((item) => (
                        <tr key={item.menuId}>
                          <td>
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={
                                  item.create &&
                                  item.edit &&
                                  item.delete &&
                                  item.view
                                }
                                onChange={(e) =>
                                  handleRowCheckboxChange(
                                    item.menuId,
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="checkmarks" />
                            </label>
                          </td>
                          <td>{item.menu}</td>
                          <td>
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={item.create}
                                onChange={() =>
                                  handleCheckboxChange(item.menuId, "create")
                                }
                              />
                              <span className="checkmarks" />
                            </label>
                          </td>
                          <td>
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={item.edit}
                                onChange={() =>
                                  handleCheckboxChange(item.menuId, "edit")
                                }
                              />
                              <span className="checkmarks" />
                            </label>
                          </td>
                          <td>
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={item.delete}
                                onChange={() =>
                                  handleCheckboxChange(item.menuId, "delete")
                                }
                              />
                              <span className="checkmarks" />
                            </label>
                          </td>
                          <td>
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={item.view}
                                onChange={() =>
                                  handleCheckboxChange(item.menuId, "view")
                                }
                              />
                              <span className="checkmarks" />
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="btn-addproduct mb-4">
                <button
                  type="button"
                  className="btn btn-cancel me-2"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-submit"
                  disabled={isLoading}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Permissions;
