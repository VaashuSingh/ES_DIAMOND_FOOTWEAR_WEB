/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import { apiUrl } from "../../../json/api";
import Loader_2 from "../../../../feature-module/loader-2/loader-2";

const Modal_Task_Approvel = ({ show, onHide, record, onSubmitSucces }) => {
  const [input, setInput] = useState({
    vchCode: 0,
    taskCode: 0,
    taskId: 0,
    status: 0,
    remark: "",
    users: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  // console.log("record", record);

  const options = [
    { value: 1, label: "Done" },
    { value: 2, label: "Hold" },
    { value: 3, label: "Cancel" },
  ];

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSelect = (selectedOption) => {
    setSelectedOption(selectedOption);
    // setInput({ ...input, status: selectedOption.value });
  };

  const form_Validate = () => {
    if (input.status === 0) {
      toast.error("Please select mrp date");
      return false;
    }
    if (input.remark === null) {
      toast.error("Please select purchase date");
      return false;
    }
    return true;
  };

  const handle_form_clear = () => {
    setInput({
      vchCode: 0,
      taskCode: 0,
      taskId: 0,
      status: 0,
      remark: "",
      users: "",
    });
    setSelectedOption(null);
  };

  const handle_from_data = () => {
    const users = JSON.parse(sessionStorage.getItem("users"));
    const formdata = {
      ...input,
      vchCode: parseInt(record?.vchCode),
      status: parseInt(selectedOption?.value),
      taskCode: parseInt(record?.taskCode),
      taskId: parseInt(record?.taskId),
      users: users?.name,
    };
    return formdata;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      if (!form_Validate) return;
      const resp = await fetch(`${apiUrl}/UpdateOrderTaskApproval`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(handle_from_data()),
      });
      const result = await resp.json();
      console.log("result", result);
      toast.success(result.msg);
      if (result.status === 1) {
        handle_form_clear();
        onHide();
        onSubmitSucces();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setisLoading(false);
    }
  };

  const handle_get_data = async (url) => {
    setisLoading(true);
    try {
      const resp = await fetch(url);
      const result = await resp.json();
      // console.log("result", result);
      if (result.status === 1) {
        setInput({ remark: result.data[0].remark });
        // console.log("result.data", result.data);
        setSelectedOption({
          value: result.data[0].action,
          label:
            result.data[0].action === 1
              ? "Done"
              : result.data[0].action === 2
              ? "Hold"
              : result.data[0].action === 2
              ? "Cancel"
              : "",
        });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    handle_form_clear();
    if (record && record !== null && record.status === 2) {
      const api = `${apiUrl}/GetOrderApprovelItemsHoldDetails/${record?.taskId}/${record?.taskCode}/${record?.vchCode}/${record?.itemCode}`;
      handle_get_data(api);
    }
  }, [record]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <>
        {isLoading && <Loader_2 />}
        <Modal.Header closeButton onClick={onHide}>
          <Modal.Title id="contained-modal-title-vcenter">
            Order Task Approvel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {content} */}
          <div key={document.id} className="tile">
            <div className="custom-file-container">
              <form onSubmit={handleOnSubmit}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3 input-blocks">
                      <label className="form-label">Action</label>
                      <Select
                        className="select"
                        value={selectedOption}
                        options={options}
                        onChange={handleSelect}
                        placeholder="Select Action"
                        required
                      />
                    </div>

                    <div className="mb-3 input-blocks">
                      <label className="form-label">Remark</label>
                      <textarea
                        type="text"
                        className="form-control"
                        name="remark"
                        value={input.remark}
                        onChange={handleInputChange}
                        placeholder="Type Message"
                        maxLength={200}
                        required
                      />
                      <p className="red">Maximum 200 Characters</p>
                    </div>
                  </div>

                  <div className="modal-footer-btn">
                    <button
                      type="button"
                      className="btn btn-cancel me-2"
                      onClick={onHide}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={isLoading}
                    >
                      Approved
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </>
    </Modal>
  );
};

export default Modal_Task_Approvel;
