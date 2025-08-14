"use client";
import BitePointLogo from "@/shared/components/Logo";
import ProfileDropdown from "@/modules/Kitchen/components/ProfileDropdown";
import { useOrderDataStore } from "../store/useOrderDataStore";
import ScalingCircle from "@/modules/Kitchen/components/ScalingCircle";
export default function KitchenOrderHeader() {
  const { orders } = useOrderDataStore();
  return (
    <div className=" border-b border-gray-200 p-4">
      <div className="flex items-center justify-center lg:justify-between">
        <BitePointLogo />
        <div className="lg:flex hidden  items-center gap-3">
          <p className="font-semibold">Kitchen Orders </p>
          <ScalingCircle />
        </div>
        <div className="lg:block hidden">
          <ProfileDropdown />
        </div>
      </div>
      <div className="lg:hidden mt-2 justify-between flex items-center gap-3">
        <div className="">
          <ScalingCircle />
        </div>
        <p className="font-semibold">Kitchen Orders </p>
        <ProfileDropdown />
      </div>
    </div>
  );
}
