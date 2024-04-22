/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Loader_2 from "../../loader-2/loader-2";
import {
  PageTopHeaderLeft,
  TableTopHead,
  TableTopHeader,
} from "../../../core/reusable_components/table/TableHead";
import { Table, Tag } from "antd";
// import Table from "../../../core/pagination/datatable";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../../../core/json/api";
import { toast } from "react-toastify";
import Accept_Modal from "../../../core/modals/transaction/order-accept/accept-modal";
import Datatable from "../../../core/pagination/datatable";

const ItemsDeatilsViews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableDatas] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  // const [recordId, setRecordId] = useState(null);
  const [modalData, setModalData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const recordId = state?.code;
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  // DataTable
  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemname",
      key: "itemname",
      // fixed: "left",
      // width: 300,
      // sorter: (a, b) => a.itemname.length - b.itemname.length,
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
      title: "Color",
      dataIndex: "para1",
      key: "1",
      // sorter: true,
    },
    {
      title: "Size",
      dataIndex: "para2",
      key: "2",
      // sorter: true,
    },
    {
      title: "Qty.",
      dataIndex: "qty",
      key: "3",
      // sorter: (a, b) => a.qty.length - b.qty.length,
    },
    {
      title: "Challan Qty",
      dataIndex: "challanqty",
      key: "4",
      // sorter: (a, b) => a.challanqty.length - b.challanqty.length,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "5",
      // sorter: (a, b) => a.unit.length - b.unit.length,
    },
    {
      title: "Alt. Qty. ",
      dataIndex: "altqty",
      key: "6",
      // sorter: (a, b) => a.altqty.length - b.altqty.length,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "7",
      // sorter: (a, b) => a.price.length - b.price.length,
    },
    {
      title: "MRP",
      dataIndex: "mrp",
      key: "8",
      // sorter: (a, b) => a.mrp.length - b.mrp.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "9",
      // sorter: (a, b) => a.amount.lenght - b.amount.lenght,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record, index) => {
        // console.log("ggg", record.key);
        const rowData = modalData[record?.key];
        const status = rowData ? "Complete" : "Pending";
        const color = rowData ? "success" : "error";
        return <Tag color={color}>{status}</Tag>;
      },

      // fixed: "right",
      //   width: 100,
      // render: (tag, record, index) => (
      //   <span className="d-flex justify-content-between align-items-center">
      //     <Tag
      //       color={
      //         isAction.action === 1 && isAction.index === index
      //           ? "blue"
      //           : "volcano"
      //       }
      //       key={tag}
      //     >
      //       {isAction.action === 1 && isAction.index === index ? (
      //         <Badge status="success" text="Complete" />
      //       ) : (
      //         <Badge status="error" text="Pending" />
      //       )}
      //     </Tag>
      //   </span>
      // ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record, index) => (
        // console.log("index", record?.key),
        <td id="accept_table" className="action-table-data">
          <div className="edit-delete-action">
            <a
              className="me-2 p-2"
              onClick={() => showModal(record, record.key)}
            >
              <i data-feather="edit" className="feather-edit" />
            </a>
          </div>
        </td>
      ),
    },
  ];

  useEffect(() => {
    const getTableData = async (url) => {
      setIsLoading(true);
      try {
        const resp = await fetch(url);
        const json = await resp.json();
        const data = json.data;
        // console.log("data", data);
        const newdata = data.map((item, index) => ({
          key: index,
          code: state?.code,
          itemname: item.itemName,
          para1: item.para1,
          para2: item.para2,
          qty: item.qty,
          challanqty: item.clQty,
          unit: item.unit,
          altqty: item.altQty,
          price: item.price,
          mrp: item.mrp,
          amount: item.amount,
          status: item.status,
        }));
        setTableDatas(newdata);
        setPagination((prev) => ({ ...prev, total: newdata.length }));
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (recordId) {
      console.log("state", state);
      console.log("setRecordId", recordId);

      getTableData(`${apiUrl}/GetOrderReceivedItemsDetails/${recordId}`);
    }
  }, [recordId]);

  // console.log("tableData", tableData);

  const showModal = (record, index) => {
    setSelectedRowData(record);
    setSelectedRowIndex(index);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSaveModalData = (rowData) => {
    // Update modalData with the saved data for the selected row
    const updatedModalData = { ...modalData, [selectedRowIndex]: rowData };
    setModalData(updatedModalData);
    handleModalOk();
  };

  console.log("modalData", modalData);
  // console.log("selectedRowIndex", selectedRowIndex);
  // console.log("selectedRowData", selectedRowData);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if any row has a status of "Pending"
    const hasPendingRows = tableData.some((row) => !modalData[row.key]);

    console.log("hasPendingRows", hasPendingRows);
    if (hasPendingRows) {
      toast.error("Please complete all rows before saving.");
      return;
    }
  };

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
            {/* <TableTopHead onRefresh={handleRefresh} /> */}
          </div>
          {/* /product list */}
          <form action="#" onSubmit={handleSubmit}>
            <div className="card table-list-card" style={{ borderTop: 0 }}>
              <div className="card-body">
                <div className="table-responsive">
                  <Table
                    key={(record) => record.key}
                    columns={columns}
                    dataSource={tableData}
                    rowKey={(record) => record.key}
                    // pagination={pagination}
                    // pagination={false} // Disable default pagination
                    // onChange={handleTableChange}
                  />
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
                <button type="submit" className="btn btn-submit">
                  Accept orders
                </button>
              </div>
            </div>
          </form>
          {/* /Order Received list */}
        </div>
      </div>
      {/* <AcceptItemsWiseOpenModal
        visible={isModalVisible}
        rowData={selectedRowData}
        onSave={handleSaveModalData}
        onCancel={handleModalCancel}
        // record={selectedRecord}
        // action={handleAction}
        // rowIndex={selectRowIndex}
      /> */}
      <Accept_Modal
        show={isModalVisible}
        onHide={handleModalCancel}
        onSave={handleSaveModalData}
      />
    </div>
  );
};

export default ItemsDeatilsViews;
