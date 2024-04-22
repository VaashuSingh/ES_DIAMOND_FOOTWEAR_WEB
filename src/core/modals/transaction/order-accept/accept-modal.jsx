/* eslint-disable react/prop-types */
import { DatePicker } from "antd";
import moment from "moment";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const Accept_Modal = ({ show, onHide, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState({
    mrp_date: null,
    purc_date: null,
    prod_date: null,
    deli_date: null,
    remarks: "",
    person: "",
  });

  const [selectedDates, setSelectedDates] = useState({
    mrp_date: null,
    purc_date: null,
    prod_date: null,
    deli_date: null,
  });

  const handleSelectedDateChange = (date, dateName, dateString) => {
    setSelectedDates((prevdate) => ({
      ...prevdate,
      [dateName]: date,
    }));

    setInput({
      ...input,
      [dateName]: date ? moment(dateString).format("DD-MM-YYYY") : null, // Format the date if it's not null,
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
      remarks: "",
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
        toast.warning(`Please select ${dateKey.replace("_", " ")} date`);
        return;
      }
    }

    console.log("input", input);
    onSave(input);
    handleClearFormInput();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={handleModalClose}>
          <Modal.Title id="contained-modal-title-vcenter">
            Order Accept Approvel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {content} */}
          <div key={document.id} className="tile">
            <div className="custom-file-container">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">MRP Date</label>
                      <div className="input-groupicon calender-input">
                        <DatePicker
                          value={selectedDates.mrp_date}
                          selected={selectedDates.mrp_date}
                          onChange={(date, dateString) =>
                            handleSelectedDateChange(
                              date,
                              "mrp_date",
                              dateString
                            )
                          }
                          type="date"
                          className="form-control filterdatepicker"
                          placeholder="Date"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Purchase Date</label>
                      <div className="input-groupicon calender-input">
                        <DatePicker
                          value={selectedDates.purc_date}
                          selected={selectedDates.purc_date}
                          onChange={(date, dateString) =>
                            handleSelectedDateChange(
                              date,
                              "purc_date",
                              dateString
                            )
                          }
                          type="date"
                          className="form-control filterdatepicker"
                          placeholder="Date"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Production Date</label>
                      <div className="input-groupicon calender-input">
                        <DatePicker
                          value={selectedDates.prod_date}
                          selected={selectedDates.prod_date}
                          onChange={(date, dateString) =>
                            handleSelectedDateChange(
                              date,
                              "prod_date",
                              dateString
                            )
                          }
                          type="date"
                          className="form-control filterdatepicker"
                          placeholder="Date"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Delivery Date</label>
                      <div className="input-groupicon calender-input">
                        <DatePicker
                          value={selectedDates.deli_date}
                          selected={selectedDates.deli_date}
                          onChange={(date, dateString) =>
                            handleSelectedDateChange(
                              date,
                              "deli_date",
                              dateString
                            )
                          }
                          type="date"
                          className="form-control filterdatepicker"
                          placeholder="Date"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="mb-3 input-blocks">
                    <label className="form-label">Remarks</label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="remarks"
                      value={input.remarks}
                      onChange={handleInputChange}
                      placeholder="Type Message"
                      required
                    />
                    <p className="red">Maximum 100 Characters</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Responeble Person</label>
                    <input
                      type="text"
                      className="form-control"
                      name="person"
                      value={input.person}
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
    </>
  );
};

export default Accept_Modal;
