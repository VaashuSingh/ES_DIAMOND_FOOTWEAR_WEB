/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Loader_2 from "../../../feature-module/loader-2/loader-2";
import { Link } from "react-router-dom";
// import Table from "../../../core/pagination/datatable";
import { useEffect } from "react";
import { apiUrl } from "../../json/api";
import { toast } from "react-toastify";

import { Table } from "antd";
import { Badge, Tag } from "antd";

const OrderReceivedView = ({ record }) => {
  const [loading, setLoading] = useState(false);
  const [tabledata, setTableData] = useState([]);

  // DataTable
  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemname",
      key: "itemname",
      fixed: "left",
      ellipsis: "true",
      width: 300,
      sorter: (a, b) => a.itemname.length - b.itemname.length,
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
      title: "Para1",
      dataIndex: "para1",
      key: "1",
      sorter: true,
    },
    {
      title: "Para2",
      dataIndex: "para2",
      key: "2",
      sorter: (a, b) => a.para1.length - b.para1.length,
    },
    {
      title: "Qty.",
      dataIndex: "qty",
      key: "3",
      sorter: (a, b) => a.qty.length - b.qty.length,
    },
    {
      title: "Challan Qty",
      dataIndex: "challanqty",
      key: "4",
      sorter: (a, b) => a.challanqty.length - b.challanqty.length,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "5",
      sorter: (a, b) => a.unit.length - b.unit.length,
    },
    {
      title: "Alt. Qty. ",
      dataIndex: "altqty",
      key: "6",
      sorter: (a, b) => a.altqty.length - b.altqty.length,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "7",
      sorter: (a, b) => a.price.length - b.price.length,
    },
    {
      title: "MRP",
      dataIndex: "mrp",
      key: "8",
      sorter: (a, b) => a.mrp.length - b.mrp.length,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "9",
      sorter: (a, b) => a.amount.lenght - b.amount.lenght,
    },
    {
      title: "Status",
      dataIndex: "status",
      fixed: "right",
      width: 100,
      render: (tag, record) => (
        // console.log(record),
        <span className="d-flex justify-content-between align-items-center">
          <Tag color={record.status === 0 ? "blue" : "volcano"} key={tag}>
            {record.status === 0 ? (
              <Badge status="success" text="Active" />
            ) : (
              <Badge status="error" text="Deactive" />
            )}
          </Tag>
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (record || record?.id > 0) {
      setTableData([]);
      getTableData(`${apiUrl}/GetOrderReceivedItemsDetails/${record?.id}`);
    }
  }, [record]);

  const getTableData = async (url) => {
    setLoading(true);
    try {
      const resp = await fetch(url);
      const json = await resp.json();
      const data = json.data;
      // console.log("data", data);
      const newData = data.map((item) => ({
        id: record?.id,
        itemname: item.itemName,
        para1: item.para1,
        para2: item.para2,
        qty: `${item.qty}`,
        challanqty: item.clQty,
        unit: item.unit,
        altqty: item.altQty,
        price: item.price,
        mrp: item.mrp,
        amount: item.amount,
        status: item.status,
      }));
      setTableData(newData);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="modal fade"
        id="ordreceivedDetails"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                {loading && <Loader_2 />}
                <div className="modal-header custom-modal-header">
                  <div className="page-header mb-0">
                    <div className="page-title">
                      <h4>Order Received</h4>
                      <h6>View Your Orders Received Items Details</h6>
                    </div>
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
                <div />
                {/* /product list */}
                <div className="card table-list-card">
                  <div className="card-body">
                    <div className="table-top">
                      <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                        <div className="input-blocks">
                          <label htmlFor="">Series</label>
                          <input
                            type="text"
                            className="form-control"
                            value={record?.series || "N/A"}
                            aria-label="readonly input example"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                        <div className="input-blocks">
                          <label htmlFor="">Vch No.</label>
                          <input
                            type="text"
                            className="form-control"
                            value={record?.vchno || "N/A"}
                            aria-label="readonly input example"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                        <div className="input-blocks">
                          <label htmlFor="">Vch Date: &nbsp;</label>
                          <input
                            type="text"
                            className="form-control"
                            value={record?.date || "N/A"}
                            aria-label="readonly input example"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                        <div className="input-blocks">
                          <label htmlFor="">Party</label>
                          <input
                            type="text"
                            className="form-control"
                            value={record?.customer || "N/A"}
                            aria-label="readonly input example"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <Table
                        className="table dataTable"
                        columns={columns}
                        dataSource={tabledata}
                        scroll={{ x: 1300 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderReceivedView;
