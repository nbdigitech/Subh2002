
// import React, { useState , useEffect} from "react";
// import ModalPopup from "./ModalPopup"; // Importing Modal for 'Create Folder' functionality
// import GalleryModal from "./GalleryModal";
// import JSZip from "jszip";

// const AllPhotos = ({ currentTab } ) => {
//   const [selectedAlbum, setSelectedAlbum] = useState(null);
//   const [isFolderModalOpen, setIsFolderModalOpen] = useState(false); // Create Folder Modal state
//   const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [albums, setAlbums] = useState([]);
//   // Albums with multiple images

//   useEffect(() => {
//     fetchAlbums();
//   }, []);

//   const fetchAlbums = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/albums");
//       if (!response.ok) {
//         throw new Error("Failed to fetch albums");
//       }
//       const data = await response.json();
//       setAlbums(data);
//     } catch (error) {
//       console.error("Error fetching albums:", error);
//     }
//   };


//   const fetchPhotos = async (album) => {
//   if (!album || !album._id) return;
//   try {
//     const response = await fetch(`http://localhost:5000/photos/${album._id}`);
//     if (!response.ok) throw new Error("Failed to fetch photos");
//     const data = await response.json();
//     console.log("📸 Fetched Photos:", data);

//     // Ensure album opens even if there are no photos
//     setSelectedAlbum({ ...album, images: data.length > 0 ? data : [] });
//   } catch (error) {
//     console.error("Error fetching photos:", error);

//     // Ensure empty albums still open
//     setSelectedAlbum({ ...album, images: [] });
//   }
// };

//   const handleCreateAlbum = async (newAlbum) => {
//     try {
//       const response = await fetch("http://localhost:5000/create-album", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newAlbum),
//       });
//       if (response.ok) {
//         alert("Album created successfully");
//         const data = await response.json(); // ✅ Get response with message + album

//             setAlbums((prevAlbums) => [data.album, ...prevAlbums]); // ✅ Instantly update UI
            
//             alert(data.message); // ✅ Show success message
//             setIsFolderModalOpen(false);
//       } else {
//         alert("Failed to create album");
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };



//   const toggleSelection = (photo) => {
//     console.log("🛠️ Selecting photo:", photo); // Debugging log

//     setSelectedItems((prev) =>
//         prev.some((item) => item.photo_id === photo.photo_id)
//             ? prev.filter((item) => item.photo_id !== photo.photo_id)  // Remove if already selected
//             : [...prev, photo] // Add full photo object
//     );
// };


//   const handleSelectAll = () => {
//     if (selectedAlbum) {
//       if (selectedItems.length === selectedAlbum.images.length) {
//         setSelectedItems([]);
//       } else {
//         setSelectedItems([...selectedAlbum.images]);
//       }
//     } else {
//       setSelectedItems([...albums]);
//     }
//   };


// const handleDownload = async () => {
//     if (selectedItems.length === 0) return;

//     const zip = new JSZip();

//     for (const item of selectedItems) {
//         if (item.photo_id) {
//             // This means we are downloading selected photos inside an album
//             try {
//                 const response = await fetch(item.image);
//                 const blob = await response.blob();
//                 zip.file(`photo_${item.photo_id}.jpg`, blob);
//             } catch (error) {
//                 console.error("Error fetching photo:", error);
//             }
//         } else if (item._id) {
//             // This means we are downloading an album
//             try {
//                 const response = await fetch(`http://localhost:5000/photos/${item._id}`);
//                 if (!response.ok) throw new Error("Failed to fetch album photos");

//                 const data = await response.json();
//                 data.images.forEach(async (img, index) => {
//                     try {
//                         const imgResponse = await fetch(img.image);
//                         const imgBlob = await imgResponse.blob();
//                         zip.file(`${item.name}_photo_${index + 1}.jpg`, imgBlob);
//                     } catch (imgError) {
//                         console.error("Error fetching album image:", imgError);
//                     }
//                 });
//             } catch (error) {
//                 console.error("Error fetching album photos:", error);
//             }
//         }
//     }

