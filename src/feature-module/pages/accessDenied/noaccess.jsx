import React from "react";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { all_routes } from "../../../Router/all_routes";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  const route = all_routes;
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="error-box">
          <div className="error-img">
            <ImageWithBasePath
              src="assets/img/authentication/under-maintenance.png"
              className="img-fluid"
              alt
            />
          </div>
          {/* <h3 className="h2 mb-3">We are Under Maintenance</h3> */}
          <h3 className="h2 mb-3"> Access Denied for Viewing This Page</h3>
          <p>
            Apologies for any inconvenience caused. Currently, there are no
            views for this content from your account. We are working diligently
            to ensure you receive access soon. Meanwhile, please explore other
            sections of our platform. Your patience is greatly appreciated.
          </p>
          <Link to={route.dashboard} className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
