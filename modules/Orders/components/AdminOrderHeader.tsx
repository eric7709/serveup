"use client";

import NotificationDropdown from "@/modules/Kitchen/components/NotificationDropdown";
import ActiveRevenue from "./ActiveRevenue";
import ProfileDropdown from "@/modules/Kitchen/components/ProfileDropdown";
import SearchText from "@/modules/Kitchen/components/SearchText";
import StatusDropdown from "@/modules/Kitchen/components/StatusDropdown";
import DateDropdown from "@/modules/Kitchen/components/DateDropdown";
import SortDropdown from "@/modules/Kitchen/components/SortDropdown";
import ScalingCircle from "@/modules/Kitchen/components/ScalingCircle";
import AdminTitle from "@/shared/components/AdminTitle";
import { Divide as Hamburger } from "hamburger-react";
import { useUIStore } from "@/store/useUIStore";
import { Filter } from "lucide-react";
import { useState } from "react";
import PaymentMethodDropdown from "@/modules/Kitchen/components/PaymentMethodDropdown";

export default function AdminOrderHeader() {
  const { toggleDrawer, drawerOpened } = useUIStore();
  const [isOpened, setOpen] = useState(false);
  return (
    <div className=" z-30 relative ">
      <div className="hidden lg:block">
        <div className="flex px-3 items-center justify-between h-16 border-b border-gray-300">
          <AdminTitle title="Orders" />
          <div className="flex items-center gap-5">
            <ActiveRevenue />
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>
        <div className="grid border-b border-gray-300 p-3 gap-3 grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]">
          <SearchText />
          <StatusDropdown />
          <DateDropdown />
          <SortDropdown />
          <PaymentMethodDropdown />
          <ScalingCircle removemargin />
        </div>
      </div>
      <div className="lg:hidden">
        <div className="flex h-16 items-center pr-3 justify-between">
          <Hamburger size={18} toggled={drawerOpened} toggle={toggleDrawer} />
          <AdminTitle title="Orders" />
          <Filter onClick={() => setOpen(!isOpened)} />
        </div>
        <div
          className={`grid ${isOpened ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} duration-300`}
        >
          <div
            className={`grid  border-b duration-300 border-gray-300 ${isOpened ? "p-3 gap-3" : "overflow-hidden"} `}
          >
            <SearchText zIndex="z-[20]" />
            <StatusDropdown zIndex="z-[18]" />
            <DateDropdown zIndex="z-[16]" />
            <SortDropdown zIndex="z-[12]" />
            <PaymentMethodDropdown zIndex="z-[10]"/>

            <div className="flex items-center justify-center">
              <ScalingCircle removemargin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