//     zip.generateAsync({ type: "blob" }).then((content) => {
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(content);
//         link.download = "download.zip";
//         link.click();
//     });
// };

//       const handleDelete = async () => {
//         if (selectedItems.length === 0) return;

//         try {
//           if (selectedAlbum) {
//             // Deleting selected photos inside an album
//             for (const photo of selectedItems) {
//               if (!photo.photo_id) {
//                 console.error("❌ Missing photo_id for:", photo);
//                 continue; // Skip invalid items
//               }

//               const response = await fetch(
//                 `http://localhost:5000/photo/${selectedAlbum._id}/${photo.photo_id}`,
//                 { method: "DELETE" }
//               );

//               if (!response.ok) {
//                 console.error("❌ Failed to delete photo:", response.statusText);
//               }
//             }
//             await fetchPhotos(selectedAlbum); // ✅ Refresh album after deletion
//           } else {
//             // Deleting albums
//             const response = await fetch("http://localhost:5000/delete-albums", {
//               method: "DELETE",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ albumIds: selectedItems.map((album) => album._id) }),
//             });

//             if (!response.ok) {
//               console.error("❌ Failed to delete albums:", response.statusText);
//             }

//             fetchAlbums(); // ✅ Refresh album list
//           }

//           setSelectedItems([]);
//         } catch (error) {
//           console.error("Error deleting:", error);
//           console.log("🛠️ Deleting photo with ID:", photo.photo_id, "from album:", selectedAlbum._id);

//         }
//       };





//   return (
//     <div className="mt-4">
//       {/* If no album is selected, show album grid */}
//       <div className="flex justify-between items-center gap-4 mb-4 flex-wrap sm:flex-nowrap">
//   {/* Back button on left (only in photo gallery section) */}
//   {selectedAlbum && (
//     <button 
//       className="px-4 py-2 bg-[#170645] text-[#FFE100] rounded-lg" 
//       onClick={() => setSelectedAlbum(null)}
//     >
//       ← Back to Events
//     </button>
//   )}

//   {/* Right-aligned button group */}
//   <div className="flex items-center gap-2 sm:ml-auto flex-wrap sm:flex-nowrap">
//     {/* Select All */}
//     <div className="flex items-center gap-3 ml-[23px] mr-2 shrink-0">
//       <input
//         type="checkbox"
//         id="selectAll"
//         className="w-4 h-4 cursor-pointer"
//         onChange={handleSelectAll}
//         checked={selectedItems.length === (selectedAlbum ? selectedAlbum.images.length : albums.length)}
//       />
//       <label htmlFor="selectAll" className="text-sm cursor-pointer text-[#686868]">
//         Select All
//       </label>
//     </div>

//     {/* Download Button (Fixed Width & Prevent Wrapping) */}
//     <button
//       className="bg-[#170645] text-[#FFE100] w-[150px] h-[40px] rounded-full font-normal whitespace-nowrap shrink-0"
//       onClick={handleDownload}
//     >
//       Download
//     </button>

//     {/* Delete Button (Prevent Wrapping) */}
//     <button className="flex items-center justify-center shrink-0 w-[150px] h-[40px] border-2 border-red-500 rounded-full" onClick={handleDelete}>
//       <img src="/del_i.png" alt="Delete" className="w-6 h-6" />
//     </button>
//   </div>
// </div>


//       {selectedAlbum === null ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
//           {/* Create Folder Card */}
//           <div
//             onClick={() => setIsFolderModalOpen(true)}
//             className="relative flex justify-start items-end w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[404px] border border-[#686868] rounded-[32px] p-4 cursor-pointer hover:shadow-lg transition mt-4"
//           >
//             <div className="flex flex-col items-start text-left pl-4">
//               <img src="/Create_F.png" alt="Create Folder" className="w-[34px] h-[34px] mb-1" />
//               <p className="text-[#170645] text-[18px] font-medium mt-4 mb-1">Create Event</p>
//               <p className="text-[#686868] text-[14px] mt-1 mb-6">Example: New Event</p>
//             </div>
//           </div>

