import { Link } from "react-router-dom";

const HeroGridSection = () => {
  return (
    <section className="px-4 pt-20 pb-16 bg-white/70 backdrop-blur-md rounded-lg">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0e7490] text-center drop-shadow-sm mb-4">
          Fan Gear Redefined
        </h1>
        <p className="text-lg sm:text-xl text-gray-700">
          Express your loyalty through bold, authentic{" "}
          <span className="font-semibold text-indigo-600">club</span> and{" "}
          <span className="font-semibold text-pink-600">country</span> designs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Clubs */}
        <Link
          to="/clubs"
          className="group relative rounded-xl overflow-hidden shadow-xl hover:scale-[1.05] transition-transform"
        >
          <img
            src="/footballclubs.jpeg"
            alt="Clubs"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-center pb-6 bg-gradient-to-t from-black/50 to-transparent">
            <h2 className="text-3xl font-extrabold text-white">Club Zone</h2>
          </div>
        </Link>

        {/* Countries */}
        <Link
          to="/countries"
          className="group relative rounded-xl overflow-hidden shadow-xl hover:scale-[1.05] transition-transform"
        >
          <img
            src="/country.jpeg"
            alt="Countries"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-center pb-6 bg-gradient-to-t from-black/50 to-transparent">
            <h2 className="text-3xl font-extrabold text-white">Country Zone</h2>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default HeroGridSection;
