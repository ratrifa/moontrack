import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";
import axios from "axios";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Notes = () => {
  const [isAddNotesOpen, setIsAddNotesOpen] = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [editNote, setEditNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [userData, setUserData] = useState(null)

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
  });

  const fetchNotes = async (isMessage) => {
    if (userData) {
      if (!userData) {
        toast.error("Tidak ada data pengguna yang ditemukan. Silakan login kembali.")
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/notes/${userData.userId}`)
        if (response.status == 200) {
          if (response.data.data) {
            setNotes(response.data.data)
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

  const handleSaveNote = async () => {
    if (!formValues.title || !formValues.description) return;

    if (editNote) {
      try {
        if (!userData) {
          toast.error("Tidak ada data pengguna yang ditemukan. Silakan login kembali.")
          return;
        }

        const dataToSend = {
          user: userData,
          title: formValues.title,
          description: formValues.description
        }

        const response = await axios.put(`http://localhost:8080/api/notes/${editNote.notesId}`, dataToSend);
        if (response.status == 200) {
          fetchNotes(false)
          toast.success(response.data.message)
        }
      } catch (err) {
        toast.error(err || "Something went wrong, please try again later")
      }
      setEditNote(null);
    } else {
      // Add note
      try {
        if (!userData) {
          toast.error("Tidak ada data pengguna yang ditemukan. Silakan login kembali.")
          return;
        }

        const dataToSend = {
          user: userData,
          title: formValues.title,
          description: formValues.description
        }

        const response = await axios.post("http://localhost:8080/api/notes", dataToSend);
        if (response.status == 200) {
          fetchNotes(false)
          toast.success(response.data.message)
        }
      } catch (err) {
        toast.error(err || "Something went wrong, please try again later")
      }
    }

    setFormValues({ title: "", description: "" });
    setIsAddNotesOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      if (!userData) {
        toast.error("Tidak ada data pengguna yang ditemukan. Silakan login kembali.")
        return;
      }

      const response = await axios.delete(`http://localhost:8080/api/notes/${id}`);
      if (response.status == 200) {
        fetchNotes(false)
        toast.success(response.data.message)
      }
    } catch (err) {
      toast.error(err || "Something went wrong, please try again later")
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setFormValues({ title: note.title, description: note.description });
    setIsAddNotesOpen(true);
  };

  const handleViewNote = (note) => {
    setViewNote(note);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user");
      setUserData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    fetchNotes(true)
  }, [userData])

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex w-screen overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Catatan</h1>
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
              onClick={() => {
                setFormValues({ title: "", description: "" });
                setEditNote(null);
                setIsAddNotesOpen(true);
              }}
            >
              <Plus />
            </Button>
          </div>
        </div>

        {/* Notes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="relative bg-[#27272A] rounded-[16px] p-6 flex-col justify-between"
              style={{ width: "100%", height: "200px", cursor: "pointer" }}
              onClick={() => handleViewNote(note)}
            >
              {/* Note Title */}
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
                  {note.title}
                </h2>
              </div>

              {/* Note Desc */}
              <div>
                <p
                  className="font-normal mt-4 text-gray-400 text-sm"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {note.description}
                </p>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(note);
                  }}
                  className="text-gray-300 hover:text-yellow-400"
                >
                  <Edit size={17} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(note.notesId);
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

      {/* Floating Layer Add Notes */}
      {isAddNotesOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex justify-center items-center z-[9999]">
          <div className="bg-[#2C2B2B] rounded-[20px] p-8 w-[480px] h-[480px] relative flex flex-col">
            {/* Close Button */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                className="text-gray-400 hover:text-gray-100"
                onClick={() => setIsAddNotesOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            {/* Form */}
            <div className="space-y-4 mt-2">
              <input
                type="text"
                placeholder="Judul"
                value={formValues.title}
                onChange={(e) =>
                  setFormValues({ ...formValues, title: e.target.value })
                }
                className="w-full bg-[#1C1B1B] text-white px-4 py-2 rounded-[12px] focus:outline-none"
              />
              <textarea
                placeholder="Catatan"
                value={formValues.description}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    description: e.target.value,
                  })
                }
                className="w-full h-64 bg-[#1C1B1B] text-white px-4 py-2 rounded-[12px] focus:outline-none resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-6">
              <button
                className="bg-[#48DE80] py-2 text-[#1C1B1B] font-medium text-[17px] rounded-[24px]"
                onClick={handleSaveNote}
                style={{ width: "144px", height: "44px" }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Layer View Notes */}
      {viewNote && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex justify-center items-center z-[9999]">
          <div className="bg-[#2C2B2B] rounded-[20px] p-10 w-[480px] relative">
            {/* Close Button */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                className="text-gray-400 hover:text-gray-100"
                onClick={() => setViewNote(null)}
              >
                <X size={22} />
              </button>
            </div>

            {/* Note Content */}
            <h2 className="text-2xl font-semibold text-white mb-4">
              {viewNote.title}
            </h2>
            <p
              className="text-gray-300"
              style={{
                wordBreak: "break-word",
              }}
            >
              {viewNote.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