//           {/* Modal for Folder Creation */}
//           <ModalPopup isOpen={isFolderModalOpen} setIsOpen={setIsFolderModalOpen} fetchAlbums={fetchAlbums} onCreateAlbum={handleCreateAlbum} />

//           {/* Album Cards */}
//           {albums.map((album, i) => (
//             <div key={i} className="p-4 rounded-lg cursor-pointer"  onClick={() => fetchPhotos(album)}>
//               <div className="relative border border-[#686868] rounded-[32px] w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[404px] rounded-[25px] overflow-hidden">
              
//               <img src={`data:image/jpeg;base64,${album.cover}`} alt={album.name} className="w-full h-full object-fill rounded-[32px]" />
//               </div>
//               <div className="flex items-center gap-4">
//               <input type="checkbox" className=" w-4 h-4 mt-2 border-2 border-gray-400 rounded-[25px] " onChange={() => toggleSelection(album)} onClick={(e) => e.stopPropagation()} checked={selectedItems.includes(album)} />
//               <p className="text-start font-bold text-[18px] text-black mt-2">{album.name}</p>
//               </div>
//               <div className="flex justify-start space-x-4 mt-1 w-full">
//               {/* <input type="checkbox" className="appearance-none mt-2 w-[30px] h-[30px] border-2 border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all" onChange={() => toggleSelection(album)} checked={selectedItems.includes(album)} /> */}
//                 <button className="mt-2 rounded-full hover:bg-gray-100">
//                   <img src="/Group 210.png" alt="Share" className="w-[30px] h-[30px]" />
//                 </button>
//                 <button className="mt-2 rounded-full hover:bg-gray-100">
//                   <img src="/Group 211.png" alt="Share" className="w-[30px] h-[30px]" />
//                 </button>
//                 <button className="mt-2 rounded-full hover:bg-gray-100">
//                   <img src="/Group 212.png" alt="Share" className="w-[30px] h-[30px]" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         //photo section:

//         <div>
//           {/* <button className="mb-4 px-4 py-2 bg-[#170645] text-[#FFE100] rounded-lg" onClick={() => setSelectedAlbum(null)}>
//             ← Back to Events
//           </button> */}
//           <div className="grid grid-cols-2  max-[365px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {/* Create Photo Gallery Box inside photo section */}
//             <div
//                onClick={() => setIsGalleryModalOpen(true)}
//               className="flex flex-col justify-end items-start pl-8 pb-6 w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] border border-gray-400 rounded-[25px] cursor-pointer hover:shadow-lg transition bg-white mt-2"
//             >
//               <img src="/Create_F.png" alt="Create" className="w-[27px] h-[27px] mb-2" />
//               <p className="text-[#170645] text-lg ">Create Photo Gallery</p>
//               <p className="text-gray-500 text-sm  ml-[1px] ">Max Size 5 MB</p>
//             </div>

//             {selectedAlbum?.images.map((photo, index) => (
//               <div key={index} className="p-1 relative rounded-lg border border-white border-[2px] overflow-hidden hover:border-[#0084FF] hover:shadow-md transition" >
//                 <input type="checkbox" className="absolute top-4 left-4" onChange={() => toggleSelection(photo)} 
//                checked={selectedItems.some(item => item.photo_id === photo.photo_id)}  />
//                 <img  src={photo.image} alt={`Photo ${index + 1}`} className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] object-cover rounded-[25px]" onError={(e) => console.error("Image load error", e.target.src)} />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//     <ModalPopup 
//         setIsOpen={setIsFolderModalOpen} 
//         onCreateAlbum={handleCreateAlbum} 
//         fetchAlbums={fetchAlbums}
//       />
//     { selectedAlbum?._id && (
//         <GalleryModal isOpen={isGalleryModalOpen} setIsOpen={setIsGalleryModalOpen} albumId={selectedAlbum?._id} fetchPhotos={fetchPhotos} />
//       )}

