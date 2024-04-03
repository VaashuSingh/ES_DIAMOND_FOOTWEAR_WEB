/* eslint-disable react/prop-types */
import React from "react";
import { ScaleLoader } from "react-spinners";
import { PropTypes } from "prop-types";
import "../../style/css/global.css";

const Loader_2 = ({ loading }) => {
  return (
    <div className="container_loading">
      <ScaleLoader color="#ff7b00" loading={loading} />
    </div>
  );
};

// Loader_2.propTypes = {
//   loading: PropTypes.bool.isRequired,
// };

export default Loader_2;
