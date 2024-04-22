import React, { useState } from "react";
import Loader_2 from "../../../../feature-module/loader-2/loader-2";

const AcceptOrders = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div
        className="modal fade"
        id="OrdAcceptDetailsEdit"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                {isLoading && <Loader_2 />}
                <div className="modal-header custom-modal-header">
                  <div className="page-header mb-0">
                    <div className="page-title">
                      <h4>Order Accept Items Details</h4>
                      {/* <h6>View Your Orders Received Items Details</h6> */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcceptOrders;
