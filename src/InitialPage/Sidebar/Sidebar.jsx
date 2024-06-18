import React, { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
// import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import HorizontalSidebar from "./horizontalSidebar";
import CollapsedSidebar from "./collapsedSidebar";
import { toast } from "react-toastify";
import { apiUrl } from "../../core/json/api";
import { getCurrentUsers } from "../../core/json/functions";
import Loader_2 from "../../feature-module/loader-2/loader-2";
import { SidebarData, iconMapping } from "../../core/json/siderbar_data";

const Sidebar = () => {
  // const SidebarData = useSelector((state) => state.sidebar_data);
  const Location = useLocation();
  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarData, setSidebarData] = useState([]);

  const toggleSidebar = (title) => {
    if (title == subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem) => {
    if (subitem == subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const currentuser = getCurrentUsers();
    getSidebarData(`${apiUrl}/GetUserMenusResponse/${currentuser?.userId}`);
    // console.log("sidebarData", sidebarData);
  }, []);

  const getSidebarData = async (url) => {
    try {
      const resp = await fetch(url);
      const json = await resp.json();
      // console.log("json", json);
      if (json.status === 1) setSidebarData(json.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const renderIcon = (iconName) => {
  //   const IconComponent = iconMapping[iconName];
  //   return IconComponent ? <IconComponent /> : null;
  // };

  return (
    <div>
      <div className="sidebar" id="sidebar">
        {isLoading && <Loader_2 />}
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {/* Main Menu */}
                {sidebarData?.map((mainLabel, index) => (
                  <li className="submenu-open" key={index}>
                    <h6 className="submenu-hdr" key={mainLabel?.label}>
                      {mainLabel?.label}
                    </h6>
                    <ul key={index++}>
                      {mainLabel?.submenuItems?.map((title, i) => {
                        let link_array = [];
                        title?.submenuItems?.map((link) => {
                          link_array?.push(link?.link);
                          if (link?.submenu) {
                            link?.submenuItems?.map((item) => {
                              link_array?.push(item?.link);
                            });
                          }
                          return link_array;
                        });
                        title.links = link_array;
                        return (
                          <>
                            <li className="submenu" key={i}>
                              <Link
                                to={title?.link}
                                state={{ permissions: title?.permissions }}
                                onClick={() => toggleSidebar(title?.label)}
                                className={`${
                                  subOpen == title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(Location.pathname)
                                    ? "active"
                                    : ""
                                }
                            `}
                              >
                                {/* <Grid /> */}
                                {iconMapping[
                                  title?.icon
                                    .replace("<Icon.", "")
                                    .replace(" />", "")
                                ] || null}
                                {/* {renderIcon(title?.icon)} */}
                                {/* {title?.icon} */}
                                <span>{title?.label}</span>
                                <span
                                  className={title?.submenu ? "menu-arrow" : ""}
                                />
                              </Link>
                              <ul
                                style={{
                                  display:
                                    subOpen == title?.label ? "block" : "none",
                                }}
                              >
                                {title?.submenuItems?.map(
                                  (item, titleIndex) => (
                                    <li
                                      className="submenu submenu-two"
                                      key={titleIndex}
                                    >
                                      {/* {item.lebel} */}
                                      <Link
                                        to={item?.link}
                                        state={{
                                          permissions: item?.permissions,
                                        }}
                                        className={
                                          item?.submenuItems
                                            ?.map((link) => link?.link)
                                            .includes(Location.pathname) ||
                                          item?.link == Location.pathname
                                            ? "active"
                                            : ""
                                        }
                                        onClick={() => {
                                          toggleSubsidebar(item?.label);
                                        }}
                                      >
                                        {item?.label}
                                        <span
                                          className={
                                            item?.submenu ? "menu-arrow" : ""
                                          }
                                        />
                                      </Link>
                                      <ul
                                        style={{
                                          display:
                                            subsidebar == item?.label
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        {item?.submenuItems?.map(
                                          (items, titleIndex) => (
                                            <li key={titleIndex}>
                                              {/* {item.lebel} */}
                                              <Link
                                                to={items?.link}
                                                state={{
                                                  permissions:
                                                    items?.permissions,
                                                }}
                                                className={`${
                                                  subsidebar == items?.label
                                                    ? "submenu-two subdrop"
                                                    : "submenu-two"
                                                } ${
                                                  items?.submenuItems
                                                    ?.map((link) => link.link)
                                                    .includes(
                                                      Location.pathname
                                                    ) ||
                                                  items?.link ==
                                                    Location.pathname
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                {items?.label}
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </li>
                                  )
                                )}
                              </ul>
                            </li>
                          </>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
      <HorizontalSidebar />
      <CollapsedSidebar />
    </div>
  );
};

export default Sidebar;
