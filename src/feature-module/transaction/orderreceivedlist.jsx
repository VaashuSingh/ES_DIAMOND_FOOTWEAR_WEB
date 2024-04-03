/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { ChevronUp, RotateCcw } from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import {
  Filter,
  PlusCircle,
  Sliders,
  StopCircle,
  User,
  Zap,
} from "react-feather";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import OrdApproval from "../../core/modals/transaction/orderreceivedapproval";
import { apiUrl } from "../../core/json/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader_2 from "../loader-2/loader-2";
import No_Images from "../../core/assets/img/no-img.png";
import { DatePicker } from "antd";
import OrderReceivedView from "../../core/modals/transaction/orderreceivedview";
import moment from "moment/moment";

const OrdersReceivedList = () => {
  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const series = [
    { value: "Choose Series", label: "Choose Series" },
    { value: "Lilly", label: "Lilly" },
    { value: "Benjamin", label: "Benjamin" },
  ];
  const status = [
    { value: "Choose Name", label: "Choose Status" },
    { value: "Active", label: "Active" },
    { value: "InActive", label: "InActive" },
  ];
  const role = [
    { value: "Choose Role", label: "Choose Role" },
    { value: "AcStore Keeper", label: "Store Keeper" },
    { value: "Salesman", label: "Salesman" },
  ];
  const [selectedstartDate, setSelectedstartDate] = useState(new Date());
  const [selectedendDate, setSelectedendDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [seriesOpt, setSeriesOpt] = useState([]);
  const [partyOpt, setPartyOpt] = useState([]);
  const [selectedisFilterVal, setselectedisFilterVal] = useState({
    series: "Choose Series",
    party: "Choose Party",
    startDate: "",
    endDate: "",
  });

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  // const dataSource = useSelector((state) => state.userlist_data);

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
    handleFieldsClear();
  };

  // console.log("selectedstartDate", selectedstartDate);
  const handleFieldsClear = () => {
    // console.log("hello");
    setselectedisFilterVal({
      series: "Choose Series",
      party: "Choose Party",
      startDate: "",
      endDate: "",
    });
  };

  const handleSelectedSeries = (selectedOption) => {
    if (!selectedOption || selectedOption === "Choose Series") return;
    setselectedisFilterVal({ ...selectedisFilterVal, series: selectedOption });
  };

  const handleSelectedParty = (selectedOption) => {
    setselectedisFilterVal((prev) => ({
      ...prev,
      party: selectedOption?.value || 0,
    }));
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

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

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
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#ordreceivedDetails"
              onClick={() => OnRowHandleClick(record)}
            >
              <i
                data-feather="eye"
                className="feather feather-eye action-eye"
              />
            </Link>
            <Link
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
            </Link>
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
      // console.log("data", json);
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
        // Extract unique party options and sort alphabetically
        const uniqueParty = Array.from(new Set(data.map((opt) => opt.accCode)))
          .map((value) => data.find((opt) => opt.accCode === value))
          .map((opt) => ({
            value: opt.accCode,
            label: opt.accName,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
        setPartyOpt(uniqueParty);

        const uniqueSeries = Array.from(new Set(data.map((opt) => opt.sCode)))
          .map((value) => data.find((opt) => opt.sCode === value))
          .map((opt) => ({
            value: opt.sCode,
            label: opt.sName,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
        setSeriesOpt(uniqueSeries);
      } else {
        toast.error(data.msg);
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
      if (
        (selectedisFilterVal.startDate && selectedisFilterVal.endDate == "") ||
        (selectedisFilterVal.startDate == "" && selectedisFilterVal.endDate)
      ) {
        throw new Error("Please select a valid Date Range");
      } else if (
        !selectedisFilterVal.series === "Choose Series" &&
        !selectedisFilterVal.party === "Choose Party" &&
        !selectedisFilterVal.startDate &&
        !selectedisFilterVal.endDate
      ) {
        throw new Error("Please select a valid Filter Range");
      }
      const apiurl = `${apiUrl}/GetOrderReceivedDetails/${selectedisFilterVal.series}/${selectedisFilterVal.party}/${selectedisFilterVal.startDate}/${selectedisFilterVal.endDate}`;
      console.log("apiurl", apiurl);
      const res = await fetch(apiurl);
      const json = await res.json();
      if (json.status === 1) {
        const tableList = data.data.map((item) => ({
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
      } else {
        toast.error(json.msg);
      }
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

  return (
    <div>
      {loading && <Loader_2 />}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Order Received</h4>
                <h6>Manage Your Orders</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link>
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <i data-feather="printer" className="feather-printer" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <RotateCcw />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    className={data ? "active" : ""}
                    onClick={() => {
                      dispatch(setToogleHeader(!data));
                    }}
                  >
                    <ChevronUp />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="Search"
                      className="form-control form-control-sm formsearch"
                    />
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
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
                {/* <div className="form-sort">
                  <Sliders className="info-img" />
                  <Select
                    className="select"
                    options={oldandlatestvalue}
                    placeholder="Newest"
                  />
                </div> */}
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
                                        option.label ===
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
                                selected={selectedstartDate}
                                onChange={handleFormDateChange}
                                type="date"
                                className="filterdatepicker"
                                dateFormat={{
                                  format: "dd-MM-yyyy",
                                  type: "Mask",
                                }}
                                placeholder="Form Date"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5 col-sm-6 col-12">
                          <div className="input-blocks">
                            <div className="input-groupicon">
                              <DatePicker
                                selected={selectedendDate}
                                onChange={handleToDateChange}
                                type="date"
                                className="filterdatepicker"
                                // dateFormat="dd-MM-yyyy"
                                dateFormat={{
                                  format: "dd-MM-yyyy",
                                  type: "Mask",
                                }}
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
                  dataSource={tableData}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
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
