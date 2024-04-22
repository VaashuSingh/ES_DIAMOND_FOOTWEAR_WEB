/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link, Route, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Filter, StopCircle, User } from "react-feather";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../../core/pagination/datatable";
import OrdApproval from "../../../core/modals/transaction/order-accept/approvalorders";
import { apiUrl } from "../../../core/json/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader_2 from "../../loader-2/loader-2";
import { DatePicker } from "antd";
import OrderReceivedView from "../../../core/modals/transaction/order-accept/vieworders";
import moment from "moment/moment";
import {
  PageTopHeaderLeft,
  TableDataSearch,
  TableRefresh,
  TableHeadButton,
} from "../../../core/reusable_components/table/TableHead";
import { all_routes } from "../../../Router/all_routes";

const OrdersReceivedList = () => {
  const [loading, setLoading] = useState(false);
  const [selectedstartDate, setSelectedstartDate] = useState(null);
  const [selectedendDate, setSelectedendDate] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [seriesOpt, setSeriesOpt] = useState([]);
  const [partyOpt, setPartyOpt] = useState([]);
  const [searchTable, setSearchTable] = useState(null);
  const [selectedisFilterVal, setselectedisFilterVal] = useState({
    series: 0,
    party: 0,
    startDate: "",
    endDate: "",
  });

  const routes = all_routes;

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
    handleFieldsClear();
  };

  // console.log("selectedstartDate", selectedstartDate);
  const handleFieldsClear = () => {
    setSelectedstartDate(null);
    setSelectedendDate(null);
    setselectedisFilterVal({
      series: 0,
      party: 0,
      startDate: "",
      endDate: "",
    });
  };

  const handleSelectedSeries = (selectedOption) => {
    if (!selectedOption || selectedOption.label === "") return;
    setselectedisFilterVal({
      ...selectedisFilterVal,
      series: selectedOption.value,
    });
  };

  const handleSelectedParty = (selectedOption) => {
    if (!selectedOption || selectedOption.label === "") return;
    setselectedisFilterVal({
      ...selectedisFilterVal,
      party: selectedOption.value,
    });
  };

  const handleFormDateChange = (date, datestring) => {
    setSelectedstartDate(date);
    setselectedisFilterVal((prev) => ({
      ...prev,
      startDate: date ? moment(datestring).format("DD-MM-YYYY") : "", // Format the date if it's not null
    }));
  };

  const handleToDateChange = (date, datestring) => {
    setSelectedendDate(date);
    setselectedisFilterVal((prev) => ({
      ...prev,
      endDate: date ? moment(datestring).format("DD-MM-YYYY") : "", // Format the date if it's not null
    }));
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },

    {
      title: "Series",
      dataIndex: "series",
      sorter: (a, b) => a.series.length - b.series.length,
    },
    {
      title: "Vch No.",
      dataIndex: "vchno",
      sorter: (a, b) => a.vchno.length - b.vchno.length,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      sorter: (a, b) => a.customer.length - b.customer.length,
    },
    {
      title: "Mat Center",
      dataIndex: "matcenter",
      sorter: (a, b) => a.createdon.length - b.createdon.length,
    },
    {
      title: "Qty.",
      dataIndex: "totqty",
      sorter: (a, b) => a.qty.length - b.qty.length,
    },
    {
      title: "Alt. Qty. ",
      dataIndex: "totaltqty",
      sorter: (a, b) => a.altqty.length - b.altqty.length,
    },
    {
      title: "Amount",
      dataIndex: "totamt",
      sorter: (a, b) => a.length - b.amount.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <td className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to={routes.ordacceptitemsdetviews}
              state={{ code: record?.id }}
              // onClick={() =>
              //   handleRowClick(record.id, routes.ordacceptitemsdetviews)
              // }
            >
              <i
                data-feather="eye"
                className="feather feather-eye action-eye"
              />
            </Link>
            {/* <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#ordapproval"
              onClick={() => OnRowHandleClick(record)}
            >
              <i
                data-feather="sheild"
                className="feather feather-shield shield"
              />
            </Link> */}
          </div>
        </td>
      ),
    },
  ];

  useEffect(() => {
    getTableData(`${apiUrl}/GetOrderReceivedDetails`);
  }, [isFilterVisible]);

  const getTableData = async (url) => {
    try {
      setLoading(true);
      const resp = await fetch(url);
      const json = await resp.json();
      const data = json.data;
      console.log("data", json);
      if (json.status === 1) {
        const tableList = data.map((item) => ({
          id: item.vchCode,
          date: item.vchDate,
          series: item.sName,
          vchno: item.vchNo,
          customer: item.accName,
          matcenter: item.mcName,
          totqty: item.totQty,
          totaltqty: item.totAltQty,
          totamt: item.totAmt,
        }));

        setTableData(tableList);
        // Add "All" option to the beginning of the options array

        const uniqueSeries = Array.from(new Set(data.map((opt) => opt.sCode)))
          .map((value) => data.find((opt) => opt.sCode === value))
          .map((opt) => ({
            value: opt.sCode,
            label: opt.sName,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

        const optionsWithAll1 = [
          { value: "0", label: "Select All" },
          ...uniqueSeries,
        ];
        setSeriesOpt(optionsWithAll1);

        // Extract unique party options and sort alphabetically
        const uniqueParty = Array.from(new Set(data.map((opt) => opt.accCode)))
          .map((value) => data.find((opt) => opt.accCode === value))
          .map((opt) => ({
            value: opt.accCode,
            label: opt.accName,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
        const optionsWithAll2 = [
          { value: "0", label: "Select All" },
          ...uniqueParty,
        ];
        setPartyOpt(optionsWithAll2);
      } else {
        toast.error(() => data.msg);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const OnRowHandleClick = (selectedRecord) => {
    setSelectedRecord("");
    setSelectedRecord(selectedRecord);
  };

  const handleSubmitSuccess = () => {
    getTableData(`${apiUrl}/GetOrderReceivedDetails`);
    setSelectedRecord(null);
  };

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

  // const applyFilter = async () => {
  //   setLoading(true);
  //   getTableData(`${apiUrl}/GetOrderReceivedDetails`);
  //   let filterData = [...tableData];
  //   if (selectedisFilterVal.startDate && selectedisFilterVal.endDate) {
  //     const startDate_filter = selectedisFilterVal.startDate;
  //     const endDate_filter = selectedisFilterVal.endDate;
  //     console.log("startDate_filter", startDate_filter);

  //     console.log("endDate_filter", endDate_filter);

  //     const resp = await fetch(`${apiUrl}/GetOrderReceivedDetails`);
  //     const json = await resp.json();
  //     const data = json.data;
  //     console.log("data", data);
  //     if (json.status === 1) {
  //       // Filter data based on date range
  //       filterData = data.filter((row) => {
  //         return (
  //           row.vchDate >= startDate_filter && row.vchDate <= endDate_filter
  //         );
  //       });
  //     } else {
  //       toast.error(data.msg);
  //     }
  //   }
  //   console.log("filterData", filterData);
  //   setTableData(filterData);
  //   setLoading(false);
  // };

  const applyFilter = async () => {
    try {
      setLoading(true);
      if (!ValidationApplied(selectedisFilterVal)) return;
      const { series, party, startDate, endDate } = selectedisFilterVal;
      // console.log("selectedisFilterVal", selectedisFilterVal);
      const apiUrl1 = `${apiUrl}/GetOrderReceivedDetails?Series=${encodeURIComponent(
        series
      )}&Party=${encodeURIComponent(party)}&StartDate=${encodeURIComponent(
        startDate
      )}&EndDate=${encodeURIComponent(endDate)}`;
      const res = await fetch(apiUrl1);
      const json = await res.json();
      const tableList = json.data.map((item) => ({
        id: item.vchCode,
        date: item.vchDate,
        series: item.sName,
        vchno: item.vchNo,
        customer: item.accName,
        matcenter: item.mcName,
        totqty: item.totQty,
        totaltqty: item.totAltQty,
        totamt: item.totAmt,
      }));
      setTableData(tableList);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          className: "btn btn-success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        MySwal.close();
      }
    });
  };

  // Pass getTableData function to child component
  const handleRefresh = () => {
    getTableData(`${apiUrl}/GetOrderReceivedDetails`);
  };

  //Searching Input Box In Table
  const handleSearch = (value) => {
    const filteredData = tableData.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setSearchTable(filteredData);
  };

  // const navigate = useNavigate();

  // const handleRowClick = (rowId, path) => {
  //   // Navigate to the second form and pass row ID and path as state
  //   console.log("row clicked", rowId);
  //   console.log("row path", path);

  //   navigate("/order-accept-items-details", { state: { rowId, path } });
  //   // navigate("/second-form", { state: { rowId, path } });
  // };

  return (
    <div>
      {loading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            {/* Table top header component */}
            <PageTopHeaderLeft
              title={`Order Accept`}
              subTitle={`Order Accept Busy Voucher Details`}
            />
            <TableRefresh onRefresh={handleRefresh} />
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <TableDataSearch onSearch={handleSearch} />
                </div>
                {/* /Filter Icon*/}
                <div className="search-path">
                  <Link
                    className={`btn btn-filter ${
                      isFilterVisible ? "setclose" : ""
                    }`}
                    id="filter_search"
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
                  </Link>
                </div>
                {/* /Filter Icon*/}
              </div>
              {/* /Filter */}
              <div
                className={`card${isFilterVisible ? " visible" : ""}`}
                id="filter_inputs"
                style={{ display: isFilterVisible ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            <User className="info-img" />
                            <Select
                              className="select"
                              options={seriesOpt}
                              name="series"
                              value={
                                (selectedisFilterVal.series
                                  ? seriesOpt.find(
                                      (option) =>
                                        option.value ===
                                        selectedisFilterVal.series
                                    )
                                  : "") || null
                              }
                              onChange={handleSelectedSeries}
                              placeholder="Choose Series"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            <StopCircle className="info-img" />
                            <Select
                              className="select"
                              value={
                                (selectedisFilterVal.party
                                  ? partyOpt.find(
                                      (option) =>
                                        option.value ===
                                        selectedisFilterVal.party
                                    )
                                  : "") || null
                              }
                              options={partyOpt}
                              onChange={handleSelectedParty}
                              placeholder="Choose Party"
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
                                value={selectedstartDate}
                                selected={selectedstartDate}
                                onChange={handleFormDateChange}
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
                                value={selectedendDate}
                                selected={selectedendDate}
                                onChange={handleToDateChange}
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
                              onClick={applyFilter}
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
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={searchTable || tableData}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /Order Received list */}
        </div>
      </div>
      <OrderReceivedView record={selectedRecord} />
      <OrdApproval
        record={selectedRecord}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
};

export default OrdersReceivedList;
