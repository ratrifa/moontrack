import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import Sidebar from '@/components/ui/sidebar'
import { Plus, Search } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import InputField from '@/components/ui/input-field'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    const [userData, setUserData] = useState(null)
    const [transactionData, setTransactionData] = useState([])
    const [notesData, setNotesData] = useState([])
    const [wishlistData, setWishlistData] = useState([])
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)
    const [addSaldo, setAddSaldo] = useState(false)
    const [saldo, setSaldo] = useState(0)
    const [expenseData, setExpenseData] = useState([])
    const [incomeData, setIncomeData] = useState([])

    const transactionItems = transactionData?.filter(
        (transaction) => transaction.date === new Date().toISOString().split("T")[0]
    )

    const fetchTransactions = async () => {
        if (userData && userData.saldo) {
            try {
                const response = await axios.get(`http://localhost:8080/api/transactions/${userData.userId}`)
                if (response.status == 200) {
                    if (response.data.data) {
                        const expense = response.data.data
                            .filter((transaction) => transaction.type === "pengeluaran")
                            .reduce((sum, transaction) => sum + transaction.amount, 0)

                        const income = response.data.data
                            .filter((transaction) => transaction.type === "pemasukan")
                            .reduce((sum, transaction) => sum + transaction.amount, 0)

                        setTotalExpense(expense)
                        setTotalIncome(income)
                        setTransactionData(response.data.data)
                    }
                    toast.success("Success fetching data")
                }
            } catch (err) {
                console.error(err)
                toast.error(err || "Failed fetching data")
            }
        }
    }

    const fetchNotes = async () => {
        if (userData && userData.saldo) {
            try {
                const response = await axios.get(`http://localhost:8080/api/notes/${userData.userId}`)
                if (response.status == 200) {
                    if (response.data.data) {
                        setNotesData(response.data.data)
                    }
                }
            } catch (err) {
                console.error(err)
                toast.error(err || "Failed fetching data")
            }
        }
    }

    const fetchWishlist = async () => {
        if (userData && userData.saldo) {
            try {
                const response = await axios.get(`http://localhost:8080/api/wishlists/${userData.userId}`)
                if (response.status == 200) {
                    if (response.data.data) {
                        setWishlistData(response.data.data)
                    }
                }
            } catch (err) {
                console.error(err)
                toast.error(err || "Failed fetching data")
            }
        }
    }

    const checkSaldo = () => {
        if (userData && userData.saldo == null) {
            setAddSaldo(true)
        }
    }

    const handleUpdateSaldo = async () => {
        userData.saldo = saldo
        try {
            const response = await axios.put(`http://localhost:8080/api/users/${userData.userId}`, userData)
            if (response.status == 200) {
                setUserData(response.data.data)
                localStorage.setItem("user", JSON.stringify(response.data.data))
                toast.success(response.data.message || "Success update data")
                setAddSaldo(false)
            }
        } catch (err) {
            console.error(err)
            toast.error(err || "Failed update data")
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem("user");
            setUserData(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        if (transactionData) {
            // Group transactions by date
            const groupedData = transactionData.reduce((acc, transaction) => {
                const { date, amount, type } = transaction;

                if (!acc[date]) {
                    acc[date] = { date, pemasukan: 0, pengeluaran: 0 };
                }

                acc[date][type] += amount;
                return acc;
            }, {});

            // Prepare data for expenses chart
            const expenseChartData = Object.values(groupedData).map((entry) => ({
                date: entry.date,
                value: entry.pengeluaran,
            })).sort((a, b) => new Date(a.date) - new Date(b.date));

            // Prepare data for income chart
            const incomeChartData = Object.values(groupedData).map((entry) => ({
                date: entry.date,
                value: entry.pemasukan,
            })).sort((a, b) => new Date(a.date) - new Date(b.date));

            setExpenseData(expenseChartData);
            setIncomeData(incomeChartData);
        }
    }, [transactionData]);

    useEffect(() => {
        fetchTransactions()
        fetchNotes()
        fetchWishlist()
        checkSaldo()
    }, [userData])

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex w-screen overflow-x-hidden">
            {/* Sidebar */}
            <Sidebar />

            {addSaldo && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex justify-center items-center z-[9999]">
                    <div className="bg-[#2C2B2B] rounded-[20px] p-6 w-[400px] h-[300px]">
                        {/* Close Button */}
                        <div className='w-full flex justify-end'>
                            <img
                                src="/close-button.png"
                                alt="Close Button"
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => setAddSaldo(false)}
                            />
                        </div>
                        <div className="flex flex-col justify-between items-center h-full">
                            <p className='mb-4'>Silahkan masukkan saldo anda saat ini</p>
                            <InputField
                                label="Saldo"
                                placeholder="Masukkan saldo"
                                value={saldo}
                                onChange={(e) =>
                                    setSaldo(e.target.value)
                                }
                            />
                            <button
                                className="bg-[#48DE80] py-2 text-[#1C1B1B] font-medium text-[17px] rounded-[24px] w-full mb-2"
                                onClick={handleUpdateSaldo}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 max-h-screen overflow-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="search"
                                placeholder="Cari apapun di sini ..."
                                className="w-80 pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border-0 focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        {/* <Button className="bg-green-500 hover:bg-green-600 text-black"><Plus /></Button> */}
                    </div>
                </div>

                {/* Balance Card */}
                <Card className="mb-8 bg-zinc-900 border-0 rounded-lg">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className='flex flex-col gap-y-4'>
                                <div className="text-3xl font-bold">Rp{userData?.saldo?.toLocaleString("id-ID") || 0}</div>
                                <div className="text-sm text-gray-400">Saldo Tersedia</div>
                            </div>
                            <div className="bg-zinc-800 shadow-md rounded-lg p-3">
                                <div className="text-sm text-gray-400">Total Pemasukan</div>
                                <div className="text-2xl font-bold mt-1 text-green-500">+Rp{totalIncome.toLocaleString("id-ID")}</div>
                            </div>
                            <div className="bg-zinc-800 shadow-md rounded-lg p-3">
                                <div className="text-sm text-gray-400">Total Pengeluaran</div>
                                <div className="text-2xl font-bold mt-1 text-red-500">-Rp{totalExpense.toLocaleString("id-ID")}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts */}
                {/* <dv className='flex w-full gap-x-2 items-center'> */}
                <div className='w-full h-[300px] flex gap-x-4 bg-zinc-900 border-0 rounded-lg p-4 mb-8'>
                    <div className="bg-zinc-800 shadow-md rounded-lg p-4 w-full h-full">
                        <h1 className="text-md font-semibold mb-2">Pemasukan</h1>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={incomeData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Line type="monotone" dataKey="value" stroke="#48DE80" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-zinc-800 shadow-md rounded-lg p-4 w-full h-full">
                        <h1 className="text-md font-semibold mb-2">Pengeluaran</h1>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={expenseData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Line type="monotone" dataKey="value" stroke="#FF3629" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* </div> */}

                {/* Bottom Cards */}
                <div className="grid grid-cols-3 gap-8">
                    {/* Wishlist */}
                    <Card className="bg-zinc-900 border-0 rounded-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Wishlist</CardTitle>
                            <Link to={"/wishlist"}>
                                <Button variant="ghost" size="icon"><Plus /></Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[180px]">
                                {wishlistData.map((item) => (
                                    <div key={item.title} className="flex items-start gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-sm text-gray-400">Rp{item.budget.toLocaleString("id-ID")}</div>
                                        </div>
                                        <div className="text-sm text-green-500">{item.reachedDate}</div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="bg-zinc-900 border-0 rounded-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Catatan</CardTitle>
                            <Link to={"/notes"}>
                                <Button variant="ghost" size="icon"><Plus /></Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[180px]">
                                {notesData && notesData.map((item, index) => (
                                    <div key={index} className="mb-4">
                                        <div>
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-sm text-gray-400">{item.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Today's Transactions */}
                    <Card className="bg-zinc-900 border-0 rounded-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Transaksi Hari Ini</CardTitle>
                            <Link to={"/transaction"}>
                                <Button variant="ghost" size="icon"><Plus /></Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[180px]">
                                {transactionItems.length > 0 ? transactionItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="font-medium">{item.category.name}</div>
                                            <div className="text-sm text-gray-400">{item.description}</div>
                                        </div>
                                        <div className={`${item.type.toLowerCase() === "pemasukan"
                                            ? "text-green-500"
                                            : "text-red-500"
                                            }`}>Rp{item.amount.toLocaleString("id-ID")}</div>
                                    </div>
                                )) : <p>Belum ada tranasaksi hari ini</p>}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

