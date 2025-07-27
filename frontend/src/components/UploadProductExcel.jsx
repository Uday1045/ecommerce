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
			setMessage("✅ Upload successful!");
		} catch (err) {
			console.error(err);
			setMessage("❌ Upload failed");
		}
		setLoading(false);
	};

	return (
		<div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md mt-6">
			<h2 className="text-xl font-semibold mb-4 text-gray-800">📤 Upload Products via Excel</h2>
			<input
				type="file"
				accept=".xlsx,.xls"
				onChange={(e) => setFile(e.target.files[0])}
				className="mb-4 block text-sm text-gray-700"
			/>
			<button
				onClick={handleUpload}
				disabled={loading}
				className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
			>
				{loading ? (
					<>
						<Loader2 className="animate-spin w-4 h-4" />
						Uploading...
					</>
				) : (
					"Upload Excel"
				)}
			</button>

			{message && (
				<p className="mt-3 text-sm text-gray-700">
					{message}
				</p>
			)}
		</div>
	);
};

export default UploadProductExcel;
