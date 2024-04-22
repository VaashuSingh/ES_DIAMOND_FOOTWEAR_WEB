/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../img/imagewithbasebath";
import { ArrowLeft, ChevronUp, PlusCircle, RotateCcw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../redux/action";
import Input from "antd/es/input/Input";

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

const PageTopHeaderRight = ({ path }) => {
  return (
    <ul className="table-top-head">
      <li>
        <div className="page-btn">
          <Link to={path} className="btn btn-secondary">
            <ArrowLeft className="me-2" />
            Back to Product
          </Link>
        </div>
      </li>
      <li>
        {/* <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
          <Link
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
          </Link>
        </OverlayTrigger> */}
      </li>
    </ul>
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

const TableRefresh = ({ onRefresh }) => {
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
            <Link data-bs-toggle="tooltip" data-bs-placement="top">
              <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
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
            <Link
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              onClick={onRefresh}
            >
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
              className={toogleHeader ? "active" : ""}
              onClick={() => {
                dispatch(setToogleHeader(!toogleHeader));
              }}
            >
              <ChevronUp />
            </Link>
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

export {
  PageTopHeaderLeft,
  PageTopHeaderRight,
  TableHeadButton,
  TableRefresh,
  TableDataSearch,
}; // Exporting both functions together
// because they are used in the same context.
