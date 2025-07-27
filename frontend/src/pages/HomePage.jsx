import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import HeroGridSection from "../components/HeroGridSection";

const HomePage = () => {
	const { fetchFeaturedProducts, products } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className="w-full min-h-screen bg-white">
			{/* Hero Section */}
			<HeroGridSection />

			{/* If there are featured products, show them below */}
			{products && products.length > 0 && (
				<div className="mt-12">
					{/* Optional: FeaturedProducts component */}
					{/* <FeaturedProducts /> */}
				</div>
			)}
		</div>
	);
};

export default HomePage;
