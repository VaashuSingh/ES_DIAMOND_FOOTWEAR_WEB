/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../json/api";
import { toast } from "react-toastify";
import Loader_2 from "../../../feature-module/loader-2/loader-2";

const AddRole = ({ mode, record, onSubmitSuccess }) => {
  const [input, setInput] = useState({ id: 0, name: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data if the component is mounted and there's a record passed down
  useEffect(() => {
    if (mode === "add") {
      setInput({ id: 0, name: "" });
    } else if (mode === "modify" && record) {
      setInput({ id: record.id, name: record.rolename });
    }
  }, [mode, record]);

  // Submit the form data using fetch request
  const handleChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/SaveUserRoleMaster`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (data.status === 1) {
        setInput({ id: 0, name: "" });
        toast.success(data.msg);
        onSubmitSuccess();
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Add Role */}
      <div className="modal fade" id="add-units" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                {isLoading && <Loader_2 />}
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>{mode === "add" ? "Create Role" : "Edit Role"}</h4>
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
                  <form onSubmit={handleSubmit}>
                    <div className="mb-0">
                      <label className="form-label">Role Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={input.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-submit"
                      >
                        {mode === "add" ? "Create Role" : "Update Role"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Role */}
    </div>
  );
};

export default AddRole;
