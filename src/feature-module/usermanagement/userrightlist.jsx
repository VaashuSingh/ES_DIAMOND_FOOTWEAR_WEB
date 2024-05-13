/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import AddUsers from "../../core/modals/usermanagement/addusers";
import { apiUrl } from "../../core/json/api";
import { toast } from "react-toastify";
import Loader_2 from "../loader-2/loader-2";
import No_Images from "../../core/assets/img/no-img.png";
import {
  TableHeadButton,
  TableDataSearch,
  PageTopRight,
  PageTopHeaderLeft,
  GoBackToPage,
} from "../../core/reusable_components/table/tables";
import { Tag } from "feather-icons-react/build/IconComponents";

const UsersRightList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableDatas] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({ data: "" });
  const [selecteditems, setSelecteditems] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [modalData, setModalData] = useState({});

  // DataTable
  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemname",
      key: "itemname",
      width: "30%",
      render: (text) => (
        <a
          to="#"
          style={{ fontSize: "15px", fontWeight: "bold", color: "#FF9F43" }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Po No",
      dataIndex: "poNo",
    },
    {
      title: "Sole Branding",
      dataIndex: "mname1",
      width: "7%",
      // key: "1",
    },
    {
      title: "Socks Branding",
      dataIndex: "mname2",
      width: "7%",
      // key: "2",
    },
    {
      title: "Sole Mold",
      dataIndex: "mname3",
      width: "7%",
      // key: "3",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "4",
      // sorter: true,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "5",
    },
    {
      title: "Qty.",
      dataIndex: "qty",
      key: "6",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "7",
    },
    {
      title: "Alt. Qty. ",
      dataIndex: "altqty",
      key: "8",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "9",
    },
    {
      title: "MRP",
      dataIndex: "mrp",
      key: "10",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "11",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record, index) => {
        const rowData = modalData[record?.key];
        const status = rowData ? "Complete" : "Pending";
        const color = rowData ? "success" : "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record, index) => (
        <div className="action-table-data-new">
          <div className="edit-delete-action">
            <a
              className="me-2 p-2"
            >
              <i data-feather="edit" className="feather-edit" />
            </a>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      {isLoading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            {/* Table top header component */}
            <PageTopHeaderLeft
              title={`Items Details`}
              subTitle={`Order Accept Busy Voucher Items Details`}
            />
            <GoBackToPage title={`to Order Accept`} />
            {/* <TableTopHead onRefresh={handleRefresh} /> */}
          </div>
          <div className="table-top form-control">
            <div className="col-lg-3 col-sm-6 col-12 ms-auto px-2">
              <div className="form-group input-blocks">
                <label htmlFor="">Role</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  value=""
                  placeholder="Select Role"
                />
              </div>
            </div>
          </div>
          {/* /product list */}
          <form action="#" onSubmit="">
            <div className="card table-list-card" style={{ borderTop: 0 }}>
              <div className="card-body">
                <div className="table-responsive">
                  <Table
                    key={(record) => record.key}
                    columns={columns}
                    dataSource={tableData}
                    bordered={true}
                    rowKey={(record) => record.key}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="btn-addproduct mb-4">
                <button
                  type="button"
                  className="btn btn-cancel me-2"
                //   onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-submit">
                  Accept orders
                </button>
              </div>
            </div>
          </form>
          {/* /Order Received list */}
        </div>
      </div>
    </div>
  );
};

export default UsersRightList;
