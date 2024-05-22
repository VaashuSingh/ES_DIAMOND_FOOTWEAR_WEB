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
import { apiUrl, dateFormat } from "../../../core/json/api";
import Loader_2 from "../../loader-2/loader-2";
import { searchingdata } from "../../../core/json/functions";
import moment from "moment";
const Order_Status_Report = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableDataSearch, setTableDataSearch] = useState();
  const [partyOpts, setPartyOpts] = useState([]);
  const [itemOpts, setItemOpts] = useState([]);
  const [orderNoOpts, setOrderNoOpts] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    startDate: "",
    endDate: "",
  });

  const [selectedisFilter, setSelectedisFilter] = useState({
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
    getTableData(`${apiUrl}/GetOrderStatusReport`);
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
        setTableData(handle_set_data_table(result));
      } else {
        toast.warning(result.msg);
        setTableData([]);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handle_set_data_table = (result) => {
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
    return tabledatanew;
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
      setSelectedisFilter({
        ...selectedisFilter,
        [event.name]: selected.value !== 0 ? selected.label : "",
      });
    } else {
      setSelectedisFilter({
        ...selectedisFilter,
        [event.name]: selected.value,
      });
    }
  };

  const handleDeteChange = (selected, datestring, event) => {
    setSelectedDate({ ...selectedDate, [event]: selected });
    setSelectedisFilter({
      ...selectedisFilter,
      [event]: selected
        ? moment(datestring, "YYYY-MM-DD").format("DD-MMM-YYYY")
        : "",
    });
  };

  const ValidationApplied = (SelectedFilter) => {
    if (
      (SelectedFilter.startDate && SelectedFilter.endDate === "") ||
      (SelectedFilter.startDate === "" && SelectedFilter.endDate)
    ) {
      throw new Error("Please select a valid date range");
    } else {
      return true;
    }
  };

  const generated_api_url = () => {
    const { party, item, orderno, status, startDate, endDate } =
      selectedisFilter;
    const apiUrl1 = `${apiUrl}/GetOrderStatusReport?AccCode=${encodeURIComponent(
      party
    )}&ItemCode=${encodeURIComponent(item)}&OrderNo=${encodeURIComponent(
      orderno
    )}&Status=${encodeURIComponent(status)}&StartDate=${encodeURIComponent(
      startDate
    )}&EndDate=${encodeURIComponent(endDate)}`;
    console.log("apiUrl1", apiUrl1);
    return apiUrl1;
  };

  const handle_filtered_Data = async () => {
    setIsLoading(true);
    try {
      if (!ValidationApplied(selectedisFilter)) return;
      const resp = await fetch(generated_api_url());
      const json = await resp.json();
      console.log("json", json);
      if (json.status === 1) {
        setTableData(handle_set_data_table(json));
      } else {
        toast.warning(json.msg);
        setTableData([]);
      }
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
                  <TableDataSearch
                    onSearch={(e) =>
                      setTableDataSearch(searchingdata(e, tableData))
                    }
                  />
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
                              onChange={(e, name) =>
                                handleSelectChange(e, name)
                              }
                              placeholder="Choose Party"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            {/* <StopCircle className="info-img" /> */}
                            <Select
                              className="select"
                              name="item"
                              options={itemOpts}
                              onChange={(e, name) =>
                                handleSelectChange(e, name)
                              }
                              placeholder="Choose Items"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            {/* <StopCircle className="info-img" /> */}
                            <Select
                              className="select"
                              name="orderno"
                              options={orderNoOpts}
                              onChange={(e, name) =>
                                handleSelectChange(e, name)
                              }
                              placeholder="Choose Order No"
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
                              onChange={(e, name) =>
                                handleSelectChange(e, name)
                              }
                              placeholder="Choose Status"
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
                                className=" form-control filterdatepicker"
                                selected={selectedDate.startDate}
                                onChange={(e, datestring) =>
                                  handleDeteChange(e, datestring, "startDate")
                                }
                                dateFormat={dateFormat}
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
                                className="form-control filterdatepicker"
                                selected={selectedDate.endDate}
                                onChange={(e, datestring) =>
                                  handleDeteChange(e, datestring, "endDate")
                                }
                                dateFormat={dateFormat}
                                placeholder="To Date"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2 col-sm-6 col-12">
                          <div className="input-blocks">
                            <button
                              className="btn btn-filters ms-auto"
                              onClick={handle_filtered_Data}
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
                <Table
                  columns={columns}
                  dataSource={tableDataSearch || tableData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order_Status_Report;
