import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState("search");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (step === "search") {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${username}`);
                if (response.status === 200) {
                    const { userId, fullname, username, saldo, password } = response.data.data; // Ambil data user dari response

                    // Simpan data user di localStorage
                    localStorage.setItem(
                        "user",
                        JSON.stringify({ userId, fullname, username, saldo, password })
                    );
                    toast.success(response.data.message)
                    setStep("reset")
                }
            } catch (err) {
                // Menangani error
                if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error("Something went wrong. Please try again later.");
                }
            }
        } else {
            const user = JSON.parse(localStorage.getItem("user"))
            user.password = password
            try {
                const response = await axios.put(`http://localhost:8080/api/users/${user.userId}`, user);

                // Jika login berhasil
                if (response.status === 200) {
                    toast.success(response.data.message)
                    navigate("/login")
                }
            } catch (err) {
                // Menangani error
                if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error("Something went wrong. Please try again later.");
                }
            }
        }
    };

    return (
        <div className="bg-[#1C1B1B] w-screen h-screen flex">
            <div className="w-1/2 h-screen bg-gradient-to-b from-[#059C82] via-[#16C98C] to-[#059C82] flex flex-col py-4 items-center justify-between">
                <div className="text-center">
                    <h1 className="font-bold text-white text-[45px] leading-[47px] tracking-[-0.03em]">
                        Finansial Anda
                        <br />
                        di Satu Tempat
                    </h1>
                </div>
                <div className="w-[677px] h-[240px]">
                    <img
                        src="/illustration.png"
                        alt="MonTrack"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-white text-[17.6px] leading-[25.6px] tracking-[-0.03em]">
                        Catat keuangan, buat wishlist, pelajari laporan,
                        <br />
                        dan nikmati layanan keuangan lainnya
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-[40px] h-[40px]">
                        <img
                            src="/icon-montrack.png"
                            alt="MonTrack Icon"
                            className="w-full h-full object-contain drop-shadow-md"
                        />
                    </div>
                    <h2 className="font-medium text-white text-[32px] leading-[48px] tracking-[-0.03em] drop-shadow-md">
                        MonTrack
                    </h2>
                </div>
            </div>
            <div className="w-1/2 h-screen flex items-center justify-center">
                <div className="bg-[#2C2B2B] rounded-[25px] w-[435.2px] h-fit p-8">
                    <h1 className="text-white font-semibold text-[32px] tracking-[-0.03em]">
                        Forgot Password
                    </h1>
                    <form className="mt-5 space-y-4" onSubmit={handleLogin}>
                        {step === "search" ? (<div className="text-left">
                            <p className="text-white/75 mb-2">Silahkan masukkan username anda</p>
                            <label
                                htmlFor="username"
                                className="block text-[14.4px] font-normal text-white/75 tracking-[-0.02em]"
                            >
                                Nama Pengguna
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-2 w-full h-[40px] px-4 rounded-[12px] bg-white/10 border border-white/30 text-white"
                            />
                        </div>) : (
                            <div className="text-left">
                                <p className="text-white/75 mb-2">Silahkan masukkan kata sandi baru</p>
                                <label
                                    htmlFor="password"
                                    className="block text-[14.4px] font-normal text-white/75 tracking-[-0.02em]"
                                >
                                    Kata sandi
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2 w-full h-[40px] px-4 rounded-[12px] bg-white/10 border border-white/30 text-white"
                                />
                            </div>
                        )}
                        {/* {error && (
                            <p className="text-red-500 text-sm font-medium mt-2">{error}</p>
                        )} */}
                        <button
                            type="submit"
                            className="mt-6 w-full h-[44px] bg-[#48DE80] text-[#1C1B1B] font-medium text-[17.6px] rounded-[24px]"
                        >
                            {step === "search" ? "Cari" : "Reset"}
                        </button>
                    </form>
                    <div className="text-center mt-[35px]">
                        <p className="text-white/75 text-[16px] tracking-[-0.02em]">
                            Tidak memiliki akun?{" "}
                            <Link to="/register" className="font-medium text-[#14C48B]">
                                Daftar
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
