import { useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("single"); // "single" or "multi"

  const handleUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Choose API endpoint based on selected mode
    const endpoint =
      mode === "single"
        ? "http://localhost:8000/upload-pdf/"
        : "http://localhost:8000/upload-multi-pdf/";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    return `http://localhost:8000${path}`; // Path already includes /files/
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">📄 Upload GIA PDF Report</h1>

      {/* Mode Selection */}
      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="single"
            checked={mode === "single"}
            onChange={() => setMode("single")}
          />{" "}
          Single Diamond PDF
        </label>
        <label>
          <input
            type="radio"
            value="multi"
            checked={mode === "multi"}
            onChange={() => setMode("multi")}
          />{" "}
          Multi-Diamond PDF
        </label>
      </div>

      {/* File Upload */}
      <input type="file" accept="application/pdf" onChange={handleUpload} />

      {loading && <p className="mt-4 text-blue-600">⏳ Processing...</p>}

      {data && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Extracted Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>

          {/* Single PDF images */}
          {mode === "single" && data.PROPORTIONS && (
            <div>
              <h3 className="font-bold mt-4">Proportions Diagram:</h3>
              <img
                src={getFileUrl(data.PROPORTIONS)}
                alt="Proportions"
                className="mt-2 rounded border"
              />
            </div>
          )}

          {mode === "single" && data.CLARITY_CHARACTERISTICS && (
            <div>
              <h3 className="font-bold mt-4">Clarity Characteristics:</h3>
              <img
                src={getFileUrl(data.CLARITY_CHARACTERISTICS)}
                alt="Clarity"
                className="mt-2 rounded border"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
