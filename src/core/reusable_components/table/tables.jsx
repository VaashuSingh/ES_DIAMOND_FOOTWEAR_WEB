/* eslint-disable react/prop-types */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../img/imagewithbasebath";
import { ArrowLeft, ChevronUp, PlusCircle, RotateCcw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../redux/action";
import Input from "antd/es/input/Input";
import { all_routes } from "../../../Router/all_routes";

const PageTopHeaderLeft = ({ title, subTitle }) => {
  return (
    <div className="add-item d-flex">
      <div className="page-title">
        <h4>{title}</h4>
        <h6>{subTitle}</h6>
      </div>
    </div>
  );
};

const TableHeadButton = ({ title, target, handleModalOpen }) => {
  return (
    <div className="page-btn">
      <Link
        to="#"
        className="btn btn-added"
        data-bs-toggle="modal"
        data-bs-target={`#${target}`}
        onClick={handleModalOpen}
      >
        <PlusCircle className="me-2" />
        {title}
      </Link>
    </div>
  );
};

const PageTopRight = ({ onRefresh }) => {
  const dispatch = useDispatch();
  const toogleHeader = useSelector((state) => state.toggle_header);

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

  return (
    <>
      <ul className="table-top-head">
        <li>
          <OverlayTrigger placement="top" overlay={renderTooltip}>
            <Link>
              <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
            </Link>
          </OverlayTrigger>
        </li>
        <li>
          <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
            <a data-bs-toggle="tooltip" data-bs-placement="top">
              <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
            </a>
          </OverlayTrigger>
        </li>
        <li>
          <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
            <a data-bs-toggle="tooltip" data-bs-placement="top">
              <i data-feather="printer" className="feather-printer" />
            </a>
          </OverlayTrigger>
        </li>
        <li>
          <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
            <a
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              onClick={onRefresh}
            >
              <RotateCcw />
            </a>
          </OverlayTrigger>
        </li>
        <li>
          <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
            <a
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              id="collapse-header"
              className={toogleHeader ? "active" : ""}
              onClick={() => {
                dispatch(setToogleHeader(!toogleHeader));
              }}
            >
              <ChevronUp />
            </a>
          </OverlayTrigger>
        </li>
      </ul>
    </>
  );
};

const TableDataSearch = ({ onSearch }) => {
  return (
    <div className="search-input">
      <Input.Search
        className="form-control-sm formsearch search-icon search-input-head px-0"
        placeholder="Search ..."
        allowClear
        enterButton
        onSearch={onSearch}
      />
    </div>
  );
};

const renderActions = ({ record }) => {
  console.log("record", record);
  const navigate = useNavigate();
  const routes = all_routes;
  // const { id, series, date, vchno, customer } = record;

  const handleRowClick = (record) => {
    navigate(routes.ordacceptitemsdetviews, {
      state: {
        code: record?.id,
        headers: {
          series: record?.series,
          vchdate: record?.date,
          vchno: record?.vchno,
          party: record?.customer,
        },
      },
    });
  };

  return (
    <td className="action-table-data">
      <div className="edit-delete-action">
        <a
          className="me-2 p-2"
          // to={routes.ordacceptitemsdetviews}
          // state={{
          //   code: id,
          //   headers: {
          //     series: series,
          //     vchdate: date,
          //     vchno: vchno,
          //     party: customer,
          //   },
          // }}
          // onClick={() => handleRowClick(record)}
        >
          <i data-feather="eye" className="feather feather-eye action-eye" />
        </a>
      </div>
    </td>
  );
};

const GoBackToPage = (props) => {
  const data = useSelector((state) => state.toggle_header);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  return (
    <ul className="table-top-head">
      <li>
        <div className="page-btn">
          <a className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="me-2" />
            {`Back ${props.title}`}
          </a>
        </div>
      </li>
      <li>
        <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
          <a
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Collapse"
            id="collapse-header"
            className={data ? "active" : ""}
            onClick={() => {
              dispatch(setToogleHeader(!data));
            }}
          >
            <ChevronUp className="feather-chevron-up" />
          </a>
        </OverlayTrigger>
      </li>
    </ul>
  );
};

export {
  PageTopHeaderLeft,
  PageTopRight,
  TableHeadButton,
  TableDataSearch,
  renderActions,
  GoBackToPage,
}; // Exporting both functions together
// because they are used in the same context.
