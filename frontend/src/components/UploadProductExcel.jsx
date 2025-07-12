// components/UploadProductExcel.jsx
import { useState } from "react";
import axiosInstance from "../lib/axios"; 
import { Loader2 } from "lucide-react";

const UploadProductExcel = () => {
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleUpload = async () => {
		if (!file) return alert("Please select a file!");

		setLoading(true);
		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await axiosInstance.post("/products/upload-products", formData, {
	headers: {
		"Content-Type": "multipart/form-data",
	},
});
		} catch (err) {
			console.error(err);
			setMessage("Upload failed ❌");
		}
		setLoading(false);
	};

	return (
		<div className="bg-gray-800 p-4 rounded-lg mt-6">
			<h2 className="text-xl font-semibold mb-4 text-white">📤 Upload Products via Excel</h2>
			<input
				type="file"
				accept=".xlsx,.xls"
				onChange={(e) => setFile(e.target.files[0])}
				className="mb-4 block text-white"
			/>
			<button
				onClick={handleUpload}
				disabled={loading}
				className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
			>
				{loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Upload Excel"}
			</button>

			{message && (
				<p className="mt-3 text-sm text-white">
					{message}
				</p>
			)}
		</div>
	);
};

export default UploadProductExcel;
