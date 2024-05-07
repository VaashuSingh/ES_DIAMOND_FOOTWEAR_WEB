/* eslint-disable react/prop-types */
// import React, { useState } from "react";
// import { apiUrl } from "../../../json/api";
// import { toast } from "react-toastify";
// import Loader_2 from "../../../../feature-module/loader-2/loader-2";

// const OrderReceivedApproval = ({ record, onSubmitSuccess }) => {
//   const [remarks, setRemarks] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Submit the form data using fetch request
//   const handleRemarksChange = (e) => {
//     setRemarks(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!record || record?.id <= 0) {
//       toast.error(
//         "Unable to order received approved. Please verify the order details."
//       );
//       return;
//     }
//     setLoading(true);
//     const newdata = { remarks, vchCode: record?.id };
//     try {
//       const response = await fetch(`${apiUrl}/UpdateOrderReceivedApprovals`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newdata),
//       });
//       const data = await response.json();
//       if (data.status === 1) {
//         setRemarks("");
//         toast.success(data.msg);
//         onSubmitSuccess();
//       } else {
//         toast.error(data.msg);
//       }
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="modal fade" id="ordapproval" tabIndex="-1" role="dialog">
//         <div className="modal-dialog modal-dialog-centered custom-modal-two">
//           <div className="modal-content">
//             <div className="page-wrapper-new p-0">
//               <div className="content">
//                 {loading && <Loader_2 />}
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
//                 <div className="modal-body custom-modal-body">
//                   <form onSubmit={handleSubmit}>
//                     <div className="mb-0">
//                       <label className="form-label">Remarks</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="remarks"
//                         value={remarks}
//                         onChange={handleRemarksChange}
//                         required
//                       />
//                     </div>
//                     <div className="modal-footer-btn">
//                       <button
//                         type="button"
//                         className="btn btn-cancel me-2"
//                         data-bs-dismiss="modal"
//                       >
//                         Cancel
//                       </button>
//                       <button type="submit" className="btn btn-submit">
//                         Received
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderReceivedApproval;
