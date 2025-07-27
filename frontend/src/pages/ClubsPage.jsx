import CategoryItem from "../components/CategoryItem";
import clubs from "../data/clubs";

const ClubsPage = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-center mb-8 text-[#0e7490]">
				All Football Clubs
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{clubs.map((club) => (
					<CategoryItem
						key={club.name}
						href={club.href}
						name={club.name}
						imageUrl={club.imageUrl}
					/>
				))}
			</div>
		</div>
	);
};

export default ClubsPage;
