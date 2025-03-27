"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaSlidersH } from "react-icons/fa";
const EVENTS = [
  "Azadi Ka Amrit Mahotsav",
  "Rajim Kumbh Mela",
  "Rajutsav 2025",
  "Harihar Chhattisgarh",
  "Mahatari Vandan Yojna",
  "Chhattisgarh Yojna"
];

const CATEGORIES = [
  "Azadi Ka Amrit Mahotsav",
  "Rajim Kumbh Mela",
  "Rajutsav 2025",
  "Harihar Chhattisgarh",
  "Mahatari Vandan Yojna",
  "Chhattisgarh Yojna",
  "Ujjwala Yojna"
];

const DISTRICTS = [
  "Balod", "Sukma", "Dantewada", "Bastar", "Kondagaon", "Narayanpur", "Kanker",
  "Kawardha", "Baloda Bazar", "Balrampur", "Bemetara", "Bijapur", "Bilaspur",
  "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa",
  "Jashpur", "Korba", "Koriya", "Mahasamund", "Mungeli", "Raigarh", "Raipur",
  "Rajnandgaon", "Surajpur", "Surguja"
];

export default function Navbar({ search, setSearch, setShowGallery }) {
  const [showFilter, setShowFilter] = useState(false);
  const router = useRouter();

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  return (
    <nav className="w-full h-[80px] bg-white flex items-center px-4 md:px-6 justify-between">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-4">
        <img src="/CG logo.webp" alt="Logo" className="w-[60px] h-[60px] md:w-[71px] md:h-[71px]" />
      </div>

      {/* Middle Section: Search Bar (Hidden in Small Screens) */}
      <div className="hidden md:flex items-center border border-gray-300 rounded-full overflow-hidden bg-gray-100 w-[600px] lg:w-[900px] h-[45px] px-3">
        <button onClick={() => setShowFilter(true)} className="px-4 py-2 text-gray-600 flex items-center gap-2">
          Filter <FaChevronDown className="text-sm" />
        </button>
        <span className="text-gray-400 px-3">|</span>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-gray-700 outline-none px-2"
        />
        <button onClick={() => setSearch("")} className="text-gray-500">✕</button>
        <span className="text-gray-400 px-3">|</span>
        <button className="text-gray-600">
          <img src="/Search_i.png" alt="Search" className="w-7 h-5" />
        </button>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex items-center gap-4">
        {/* Mobile View: Icons for Filter & Search */}
        <div className="flex md:hidden gap-3">
          <button onClick={() => setShowFilter(true)}>
            <FaSlidersH size={20} className="text-gray-600" />
          </button>
          <button>
            <img src="/Search_i.png" alt="Search" className="w-5 h-5" />
          </button>
        </div>

        {/* Search Button (Desktop Only) */}
        <button
          onClick={() => { setShowGallery(false); router.push("/dashboard/uploadphoto") }}
          className="hidden md:flex w-[180px] h-[50px] bg-[#170645] text-yellow-300 rounded-full shadow-lg flex items-center justify-center px-4 py-2 transition-all"
        >
          Search Photos
        </button>

        {/* Profile Icon */}
        <button  onClick={() => router.push("/profile")} className="w-9 h-9 rounded-full border border-gray-300 overflow-hidden">
          <img src="/pro.png" alt="User Profile" className="w-full h-full object-cover" />
        </button>
      </div>

      {showFilter && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10 p-4 ">
          <div className="bg-white p-4 sm:p-6 rounded-[30px] shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex justify-end gap-3 mb-4">
              <button
                onClick={() => {
                  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => (checkbox.checked = false));
                  document.querySelectorAll('input[type="date"]').forEach((input) => (input.value = ""));
                }}
                className=" flex items-center justify-center h-8 bg-gray-200 text-gray-500 font-bold px-3 py-1 rounded-full text-sm hover:bg-red-600  gap-1"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="w-8 h-8 font-bold flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500"
              >
                X
              </button>
            </div>

            {[{ title: "Event", items: EVENTS }, { title: "Category", items: CATEGORIES }, { title: "District", items: DISTRICTS }].map((section, index) => (
              <div key={index}>
                <p className="text-lg font-semibold mb-2 text-black">{section.title}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-[#686868] font-semibold ">
                  {section.items.map((item, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="truncate">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}



