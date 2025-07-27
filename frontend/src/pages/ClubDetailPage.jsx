import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";

const ClubDetailPage = () => {
	const { slug } = useParams(); // like "real-madrid"
	const { products, fetchAllProducts, isLoading } = useProductStore();

	useEffect(() => {
		if (products.length === 0) {
			fetchAllProducts();
		}
	}, [fetchAllProducts, products.length]);

	const slugify = (str) => str.toLowerCase().replace(/\s+/g, "-");

	const filteredProducts = products.filter(
		(p) => slugify(p.category || "") === slug
	);

	return (
		<div className="min-h-screen bg-white text-gray-800">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-center mb-8 text-[#0e7490] capitalize">
					{slug.replace("-", " ")}
				</h1>

				{isLoading ? (
					<p className="text-center text-gray-600 text-lg">Loading...</p>
				) : filteredProducts.length === 0 ? (
					<p className="text-center text-gray-600 text-lg">
						No products found for this club.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{filteredProducts.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ClubDetailPage;
