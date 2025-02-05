import React from 'react';
import { ChevronRight, Play, Download, Star } from 'lucide-react';

const GamingPlatform = () => {
  const featuredGames = [
    { id: 1, title: "Game 1", image: "/api/placeholder/300/180" },
    { id: 2, title: "Game 2", image: "/api/placeholder/300/180" },
    { id: 3, title: "Game 3", image: "/api/placeholder/300/180" },
    { id: 4, title: "Game 4", image: "/api/placeholder/300/180" }
  ];

  const trendingGames = [
    { id: 1, title: "Trending Game 1", image: "/api/placeholder/200/280" },
    { id: 2, title: "Trending Game 2", image: "/api/placeholder/200/280" },
    { id: 3, title: "Trending Game 3", image: "/api/placeholder/200/280" },
    { id: 4, title: "Trending Game 4", image: "/api/placeholder/200/280" }
  ];

  const popularFeatures = [
    { title: "Cross-Platform Play", icon: <Play className="w-6 h-6" /> },
    { title: "Fast Downloads", icon: <Download className="w-6 h-6" /> },
    { title: "High Ratings", icon: <Star className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative rounded-xl overflow-hidden">
          <img 
            src="/api/placeholder/1200/400" 
            alt="Featured Game"
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-gray-900">
            <h1 className="text-4xl font-bold mb-2">Featured Game Title</h1>
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg">
              Play Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Games</h2>
          <button className="text-purple-400 hover:text-purple-300 flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredGames.map(game => (
            <div key={game.id} className="relative rounded-lg overflow-hidden group">
              <img 
                src={game.image} 
                alt={game.title}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900">
                <h3 className="font-semibold">{game.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularFeatures.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-xl">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">Experience the best gaming features</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <button className="text-purple-400 hover:text-purple-300 flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingGames.map(game => (
            <div key={game.id} className="relative rounded-lg overflow-hidden group">
              <img 
                src={game.image} 
                alt={game.title}
                className="w-full h-72 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900">
                <h3 className="font-semibold">{game.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GamingPlatform;