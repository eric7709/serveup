"use client";

import { useEffect } from "react";
import { Clock, Home, Settings, Table, Utensils, Users, Tags, ClipboardList } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import NavItem from "./NavItem";
import BitePointLogo from "./Logo";
import { useLogout } from "@/modules/Employees/hooks/useEmployeesServices";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/Employees/hooks/useAuth";
import { useUIStore } from "@/store/useUIStore";

const menuConfig = [
  { icon: <Home size={14} />, label: "Dashboard", link: "/admin/dashboard" },
  { icon: <Users size={14} />, label: "Staff Management", link: "/admin/employees" },
  { icon: <Table size={14} />, label: "Tables & Allocation", link: "/admin/tables" },
  { icon: <Utensils size={14} />, label: "Menu Management", link: "/admin/menus" },
  { icon: <Tags size={14} />, label: "Category Management", link: "/admin/categories" },
  { icon: <ClipboardList size={14} />, label: "Order Management", link: "/admin/orders" },
  { icon: <Clock size={14} />, label: "Sales Reports", link: "/admin/statistics" },
  { icon: <Settings size={14} />, label: "Settings", link: "/admin/settings" },
];

export default function Sidebar() {
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { drawerOpened, closeDrawer } = useUIStore();

  useEffect(() => {
    console.log("Sidebar drawerOpened:", drawerOpened);
  }, [drawerOpened]);

  return (
    <div
      className={`fixed lg:relative w-full flex ${
        drawerOpened ? "left-0 opacity-100 visible" : "left-[-150vw] lg:left-0 lg:opacity-100 lg:visible opacity-0 invisible"
      } duration-300 top-0 ${drawerOpened ? "z-50" : "z-10"} lg:flex flex-col justify-between h-screen lg:w-60 bg-white border-r border-gray-200`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 px-4 h-16 border-b border-gray-200">
          <BitePointLogo />
          <FaTimes
            className="lg:hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Close drawer clicked");
              closeDrawer();
            }}
          />
        </div>
        <nav className="px-3 py-2.5">
          <div className="flex flex-col gap-1">
            {menuConfig.map((item, i) => (
              <NavItem key={`${item.label}-${i}`} {...item} />
            ))}
            <NavItem
              icon={<RiLogoutCircleRLine size={14} />}
              label="Logout"
              onClick={() => {
                logout();
                router.push("/auth/login");
              }}
            />
          </div>
        </nav>
      </div>
      <div className="border-t mt-auto flex items-end border-gray-100 p-2.5">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <img src="/avatar.png" alt="User" className="h-8 rounded-full ring-2 ring-gray-100" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {loading ? "Loading..." : user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Guest User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}