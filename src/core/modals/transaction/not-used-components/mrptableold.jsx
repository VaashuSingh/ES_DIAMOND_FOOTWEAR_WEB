// /* eslint-disable react/prop-types */
// import React, { useEffect, useState } from "react";
// import Loader_2 from "../../../../feature-module/loader-2/loader-2";
// import {
//   GoBackToPage,
//   PageTopHeaderLeft,
// } from "../../../reusable_components/table/TableHead";
// import { Table, Tag } from "antd";
// // import Table from "../../../core/pagination/datatable";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { apiUrl } from "../../../json/api";
// import { toast } from "react-toastify";
// import Modal_Accept from "../order-accept/accept-modal";
// import moment from "moment";
// import PropTypes from "prop-types";

// const Order_Task_Table = (props) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [tableData, setTableDatas] = useState([]);
//   const [headers, setHeaders] = useState({ title: "", subtitle: "" });

//   const headers_Details = (value) => {
//     switch (value) {
//       case 1:
//         setHeaders({
//           title: "MRP Approvel",
//           subtitle: "Order MRP Approvel in Items",
//         });
//         break;
//       case 2:
//         setHeaders({
//           title: "Purchase Approvel",
//           subtitle: "Order Purchase Approvel in Items",
//         });
//         break;
//       case 3:
//         setHeaders({
//           title: "Production Approvel",
//           subtitle: "Order Production Approvel in Items",
//         });
//         break;
//       case 4:
//         setHeaders({
//           title: "Delivery Approvel",
//           subtitle: "Order Delivery Approvel in Items",
//         });
//         break;
//       default:
//         console.log("default");
//         break;
//     }
//   };

//   const columns2 = [
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//     },

//     {
//       title: "Series",
//       dataIndex: "series",
//       key: "series",
//     },
//     {
//       title: "Vch No.",
//       dataIndex: "vchno",
//       key: "vchno",
//     },
//     {
//       title: "Customer",
//       dataIndex: "customer",
//       key: "customer",
//     },
//   ];

//   // DataTable
//   const columns1 = [
//     {
//       title: "Item Name",
//       dataIndex: "itemname",
//       key: "itemname",
//       render: (text) => (
//         <a style={{ fontSize: "15px", fontWeight: "bold", color: "#FF9F43" }}>
//           {text}
//         </a>
//       ),
//     },
//     {
//       title: "Sole Branding",
//       dataIndex: "mName1",
//       key: "1",
//     },
//     {
//       title: "Socks Branding",
//       dataIndex: "mName2",
//       key: "2",
//     },
//     {
//       title: "Sole Mold",
//       dataIndex: "mName3",
//       key: "3",
//     },
//     {
//       title: "Color",
//       dataIndex: "color",
//       key: "4",
//       // sorter: true,
//     },
//     {
//       title: "Size",
//       dataIndex: "size",
//       key: "5",
//     },
//     {
//       title: "Unit",
//       dataIndex: "unit",
//       key: "7",
//       // sorter: (a, b) => a.unit.length - b.unit.length,
//     },
//     {
//       title: "Qty.",
//       dataIndex: "qty",
//       key: "6",
//       // sorter: (a, b) => a.qty.length - b.qty.length,
//     },
//     {
//       title: "Alt. Qty. ",
//       dataIndex: "altqty",
//       key: "8",
//       // sorter: (a, b) => a.altqty.length - b.altqty.length,
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "9",
//       // sorter: (a, b) => a.price.length - b.price.length,
//     },
//     {
//       title: "MRP",
//       dataIndex: "mrp",
//       key: "10",
//       // sorter: (a, b) => a.mrp.length - b.mrp.length,
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       key: "11",
//       // sorter: (a, b) => a.amount.lenght - b.amount.lenght,
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (_, record, index) => {
//         // const rowData = modalData[record?.key];
//         // const status = rowData ? "Complete" : "Pending";
//         // const color = rowData ? "success" : "error";
//         // return <Tag color={color}>{status}</Tag>;
//       },
//     },
//     {
//       title: "Action",
//       dataIndex: "action",
//       fixed: "right",
//       render: (_, record, index) => (
//         <td id="accept_table" className="action-table-data">
//           <div className="edit-delete-action">
//             <a
//               className="me-2 p-2"
//               //   onClick={() => showModal(record, record.key)}
//             >
//               <i data-feather="edit" className="feather-edit" />
//             </a>
//           </div>
//         </td>
//       ),
//     },
//   ];

//   useEffect(() => {
//     const getTableData = async (url) => {
//       setIsLoading(true);
//       try {
//         const resp = await fetch(url);
//         const json = await resp.json();
//         const data = json.data;
//         // console.log("data", data);
//         const newdata = data.map((item, index) => ({
//           vchCode: item.vchCode,
//           vchDate: moment(item.vchDate, "DD-MM-YYYY").format("DD-MMM-YYYY"),
//           vchNo: item.vchNo,
//           poNo: item.poNo,
//           itemname: item.itemName,
//           mName1: item.mName1,
//           mName2: item.mName2,
//           mName3: item.mName3,
//           color: item.color,
//           size: item.size,
//           qty: item.qty,
//           clQty: item.clQty,
//           unit: item.unit,
//           altqty: item.altQty,
//           price: item.price,
//           mrp: item.mrp,
//           amount: item.amount,
//           status: item.status,
//         }));
//         setTableDatas(newdata);
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (props.identity) {
//       headers_Details(props?.identity);
//       getTableData(`${apiUrl}/GetTaskApprovelVch/${props.identity}`);
//     }
//   }, [props?.identity]);

//   return (
//     <div>
//       {isLoading && <Loader_2 />}
//       <div className="page-wrapper">
//         <div className="content">
//           <div className="page-header">
//             {/* Table top header component */}
//             <PageTopHeaderLeft
//               title={headers.title}
//               subTitle={headers.subtitle}
//             />
//             <GoBackToPage title={`Order Accept`} />
//           </div>
//           {/* /product list */}
//           <div className="card table-list-card" style={{ borderTop: 0 }}>
//             <div className="card-body">
//               <div className="table-responsive">
//                 <Table
//                   key={(record) => record.key}
//                   columns={columns1}
//                   dataSource={tableData}
//                   rowKey={(record) => record.key}
//                 />
//               </div>
//             </div>
//           </div>
//           {/* /Order Received list */}
//         </div>
//       </div>
//     </div>
//   );
// };

// Order_Task_Table.prototype = {
//   identity: PropTypes.number.isRequired,
// };

// export default Order_Task_Table;
