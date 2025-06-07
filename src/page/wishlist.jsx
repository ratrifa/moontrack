import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";
import { Plus, Search, X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import InputField from "../components/ui/input-field";
import toast from "react-hot-toast";
import axios from "axios";
import moment from "moment/moment";

const Wishlist = () => {
  const [isAddWishlistOpen, setIsAddWishlistOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [wishlists, setWishlists] = useState([]);
  const [userData, setUserData] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    cost: "",
    saving: "",
  });

  const fetchWishlist = async (isMessage) => {
    if (userData) {
      if (!userData) {
        toast.error("Tidak ada data pengguna yang ditemukan. Silakan login kembali.")
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/wishlists/${userData.userId}`)
        if (response.status == 200) {
          if (response.data.data) {
            setWishlists(response.data.data)
          }
          if (isMessage) {
            toast.success(response.data.message || "Success fetch data")
          }
        }
      } catch (err) {
        toast.error(err)
      }
    }
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.cost) newErrors.cost = "Biaya wajib diisi";
    else if (isNaN(formValues.cost))
      newErrors.cost = "Biaya hanya berupa angka";
    if (!formValues.saving) newErrors.saving = "Rencana tabungan wajib diisi";
    else if (isNaN(formValues.saving))
      newErrors.cost = "Biaya hanya berupa angka";
    if (!formValues.name) newErrors.name = "Nama wishlist wajib diisi";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const cost = parseFloat(formValues.cost);
    const saving = parseFloat(formValues.saving);
    const createdAt = new Date().toISOString().split("T")[0];

    try {
      if (!userData) {
        toast.error("Tidak ada data pengguna yang ditemukan. Silakan login kembali.")
        return;
      }

      const dataToSend = {
        user: userData,
        name: formValues.name,
        budget: cost,
        saving: saving,
        createdAt
      }

      const response = await axios.post(`http://localhost:8080/api/wishlists`, dataToSend);
      if (response.status == 200) {
        fetchWishlist(false)
        toast.success(response.data.message)
      }
    } catch (err) {
      toast.error(err || "Something went wrong, please try again later")
    }

    // Reset form
    setFormValues({ name: "", cost: "", saving: "" });
    setIsAddWishlistOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      if (!userData) {
        toast.error("Tidak ada data pengguna yang ditemukan. Silakan login kembali.")
        return;
      }

      const response = await axios.delete(`http://localhost:8080/api/wishlists/${id}`);
      if (response.status == 200) {
        fetchWishlist(false)
        toast.success(response.data.message)
      }
    } catch (err) {
      toast.error(err || "Something went wrong, please try again later")
    }
  };


  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user");
      setUserData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    fetchWishlist(true)
  }, [userData])

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex w-screen overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Wishlist</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                placeholder="Cari apapun di sini ..."
                className="w-80 pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border-0 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <Button
              className="bg-green-500 hover:bg-green-600 text-black"
              onClick={() => setIsAddWishlistOpen(true)}
            >
              <Plus />
            </Button>
          </div>
        </div>

        {/* Wishlist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((wishlist, index) => (
            <div
              key={index}
              className="relative bg-[#27272A] rounded-[16px] p-6 flex-col justify-between"
              style={{ width: "100%", height: "200px" }}
            >
              {/* Nama Wishlist */}
              <div>
                <h2
                  className="font-semibold mt-2"
                  style={{
                    fontSize: "29px",
                    lineHeight: "36px",
                    letterSpacing: "-0.03em",
                    color: "#FFFFFF",
                  }}
                >
                  {wishlist.name}
                </h2>
              </div>

              {/* Tanggal */}
              <div>
                <p
                  className="font-semibold mt-4"
                  style={{
                    fontSize: "38px",
                    lineHeight: "40px",
                    letterSpacing: "-0.03em",
                    color: "#48DE80",
                  }}
                >
                  {moment(wishlist.reachedDate).format("D MMM YYYY")}
                </p>
              </div>

              {/* Saving */}
              <div>
                <p
                  className="font-normal mt-3"
                  style={{
                    fontSize: "19px",
                    lineHeight: "24px",
                    letterSpacing: "-0.03em",
                    color: "#D1D5DB",
                  }}
                >
                  Rp{wishlist.saving.toLocaleString("id-ID")}/bulan
                </p>
              </div>

              {/* Delete Button */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(wishlist.wishlistId);
                  }}
                  className="text-gray-300 hover:text-red-400"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Layer */}
      {isAddWishlistOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex justify-center items-center z-[9999]">
          <div className="bg-[#2C2B2B] rounded-[20px] p-10 w-[480px] h-[480px] relative">
            {/* Close Button */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                className="text-gray-400 hover:text-gray-100"
                onClick={() => setIsAddWishlistOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            {/* Form */}
            <div className="space-y-8">
              {/* Nama */}
              <div className="flex flex-col items-center">
                <InputField
                  label="Nama Wishlist"
                  placeholder="Masukkan nama wishlist"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues({ ...formValues, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Biaya */}
              <div className="flex flex-col items-center">
                <InputField
                  label="Biaya"
                  placeholder="Masukkan biaya yang diperlukan"
                  value={formValues.cost}
                  onChange={(e) =>
                    setFormValues({ ...formValues, cost: e.target.value })
                  }
                />
                {errors.cost && (
                  <p className="text-red-500 text-xs mt-1">{errors.cost}</p>
                )}
              </div>

              {/* Tabungan */}
              <div className="flex flex-col items-center">
                <InputField
                  label="Tabungan per bulan"
                  placeholder="Masukkan rencana tabungan"
                  value={formValues.saving}
                  onChange={(e) =>
                    setFormValues({ ...formValues, saving: e.target.value })
                  }
                />
                {errors.saving && (
                  <p className="text-red-500 text-xs mt-1">{errors.saving}</p>
                )}
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-center mt-12">
              <button
                className="bg-[#48DE80] py-2 text-[#1C1B1B] font-medium text-[17px] rounded-[24px]"
                onClick={handleSubmit}
                style={{ width: "360px", height: "44px" }}
              >
                Tambahkan Wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
