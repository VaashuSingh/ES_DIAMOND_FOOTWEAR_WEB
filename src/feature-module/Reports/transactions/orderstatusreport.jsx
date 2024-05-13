import React, { useEffect, useState } from "react";
import {
  PageTopHeaderLeft,
  PageTopRight,
  TableDataSearch,
} from "../../../core/reusable_components/table/tables";
import { Link } from "react-router-dom";
import { Filter, StopCircle, User } from "react-feather";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { DatePicker, Tag } from "antd";
import Select from "react-select";
import Table from "../../../core/pagination/datatable";
import { toast } from "react-toastify";
import { apiUrl } from "../../../core/json/api";
import Loader_2 from "../../loader-2/loader-2";
const Order_Status_Report = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableDataSearch, setTableDataSearch] = useState();
  const [partyOpts, setPartyOpts] = useState([]);
  const [itemOpts, setItemOpts] = useState([]);
  const [orderNoOpts, setOrderNoOpts] = useState([]);
  const [selectedisFilterVal, setSelectedisFilterVal] = useState({
    party: 0,
    item: 0,
    orderno: "",
    status: 0,
    startDate: "",
    endDate: "",
  });

  const statusOpt = [
    { value: 0, label: "Select All" },
    { value: 1, label: "Close" },
    { value: 2, label: "Pending" },
  ];

  function toggleFilterVisibility() {
    setIsFilterVisible(!isFilterVisible);
  }

  const columns = [
    {
      title: "Order Date",
      dataIndex: "orderdate",
      sorter: (a, b) => a.orderdate.length - b.orderdate.length,
    },
    {
      title: "Order No",
      dataIndex: "orderno",
      sorter: (a, b) => a.orderno.length - b.orderno.length,
    },
    {
      title: "Party",
      dataIndex: "party",
      sorter: (a, b) => a.party.length - b.party.length,
    },
    {
      title: "Item Name",
      dataIndex: "itemname",
      sorter: (a, b) => a.itemname.length - b.itemname.length,
    },
    {
      title: "Color",
      dataIndex: "color",
      sorter: (a, b) => a.color.length - b.color.length,
    },
    {
      title: "Size",
      dataIndex: "size",
      sorter: (a, b) => a.size.length - b.size.length,
    },
    {
      title: "MRP",
      dataIndex: "mrp",
      sorter: (a, b) => a.mrp - b.mrp,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      sorter: (a, b) => a.qty - b.qty,
    },
    {
      title: "Alt Qty",
      dataIndex: "altqty",
      sorter: (a, b) => a.altqty - b.altqty,
    },
    {
      title: "Responsible Person",
      dataIndex: "person",
      sorter: (a, b) => a.person.length - b.person.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status - b.status,
      render: (_, record) => {
        const status = record.status === 1 ? "Close" : "Pending";
        const color = record.status === 1 ? "success" : "warning";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  useEffect(() => {
    getTableData(`${apiUrl}/GetOrderStatusReport`);
    getBusyMasterList(`${apiUrl}/GetBusyMasterList?MasterType=2`, 1);
    getBusyMasterList(`${apiUrl}/GetBusyMasterList?MasterType=6`, 2);
    getBusyMasterList(`${apiUrl}/GetBusyMasterList?TranType=2`, 3);
  }, []);

  const getTableData = async (url) => {
    setIsLoading(true);
    try {
      const resp = await fetch(url);
      const result = await resp.json();
      //   console.log("result", result);
      if (result.status === 1) {
        const tabledatanew = result.data.map((item, index) => ({
          vchcode: item.vchCode,
          taskcode: item.taskCode,
          orderdate: item.vchDate,
          orderno: item.vchNo,
          party: item.accName,
          itemname: item.itemName,
          color: item.color,
          size: item.size,
          qty: item.qty,
          altqty: item.altQty,
          mrp: item.mrp,
          status: item.status,
          person: item.person,
        }));
        setTableData(tabledatanew);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getBusyMasterList = async (url, trantype) => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      // console.log("result", result);
      if (result.status === 1) {
        let list = [{ value: 0, label: "Select All" }, result?.data];
        let listnew = list.flat();
        switch (trantype) {
          case 1:
            setPartyOpts(listnew);
            break;
          case 2:
            setItemOpts(listnew);
            break;
          case 3:
            setOrderNoOpts(listnew);
            break;
          default:
            break;
        }
      } else toast.error(result.msg);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (selected, event) => {
    if (event.name === "orderno") {
      setSelectedisFilterVal({
        ...selectedisFilterVal,
        [event.name]: selected.label,
      });
    } else {
      setSelectedisFilterVal({
        ...selectedisFilterVal,
        [event.name]: selected.value,
      });
    }
  };

  // console.log("selectedisFilterVal", selectedisFilterVal);

  const ValidationApplied = (SelectedFilter) => {
    if (
      (SelectedFilter.startDate && SelectedFilter.endDate === "") ||
      (SelectedFilter.startDate === "" && SelectedFilter.endDate)
    ) {
      throw new Error("Please select a valid Date Range");
    } else if (
      !SelectedFilter.series &&
      !SelectedFilter.party &&
      !SelectedFilter.startDate &&
      !SelectedFilter.endDate
    ) {
      throw new Error("Please select a valid Filter Range");
    } else {
      return true;
    }
  };

  const handleSearching = async () => {
    setIsLoading(true);
    if (!ValidationApplied(selectedisFilterVal)) return;
    try {
      const resp = "";
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {isLoading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <PageTopHeaderLeft
              title={"Order Status Report"}
              subTitle={"Order Items Status Details"}
            />
            <PageTopRight onRefresh={" "} />
          </div>
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                {/* searching Table Data */}
                <div className="search-set">
                  <TableDataSearch onSearch={" "} />
                </div>
                {/* searching Table Data */}
                {/* Filter Icon */}
                <div className="search-path">
                  <a
                    className={`btn btn-filter ${
                      isFilterVisible ? "setclose" : ""
                    }`}
                    id="filter_search"
                    onClick={toggleFilterVisibility}
                  >
                    <Filter
                      className="filter-icon"
                      onClick={toggleFilterVisibility}
                    />
                    <span onClick={toggleFilterVisibility}>
                      <ImageWithBasePath
                        src="assets/img/icons/closes.svg"
                        alt="img"
                      />
                    </span>
                  </a>
                </div>
              </div>
              {/* Filter Icon */}
              <div
                className={`card ${isFilterVisible ? "visible" : ""}`}
                id="filter_inputs"
                style={{ display: isFilterVisible ? "block" : "none" }}
              >
                {/* Filter */}
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            {/* <User className="info-img" /> */}
                            <Select
                              className="select"
                              name="party"
                              options={partyOpts}
                              placeholder="Choose Party"
                              onChange={(e, name) =>
                                handleSelectChange(e, name)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            {/* <StopCircle className="info-img" /> */}
                            <Select
                              className="select"
                              name="item"
                              placeholder="Choose Items"
                              options={itemOpts}
                              onChange={(e, name) =>
                                handleSelectChange(e, name)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            {/* <StopCircle className="info-img" /> */}
                            <Select
                              className="select"
                              name="orderno"
                              placeholder="Choose Order No"
                              options={orderNoOpts}
                              onChange={(e, name) =>
                                handleSelectChange(e, name)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            {/* <StopCircle className="info-img" /> */}
                            <Select
                              className="select"
                              name="status"
                              options={statusOpt}
                              placeholder="Choose Status"
                              onChange={(e, name) =>
                                handleSelectChange(e, name)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="row">
                        <div className="col-md-5 col-sm-6 col-12">
                          <div className="input-blocks">
                            <div className="input-groupicon">
                              <DatePicker
                                type="date"
                                className="filterdatepicker"
                                placeholder="Form Date"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5 col-sm-6 col-12">
                          <div className="input-blocks">
                            <div className="input-groupicon">
                              <DatePicker
                                type="date"
                                className="filterdatepicker"
                                dateFormat="dd-MM-yyyy"
                                placeholder="To Date"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-6 col-12">
                          <div className="input-blocks">
                            <button
                              className="btn btn-filters ms-auto"
                              onClick={"applyFilter"}
                            >
                              {" "}
                              <i
                                data-feather="search"
                                className="feather-search"
                              />{" "}
                              Search{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Filter */}
              </div>
              {/* Table */}
              <div className="table-responsive">
                <Table columns={columns} dataSource={tableData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order_Status_Report;
