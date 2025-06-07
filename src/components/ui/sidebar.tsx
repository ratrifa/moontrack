import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  NotebookPen,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  Settings,
  LogOut,
  Heart,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const sidebarItems = [
  { icon: <LayoutDashboard />, label: "Dashboard", path: "/dashboard" },
  { icon: <CreditCard />, label: "Transaksi", path: "/transaction" },
  { icon: <Heart />, label: "Wishlist", path: "/wishlist" },
  { icon: <NotebookPen />, label: "Notes", path: "/notes" },
  //{ icon: <FileBarChart />, label: "Laporan", path: "/report" },
];

function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path) && pathname !== "/";
  };

  const handleLogout = () => {
    toast.success("Logout successfull, have a nice day 👋")
    localStorage.removeItem("user")
    navigate("/login");
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user");
      if (data) {
        setUserData(JSON.parse(data!));
      } else {
        navigate("/login");
      }
    }
  }, []);

  return (
    <aside className="p-6 flex flex-col gap-8 bg-zinc-900 text-white h-screen">
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="rounded-full"
            style={{ width: "68px", height: "68px" }}
          />
          <AvatarFallback>FY</AvatarFallback>
        </Avatar>
        <h2 className="font-medium">{userData?.fullname}</h2>
      </div>

      <nav className="flex flex-col h-full justify-between">
        <div className="flex flex-col gap-4">
          {sidebarItems.map((item) => (
            <Link to={item.path}>
              <Button
                key={item.label}
                variant={"ghost"}
                className={`${isActive(item.path) && "bg-[#48DE80] text-black"
                  } justify-start gap-4 w-full flex items-center`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            key={"Logout"}
            variant="ghost"
            className={`justify-start gap-4 w-full flex items-center`}
            onClick={handleLogout}
          >
            <span>
              <LogOut />
            </span>
            Keluar
          </Button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
