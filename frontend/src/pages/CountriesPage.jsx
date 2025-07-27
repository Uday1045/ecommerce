import CategoryItem from "../components/CategoryItem";
import countries from "../data/countries";

const CountriesPage = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl  font-bold text-center mb-8 text-[#0e7490]">
All National Football Teams			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{countries.map((country) => (
					<CategoryItem
						key={country.name}
						href={country.href}
						name={country.name}
						imageUrl={country.imageUrl}
					/>
				))}
			</div>
		</div>
	);
};

export default CountriesPage;