//     </div>
//   );
// };

// export default AllPhotos;







import React, { useState , useEffect} from "react";
import ModalPopup from "./ModalPopup"; // Importing Modal for 'Create Folder' functionality
import GalleryModal from "./GalleryModal";
import JSZip from "jszip";

const AllPhotos = ({ currentTab } ) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false); // Create Folder Modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  // Albums with multiple images

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch("https://api.homecomputer.online/albums");
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };


  const fetchPhotos = async (album) => {
  if (!album || !album._id) return;
  try {
    const response = await fetch(`https://api.homecomputer.online/photos/${album._id}`);
    if (!response.ok) throw new Error("Failed to fetch photos");
    const data = await response.json();
    console.log("📸 Fetched Photos:", data);

    // Ensure album opens even if there are no photos
    setSelectedAlbum({ ...album, images: data.length > 0 ? data : [] });
  } catch (error) {
    console.error("Error fetching photos:", error);

    // Ensure empty albums still open
    setSelectedAlbum({ ...album, images: [] });
  }
};

  const handleCreateAlbum = async (newAlbum) => {
    try {
      const response = await fetch("https://api.homecomputer.online/create-album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlbum),
      });
      if (response.ok) {
        alert("Album created successfully");
        const data = await response.json(); // ✅ Get response with message + album

            setAlbums((prevAlbums) => [data.album, ...prevAlbums]); // ✅ Instantly update UI
            
            alert(data.message); // ✅ Show success message
            setIsFolderModalOpen(false);
      } else {
        alert("Failed to create album");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };



  const toggleSelection = (album) => {
    console.log("🛠️ Selecting album:", album);

    setSelectedItems((prev) =>
        prev.some((item) => item._id === album._id)
            ? prev.filter((item) => item._id !== album._id)  // Remove if already selected
            : [...prev, album] // Add full album object
    );
};

const togglePhotoSelection = (photo) => {
  console.log("📷 Selecting photo:", photo);

  setSelectedItems((prev) =>
      prev.some((item) => item.photo_id === photo.photo_id)
          ? prev.filter((item) => item.photo_id !== photo.photo_id) // Remove if already selected
          : [...prev, photo] // Add full photo object
  );
};


const handleSelectAll = () => {
  if (selectedAlbum) {
    // Photo Section: Select/Deselect All Photos
    if (selectedItems.length === selectedAlbum.images.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...selectedAlbum.images]);
    }
  } else {
    // Album Section: Fix selection issue by comparing actual IDs
    const allAlbumIds = albums.map(album => album._id); 
    const selectedAlbumIds = selectedItems.map(item => item._id); 

    if (allAlbumIds.every(id => selectedAlbumIds.includes(id))) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems([...albums]); // Select all
    }
  }
};


  
  const handleDownload = async () => {
    if (selectedItems.length === 0) return;

    const zip = new JSZip();

    for (const item of selectedItems) {
        if (item.photo_id) {
            // ✅ Item is a selected photo
            const base64Data = item.image.split(",")[1]; // Extract base64 part
            zip.file(`photo_${item.photo_id}.jpg`, base64Data, { base64: true });
        } else if (item._id) {
            // ✅ Item is an album
            try {
                const response = await fetch(`https://api.homecomputer.online/photos/${item._id}`);
                if (!response.ok) throw new Error("Failed to fetch photos");
                const data = await response.json();

                // Ensure album cover is added
                zip.file(`${item.name}_cover.jpg`, item.cover.split(",")[1], { base64: true });

                // Add photos from album
                data.forEach((photo, index) => {
                    zip.file(`${item.name}_photo_${index + 1}.jpg`, photo.image.split(",")[1], { base64: true });
                });

            } catch (error) {
                console.error("Error fetching photos for download:", error);
            }
        }
    }

    // Generate and download ZIP
    zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "download.zip";
        link.click();
    });
};


      const handleDelete = async () => {
        if (selectedItems.length === 0) return;

        try {
          if (selectedAlbum) {
            // Deleting selected photos inside an album
            for (const photo of selectedItems) {
              if (!photo.photo_id) {
                console.error("❌ Missing photo_id for:", photo);
                continue; // Skip invalid items
              }

              const response = await fetch(
                `https://api.homecomputer.online/photo/${selectedAlbum._id}/${photo.photo_id}`,
                { method: "DELETE" }
              );

              if (!response.ok) {
                console.error("❌ Failed to delete photo:", response.statusText);
              }
            }
            await fetchPhotos(selectedAlbum); // ✅ Refresh album after deletion
          } else {
            // Deleting albums
            const response = await fetch("https://api.homecomputer.online/delete-albums", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ albumIds: selectedItems.map((album) => album._id) }),
            });

            if (!response.ok) {
              console.error("❌ Failed to delete albums:", response.statusText);
            }

            fetchAlbums(); // ✅ Refresh album list
          }

          setSelectedItems([]);
        } catch (error) {
          console.error("Error deleting:", error);
          console.log("🛠️ Deleting photo with ID:", photo.photo_id, "from album:", selectedAlbum._id);

        }
      };





  return (
    <div className="mt-4">
      {/* If no album is selected, show album grid */}
      <div className="flex justify-between items-center gap-4 mb-4 flex-wrap sm:flex-nowrap">
  {/* Back button on left (only in photo gallery section) */}
  {selectedAlbum && (
    <button 
      className="px-4 py-2 bg-[#170645] text-[#FFE100] rounded-lg" 
      onClick={() => setSelectedAlbum(null)}
    >
      ← Back to Events
    </button>
  )}

  {/* Right-aligned button group */}
  <div className="flex items-center gap-2 sm:ml-auto flex-wrap sm:flex-nowrap">
    {/* Select All */}
    <div className="flex items-center gap-3 ml-[23px] mr-2 shrink-0">
      <input
        type="checkbox"
        id="selectAll"
        className="w-4 h-4 cursor-pointer"
        onChange={handleSelectAll}
        checked={selectedItems.length === (selectedAlbum ? selectedAlbum.images.length : albums.length)}
      />
      <label htmlFor="selectAll" className="text-sm cursor-pointer text-[#686868]">
        Select All
      </label>
    </div>

    {/* Download Button (Fixed Width & Prevent Wrapping) */}
    <button
      className="bg-[#170645] text-[#FFE100] w-[150px] h-[40px] rounded-full font-normal whitespace-nowrap shrink-0"
      onClick={handleDownload}
    >
      Download
    </button>

    {/* Delete Button (Prevent Wrapping) */}
    <button className="flex items-center justify-center shrink-0 w-[150px] h-[40px] border-2 border-red-500 rounded-full" onClick={handleDelete}>
      <img src="/del_i.png" alt="Delete" className="w-6 h-6" />
    </button>
  </div>
</div>


      {selectedAlbum === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
          {/* Create Folder Card */}
          <div
            onClick={() => setIsFolderModalOpen(true)}
            className="relative flex justify-start items-end w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[404px] border border-[#686868] rounded-[32px] p-4 cursor-pointer hover:shadow-lg transition mt-4"
          >
            <div className="flex flex-col items-start text-left pl-4">
              <img src="/Create_F.png" alt="Create Folder" className="w-[34px] h-[34px] mb-1" />
              <p className="text-[#170645] text-[18px] font-medium mt-4 mb-1">Create Event</p>
              <p className="text-[#686868] text-[14px] mt-1 mb-6">Example: New Event</p>
            </div>
          </div>

          {/* Modal for Folder Creation */}
          <ModalPopup isOpen={isFolderModalOpen} setIsOpen={setIsFolderModalOpen} fetchAlbums={fetchAlbums} onCreateAlbum={handleCreateAlbum} />

          {/* Album Cards */}
          {albums.map((album, i) => (
            <div key={i} className="p-4 rounded-lg cursor-pointer"  onClick={() => fetchPhotos(album)}>
              <div className="relative border border-[#686868] rounded-[32px] w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[404px] rounded-[25px] overflow-hidden">
              
              <img src={`data:image/jpeg;base64,${album.cover}`} alt={album.name} className="w-full h-full object-fill rounded-[32px]" />
              </div>
              <div className="flex items-center gap-4">
              <input type="checkbox" className=" w-4 h-4 mt-2 border-2 border-gray-400 rounded-[25px] " onChange={() => toggleSelection(album)} onClick={(e) => e.stopPropagation()}  checked={selectedItems.some(item => item._id === album._id)}  />
              <p className="text-start font-bold text-[18px] text-black mt-2">{album.name}</p>
              </div>
              <div className="flex justify-start space-x-4 mt-1 w-full">
              {/* <input type="checkbox" className="appearance-none mt-2 w-[30px] h-[30px] border-2 border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all" onChange={() => toggleSelection(album)} checked={selectedItems.includes(album)} /> */}
                <button className="mt-2 rounded-full hover:bg-gray-100">
                  <img src="/Group 210.png" alt="Share" className="w-[30px] h-[30px]" />
                </button>
                <button className="mt-2 rounded-full hover:bg-gray-100">
                  <img src="/Group 211.png" alt="Share" className="w-[30px] h-[30px]" />
                </button>
                <button className="mt-2 rounded-full hover:bg-gray-100">
                  <img src="/Group 212.png" alt="Share" className="w-[30px] h-[30px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        //photo section:

        <div>
          {/* <button className="mb-4 px-4 py-2 bg-[#170645] text-[#FFE100] rounded-lg" onClick={() => setSelectedAlbum(null)}>
            ← Back to Events
          </button> */}
          <div className="grid grid-cols-2  max-[365px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Create Photo Gallery Box inside photo section */}
            <div
               onClick={() => setIsGalleryModalOpen(true)}
              className="flex flex-col justify-end items-start pl-8 pb-6 w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] border border-gray-400 rounded-[25px] cursor-pointer hover:shadow-lg transition bg-white mt-2"
            >
              <img src="/Create_F.png" alt="Create" className="w-[27px] h-[27px] mb-2" />
              <p className="text-[#170645] text-lg ">Create Photo Gallery</p>
              <p className="text-gray-500 text-sm  ml-[1px] ">Max Size 5 MB</p>
            </div>

            {selectedAlbum?.images.map((photo, index) => (
              <div key={index} className="p-1 relative rounded-lg border border-white border-[2px] overflow-hidden hover:border-[#0084FF] hover:shadow-md transition" >
                <input type="checkbox" className="absolute top-4 left-4" onChange={() => togglePhotoSelection(photo)} 
               checked={selectedItems.some(item => item.photo_id === photo.photo_id)}  />
                <img  src={photo.image} alt={`Photo ${index + 1}`} className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] object-cover rounded-[25px]" onError={(e) => console.error("Image load error", e.target.src)} />
              </div>
            ))}
          </div>
        </div>
      )}

    <ModalPopup 
        setIsOpen={setIsFolderModalOpen} 
        onCreateAlbum={handleCreateAlbum} 
        fetchAlbums={fetchAlbums}
      />
    { selectedAlbum?._id && (
        <GalleryModal isOpen={isGalleryModalOpen} setIsOpen={setIsGalleryModalOpen} albumId={selectedAlbum?._id} fetchPhotos={fetchPhotos} />
      )}

    </div>
  );
};

export default AllPhotos;

