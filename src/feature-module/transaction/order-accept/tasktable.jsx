/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { apiUrl } from "../../../core/json/api";
import Loader_2 from "../../loader-2/loader-2";
import {
  GoBackToPage,
  PageTopHeaderLeft,
  TableDataSearch,
} from "../../../core/reusable_components/table/TableHead";
import Modal_Task_Approvel from "../../../core/modals/transaction/order-accept/approvel-modal";

const Order_Task_Table = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState({ title: "", subtitle: "" });
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTable, setSearchTable] = useState(null);

  const handleShowModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const headers_Details = (value) => {
    switch (value) {
      case 1:
        setHeaders({
          title: "MRP Approvel",
          subtitle: "Order MRP Approvel in Items",
        });
        break;
      case 2:
        setHeaders({
          title: "Purchase Approvel",
          subtitle: "Order Purchase Approvel in Items",
        });
        break;
      case 3:
        setHeaders({
          title: "Production Approvel",
          subtitle: "Order Production Approvel in Items",
        });
        break;
      case 4:
        setHeaders({
          title: "Delivery Approvel",
          subtitle: "Order Delivery Approvel in Items",
        });
        break;
      default:
        console.log("default");
        break;
    }
  };

  const expandedRowRender = (record) => {
    const columns2 = [
      { title: "Customer", dataIndex: "customer", key: "customer" },
      { title: "Po No.", dataIndex: "pono", key: "pono" },
      { title: "Person", dataIndex: "person", key: "person" },
      { title: "Task_Desc", dataIndex: "taskdesc", key: "taskdesc" },
      { title: "Completion Date", dataIndex: "taskdate", key: "taskdate" },
    ];
    return (
      <Table
        className="m-0"
        columns={columns2}
        dataSource={[record.expandedData]}
        pagination={false}
        bordered
      />
    );
  };

  const handleRowExpand = (expanded, record) => {
    // If row is expanded, set the expanded row keys to only this row's key
    setExpandedRowKeys(expanded ? [record.key] : []);
  };

  const columns1 = [
    {
      title: "Item Name",
      dataIndex: "itemname",
      key: "itemname",
      // fixed: "left",
      width: 500,
      sorter: (a, b) => a.itemname.length - b.itemname.length,
      render: (text) => (
        <a style={{ fontSize: "15px", fontWeight: "bold", color: "#FF9F43" }}>
          {text}
        </a>
      ),
    },
    { title: "Vch No", dataIndex: "vchno", key: "1" },
    { title: "Vch Date", dataIndex: "vchdate", key: "2" },
    { title: "Sole Branding", dataIndex: "mname1", key: "3" },
    { title: "Socks Branding", dataIndex: "mname2", key: "4" },
    { title: "Sole Mold", dataIndex: "mname3", key: "5" },
    { title: "Color", dataIndex: "color", key: "6" },
    { title: "Size", dataIndex: "size", key: "7" },
    { title: "Unit", dataIndex: "unit", key: "8" },
    { title: "Qty.", dataIndex: "qty", key: "9" },
    { title: "Alt. Qty. ", dataIndex: "altqty", key: "10" },
    { title: "Price", dataIndex: "price", key: "11" },
    { title: "MRP", dataIndex: "mrp", key: "12" },
    { title: "Amount", dataIndex: "amount", key: "13" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 100,
      render: (_, record) => {
        const status =
          record.status === 0 ? "Pending" : record.status === 2 ? "Hold" : "";
        const color =
          record.status === 0 ? "error" : record.status === 2 ? "warning" : "";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record, index) => (
        <td id="accept_table" className="action-table-data">
          <div className="edit-delete-action">
            <a className="me-2 p-2" onClick={() => handleShowModal(record)}>
              <i data-feather="edit" className="feather-edit" />
            </a>
          </div>
        </td>
      ),
    },
  ];

  useEffect(() => {
    if (props.identity) {
      handle_form_clear();
      headers_Details(props?.identity);
      getTableData(`${apiUrl}/GetTaskApprovelVch/${props.identity}`);
    }
  }, [props?.identity]);

  const getTableData = async (url) => {
    setIsLoading(true);
    try {
      const resp = await fetch(url);
      const json = await resp.json();
      const data = json.data;
      // console.log("data", data);
      const newdata = data?.map((item, index) => ({
        expandedData: {
          pono: item.poNo,
          vchseries: item.vchSeries,
          customer: item.accName,
          person: item.person,
          taskdesc: item.taskDesc,
          taskdate: moment(item.taskDate, "DD-MM-YYYY").format("DD-MMM-YYYY"),
        },
        key: index,
        vchCode: item.vchCode,
        taskCode: item.taskCode,
        taskId: item.taskId,
        itemCode: item.itemCode,
        itemname: item.itemName,
        vchdate: moment(item.vchDate, "DD-MM-YYYY").format("DD-MMM-YYYY"),
        vchno: item.vchNo,
        mname1: item.mName1,
        mname2: item.mName2,
        mname3: item.mName3,
        color: item.color,
        size: item.size,
        qty: item.qty,
        unit: item.unit,
        altqty: item.altQty,
        price: item.price,
        mrp: item.mrp,
        amount: item.amount,
        status: item.taskStatus,
      }));
      setData(newdata);
      console.log(newdata);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmitSuccess = () => {
    if (props.identity) {
      handle_form_clear();
      getTableData(`${apiUrl}/GetTaskApprovelVch/${props.identity}`);
    }
  };

  const handle_form_clear = () => {
    setData([]);
    setSearchTable(null);
  };

  //Searching Input Box In Table
  const handleSearch = (value) => {
    const filteredData = data.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setSearchTable(filteredData);
  };

  return (
    <>
      {isLoading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            {/* Table top header component */}
            <PageTopHeaderLeft
              title={headers.title}
              subTitle={headers.subtitle}
            />
            <GoBackToPage title={" "} />
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <TableDataSearch onSearch={handleSearch} />
                </div>
              </div>
              <div className="table-responsive p-0">
                <Table
                  className="table datanew dataTable no-footer"
                  columns={columns1}
                  expandable={{
                    expandedRowRender,
                    expandedRowKeys: expandedRowKeys,
                    onExpand: handleRowExpand,
                  }}
                  dataSource={searchTable || data}
                  bordered={true}
                />
              </div>
            </div>
          </div>
          {/* /Order Received list */}
        </div>
      </div>
      <Modal_Task_Approvel
        show={isModalVisible}
        onHide={handleModalCancel}
        record={selectedRecord}
        onSubmitSucces={handleSubmitSuccess}
      />
    </>
  );
};

Order_Task_Table.prototype = {
  identity: PropTypes.number.isRequired,
};

export default Order_Task_Table;
