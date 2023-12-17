import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Warehouse, User, Truck, LogOut } from "lucide-react";

import { UserContext } from "@/App";
import { logOutUser } from "@/actions/session";
const Sidebar = () => {
  const {
    userAuth: { role },
    setUserAuth,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUserAuth({
      accessToken: "",
      email: "",
      role: "",
      username: "",
    });
    logOutUser();
    navigate("/login");
  };
  return (
    <div className="bg-blue-600">
      <div className="sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900">
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <Home className="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600" />
            <h1 className="font-bold text-gray-200 text-[15px] ml-3">
              Admin Ekspedisi
            </h1>
            <i className="bi bi-x cursor-pointer ml-28 lg:hidden"></i>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]"></div>
        </div>
        <div className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white">
          <i className="bi bi-search text-sm"></i>
          <input
            type="text"
            placeholder="Search"
            className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
          />
        </div>
        <NavLink
          to={"/"}
          className={({ isActive }: { isActive: boolean }) =>
            `p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white ${
              isActive ? "bg-blue-600" : ""
            }`
          }
        >
          <Home className="w-6 h-6 text-white" />
          <span className="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
        </NavLink>

        <NavLink
          to={"/gudang"}
          className={({ isActive }: { isActive: boolean }) =>
            `p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white ${
              isActive ? "bg-blue-600" : ""
            }`
          }
        >
          <Warehouse className="w-6 h-6 text-white" />
          <span className="text-[15px] ml-4 text-gray-200 font-bold">
            Gudang
          </span>
        </NavLink>
        {role === "ROLE_USER" ? (
          <NavLink
            to={"/lacak"}
            className={({ isActive }: { isActive: boolean }) =>
              `p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <Warehouse className="w-6 h-6 text-white" />
            <span className="text-[15px] ml-4 text-gray-200 font-bold">
              Lacak pesanan
            </span>
          </NavLink>
        ) : (
          ""
        )}

        {role === "ROLE_ADMIN" ? (
          <NavLink
            to={"/pengirim"}
            className={({ isActive }: { isActive: boolean }) =>
              `p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <User className="w-6 h-6 text-white" />
            <span className="text-[15px] ml-4 text-gray-200 font-bold">
              Pengirim
            </span>
          </NavLink>
        ) : (
          ""
        )}
        {role === "ROLE_ADMIN" ? (
          <NavLink
            to={"/pengiriman"}
            className={({ isActive }: { isActive: boolean }) =>
              `p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <Truck className="w-6 h-6 text-white" />
            <span className="text-[15px] ml-4 text-gray-200 font-bold">
              Pengiriman
            </span>
          </NavLink>
        ) : (
          ""
        )}
        <hr className="my-4 bg-gray-600 h-[1px]" />
        <button
          type="button"
          className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-red-500 text-white w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-6 h-6 text-white" />
          <span className="text-[15px] ml-4 text-gray-200 font-bold">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
