/* eslint-disable react/prop-types */
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { dateFormat } from "../../../json/api";
dayjs.extend(customParseFormat);

const Modal_Accept = ({ show, onHide, onSave, selectItems, modalData }) => {
  const [input, setInput] = useState({
    mrp_date: null,
    purc_date: null,
    prod_date: null,
    deli_date: null,
    remark: "",
    person: "",
  });

  const [selectedDates, setSelectedDates] = useState({
    mrp_date: null,
    purc_date: null,
    prod_date: null,
    deli_date: null,
  });

  const labelMap = {
    mrp_date: "MRP Date",
    purc_date: "Purchase Date",
    prod_date: "Production Date",
    deli_date: "Delivery Date",
  };

  useEffect(() => {
    setSelectedDates({
      mrp_date: modalData?.data?.mrp_date,
      purc_date: modalData?.data?.purc_date,
      prod_date: modalData?.data?.prod_date,
      deli_date: modalData?.data?.deli_date,
    });

    setInput({
      mrp_date: modalData?.data?.mrp_date,
      purc_date: modalData?.data?.purc_date,
      prod_date: modalData?.data?.prod_date,
      deli_date: modalData?.data?.deli_date,
      remark: modalData?.data?.remark,
      person: modalData?.data?.person,
    });
  }, [modalData]);

  const handleSelectedDateChange = (date, dateName, dateString) => {
    // console.log("dateString", dateString);
    setSelectedDates((prevdate) => ({
      ...prevdate,
      [dateName]: date,
    }));

    setInput({
      ...input,
      [dateName]: dateString || null, //date ? dayjs(date).format(dateFormat) : null, //date ? moment(dateString).format(dateFormat) : null, // Use moment(date) instead of moment(dateString)
    });
  };

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    handleClearFormInput();
    onHide();
  };

  const handleClearFormInput = () => {
    setInput({
      mrp_date: null,
      purc_date: null,
      prod_date: null,
      deli_date: null,
      remark: "",
      person: "",
    });

    setSelectedDates({
      mrp_date: null,
      purc_date: null,
      prod_date: null,
      deli_date: null,
    });
  };

  const form_Validate = () => {
    if (input.mrp_date === null) {
      toast.error("Please select mrp date");
      return false;
    }
    if (input.purc_date === null) {
      toast.error("Please select purchase date");
      return false;
    }
    if (input.prod === null) {
      toast.error("Please select production date");
      return false;
    }
    if (input.deli_date === null) {
      toast.error("Please select delivery date");
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!form_Validate()) return;
    for (const dateKey in selectedDates) {
      if (!selectedDates[dateKey]) {
        toast.warning(`Please select ${dateKey.replace("_", " ")}`);
        return;
      }
    }

    // console.log("input", input);
    onSave(input);
    handleClearFormInput();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ zIndex: 1050 }}
    >
      <Modal.Header closeButton onClick={handleModalClose}>
        <Modal.Title id="contained-modal-title-vcenter">
          Order Accept Approvel
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {content} */}
        <div>
          <h6 className="d-flex bg-soft-dark justify-content-center align-items-center">
            {`Item Name : ${selectItems?.itemname || "Not Found"}`}
          </h6>
        </div>
        <hr />
        <div key={document.id} className="tile">
          <div className="custom-file-container">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {Object.entries(selectedDates).map(([dateName, date]) => (
                  <div key={dateName} className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">{labelMap[dateName]}</label>
                      <div className="input-groupicon calender-input">
                        <DatePicker
                          value={date ? dayjs(date, dateFormat) : null}
                          selected={date}
                          onChange={(date, dateString) =>
                            handleSelectedDateChange(date, dateName, dateString)
                          }
                          className="form-control filterdatepicker"
                          format={dateFormat}
                          placeholder="Date"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-lg-12">
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
                <div className="mb-3">
                  <label className="form-label">Responsible Person</label>
                  <input
                    type="text"
                    className="form-control"
                    name="person"
                    value={input.person || ""}
                    onChange={handleInputChange}
                    placeholder="Person Name"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer-btn">
                <button
                  type="button"
                  className="btn btn-cancel me-2"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-submit">
                  Approved
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
          <Button onClick={onHide}>Save Documents</Button>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer> */}
    </Modal>
  );
};

export default Modal_Accept;
