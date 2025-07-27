import { Link } from "react-router-dom";

const CategoryItem = ({ href, name, imageUrl }) => {
	return (
		<Link
			to={href}
			className="block bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition transform hover:scale-105"
		>
			<img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
			<div className="p-4 text-center text-gray-800 font-semibold">{name}</div>
		</Link>
	);
};

export default CategoryItem;
