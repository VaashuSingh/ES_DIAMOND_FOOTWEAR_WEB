/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Loader_2 from "../../loader-2/loader-2";
import {
  GoBackToPage,
  PageTopHeaderLeft,
  TableTopHead,
  TableTopHeader,
} from "../../../core/reusable_components/table/TableHead";
import { Table, Tag } from "antd";
// import Table from "../../../core/pagination/datatable";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../../../core/json/api";
import { toast } from "react-toastify";
import Modal_Accept from "../../../core/modals/transaction/order-accept/accept-modal";
import Datatable from "../../../core/pagination/datatable";
import { getCurrentUsersDetails } from "../../../core/reusable_components/table/functions";
import moment from "moment";

const ItemsDeatilsShow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableDatas] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({ data: "" });
  const [selecteditems, setSelecteditems] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [modalData, setModalData] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const recordId = state?.code;

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
      // sorter: (a, b) => a.qty.length - b.qty.length,
    },
    // {
    //   title: "Challan Qty",
    //   dataIndex: "clQty",
    //   key: "4",
    // },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "7",
      // sorter: (a, b) => a.unit.length - b.unit.length,
    },
    {
      title: "Alt. Qty. ",
      dataIndex: "altqty",
      key: "8",
      // sorter: (a, b) => a.altqty.length - b.altqty.length,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "9",
      // sorter: (a, b) => a.price.length - b.price.length,
    },
    {
      title: "MRP",
      dataIndex: "mrp",
      key: "10",
      // sorter: (a, b) => a.mrp.length - b.mrp.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "11",
      // sorter: (a, b) => a.amount.lenght - b.amount.lenght,
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
        console.log("data", data);
        const newdata = data.map((item, index) => ({
          key: index,
          vchCode: item.vchCode,
          vchDate: moment(item.vchDate, "DD-MM-YYYY").format("DD-MMM-YYYY"),
          vchNo: item.vchNo,
          vchSeries: item.vchSeries,
          poNo: item.poNo,
          accCode: item.accCode,
          itemCode: item.itemCode,
          itemname: item.itemName,
          mname1: item.mName1,
          mname2: item.mName1,
          mname3: item.mName1,
          mCode1: item.mCode1,
          mCode2: item.mCode2,
          mCode3: item.mCode3,
          color: item.color,
          size: item.size,
          qty: item.qty,
          clQty: item.clQty,
          uCode: item.uCode,
          unit: item.unit,
          altqty: item.altQty,
          price: item.price,
          mrp: item.mrp,
          amount: item.amount,
          status: 0,
        }));
        setTableDatas(newdata);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (recordId) {
      getTableData(`${apiUrl}/GetOrderReceivedItemsDetails/${recordId}`);
    }
  }, [recordId]);

  const showModal = (record, index) => {
    setSelecteditems(record);
    setSelectedRowIndex(index);
    setSelectedRowData({ data: "" });
    if (modalData[index]) {
      setSelectedRowData({ data: modalData[index] });
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedRowData({ data: "" });
  };

  const handleSaveModalData = (rowData) => {
    // Update modalData with the saved data for the selected row
    const updatedModalData = { ...modalData, [selectedRowIndex]: rowData };
    setModalData(updatedModalData);
    handleModalOk();
  };

  const form_Validate = () => {
    const hasPendingRows = tableData.some((row) => !modalData[row.key]);
    if (hasPendingRows) {
      toast.warning("Please complete all rows before saving.");
      return false;
    } else {
      return true;
    }
  };

  const prepare_form_Data = () => {
    const users = getCurrentUsersDetails();
    const formattedData = tableData.map((row) => {
      const modalRowData = modalData[row.key];
      return {
        ...row,
        mrp_date: moment(modalRowData.mrp_date, "DD-MM-YYYY").format(
          "DD-MMM-YYYY"
        ),
        purc_date: moment(modalRowData.purc_date, "DD-MM-YYYY").format(
          "DD-MMM-YYYY"
        ),
        prod_date: moment(modalRowData.prod_date, "DD-MM-YYYY").format(
          "DD-MMM-YYYY"
        ),
        deli_date: moment(modalRowData.deli_date, "DD-MM-YYYY").format(
          "DD-MMM-YYYY"
        ),
        remark: modalRowData.remark,
        person: modalRowData.person,
      };
    });

    // const newTableData = formData.map((item) => {
    //   const { key, itemname, status, unit, ...rest } = item;
    //   return rest;
    // });

    const actualFormData = {
      orderAcceptTask: formattedData.map(
        ({ key, itemname, mname1, mname2, mname3, status, unit, ...rest }) =>
          rest
      ),
    };
    return actualFormData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any row has a status of "Pending"
    setIsLoading(true);
    try {
      if (!form_Validate()) return;
      const formdata = prepare_form_Data();
      // console.log("formdata", formdata);
      // return;
      const resp = await fetch(`${apiUrl}/SaveOrderAcceptTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await resp.json();
      // console.log("data", data);
      if (data.status === 1) {
        toast.success(data.msg, {
          position: "top-center",
        });
        navigate("/order-accept-list");
      } else {
        toast.warning(data.msg, {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
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
            <GoBackToPage title={`to Order Accept`} />
            {/* <TableTopHead onRefresh={handleRefresh} /> */}
          </div>
          <div className="table-top form-control">
            <div className="col-lg-3 col-sm-6 col-12 ms-auto px-2">
              <div className="form-group input-blocks">
                <label htmlFor="">Series</label>
                <input
                  type="text"
                  className="form-control"
                  value={state?.headers?.series || "N/A"}
                  disabled
                />
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 ms-auto px-2">
              <div className="input-blocks">
                <label htmlFor="">Vch No.</label>
                <input
                  type="text"
                  className="form-control"
                  value={state?.headers?.vchno || "N/A"}
                  aria-label="readonly input example"
                  disabled
                />
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 ms-auto px-2">
              <div className="input-blocks">
                <label htmlFor="">Vch Date: &nbsp;</label>
                <input
                  type="text"
                  className="form-control"
                  value={state?.headers?.vchdate || "N/A"}
                  disabled
                />
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 ms-auto px-2">
              <div className="input-blocks">
                <label htmlFor="">Party</label>
                <input
                  type="text"
                  className="form-control"
                  value={state?.headers?.party || "N/A"}
                  disabled
                />
              </div>
            </div>
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
      <Modal_Accept
        show={isModalVisible}
        onHide={handleModalCancel}
        onSave={handleSaveModalData}
        selectItems={selecteditems}
        modalData={selectedRowData}
      />
    </div>
  );
};

export default ItemsDeatilsShow;
