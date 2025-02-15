// /* eslint-disable react/prop-types */
// import React, { useEffect, useState } from "react";
// import Loader_2 from "../../../../feature-module/loader-2/loader-2";
// import { DatePicker } from "antd";
// import moment from "moment";
// import { toast } from "react-toastify";
// import { Modal } from "bootstrap";

// const AcceptItemsWiseOpenModal = ({ visible, rowData, onSave, onCancel }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [show, setShow] = useState(false);
//   const [input, setInput] = useState({
//     mrp_date: null,
//     purc_date: null,
//     prod_date: null,
//     deli_date: null,
//     remarks: "",
//     person: "",
//   });

//   const [selectedDates, setSelectedDates] = useState({
//     mrp_date: null,
//     purc_date: null,
//     prod_date: null,
//     deli_date: null,
//   });

//   const handleSelectedDateChange = (date, dateName, dateString) => {
//     setSelectedDates((prevdate) => ({
//       ...prevdate,
//       [dateName]: date,
//     }));

//     setInput({
//       ...input,
//       [dateName]: date ? moment(dateString).format("DD-MM-YYYY") : null, // Format the date if it's not null,
//     });
//   };

//   const handleInputChange = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };

//   const form_Validate = () => {
//     if (input.mrp_date === null) {
//       toast.error("Please select mrp date");
//       return false;
//     }
//     if (input.purc_date === null) {
//       toast.error("Please select purchase date");
//       return false;
//     }
//     if (input.prod === null) {
//       toast.error("Please select production date");
//       return false;
//     }
//     if (input.deli_date === null) {
//       toast.error("Please select delivery date");
//     }
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form_Validate()) return;

//     setShow((previousValue) => {
//       previousValue = true;
//       return previousValue;
//     });
//     onSave(input);
//   };

//   return (
//     <>
//       <div
//         className="modal fade"
//         id="accept-modal"
//         tabIndex="-1"
//         role="dialog"
//         aria-labelledby="create"
//       >
//         <div className="modal-dialog modal-dialog-centered custom-modal-two">
//           <div className="modal-content">
//             <div className="page-wrapper-new p-0">
//               <div className="content">
//                 {isLoading && <Loader_2 />}
//                 <div className="modal-header border-0 custom-modal-header">
//                   <div className="page-title">
//                     <h4>Order Received Approval</h4>
//                   </div>
//                   <button
//                     type="button"
//                     className="close"
//                     data-bs-dismiss="modal"
//                     aria-label="Close"
//                   >
//                     <span aria-hidden="true">×</span>
//                   </button>
//                 </div>
//                 <div className="modal-body custom-modal-body ">
//                   <form onSubmit={handleSubmit}>
//                     <div className="row">
//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label className="form-label">MRP Date</label>
//                           <div className="input-groupicon calender-input">
//                             <DatePicker
//                               value={selectedDates.mrp_date}
//                               selected={selectedDates.mrp_date}
//                               onChange={(date, dateString) =>
//                                 handleSelectedDateChange(
//                                   date,
//                                   "mrp_date",
//                                   dateString
//                                 )
//                               }
//                               type="date"
//                               className="form-control filterdatepicker"
//                               placeholder="Date"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label className="form-label">Purchase Date</label>
//                           <div className="input-groupicon calender-input">
//                             <DatePicker
//                               value={selectedDates.purc_date}
//                               selected={selectedDates.purc_date}
//                               onChange={(date, dateString) =>
//                                 handleSelectedDateChange(
//                                   date,
//                                   "purc_date",
//                                   dateString
//                                 )
//                               }
//                               type="date"
//                               className="form-control filterdatepicker"
//                               placeholder="Date"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label className="form-label">Production Date</label>
//                           <div className="input-groupicon calender-input">
//                             <DatePicker
//                               value={selectedDates.prod_date}
//                               selected={selectedDates.prod_date}
//                               onChange={(date, dateString) =>
//                                 handleSelectedDateChange(
//                                   date,
//                                   "prod_date",
//                                   dateString
//                                 )
//                               }
//                               type="date"
//                               className="form-control filterdatepicker"
//                               placeholder="Date"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="col-lg-6">
//                         <div className="mb-3">
//                           <label className="form-label">Delivery Date</label>
//                           <div className="input-groupicon calender-input">
//                             <DatePicker
//                               value={selectedDates.deli_date}
//                               selected={selectedDates.deli_date}
//                               onChange={(date, dateString) =>
//                                 handleSelectedDateChange(
//                                   date,
//                                   "deli_date",
//                                   dateString
//                                 )
//                               }
//                               type="date"
//                               className="form-control filterdatepicker"
//                               placeholder="Date"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="col-lg-12">
//                       <div className="mb-3 input-blocks">
//                         <label className="form-label">Remarks</label>
//                         <textarea
//                           type="text"
//                           className="form-control"
//                           name="remarks"
//                           value={input.remarks}
//                           onChange={handleInputChange}
//                           placeholder="Type Message"
//                           required
//                         />
//                         <p className="red">Maximum 100 Characters</p>
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Responeble Person</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           name="person"
//                           value={input.person}
//                           onChange={handleInputChange}
//                           placeholder="Person Name"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="modal-footer-btn">
//                       <button
//                         type="button"
//                         className="btn btn-cancel me-2"
//                         data-bs-dismiss="modal"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         id="raja"
//                         type="submit"
//                         className="btn btn-submit"
//                         // data-bs-target="#exampleModal"
//                         onClick={() => {
//                           if (show) {
//                             document
//                               .getElementById("raja")
//                               .setAttribute("data-bs-dismiss", "modal");
//                           }
//                         }}
//                       >
//                         Save
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AcceptItemsWiseOpenModal;
