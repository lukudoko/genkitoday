import React from 'react';

const MasonryGrid = () => {
  // Sample news items with varying content lengths
  const newsItems = [
    {
      id: 1,
      title: "Breaking News",
      content: "Short content here.",
      imageUrl: "/api/placeholder/400/200"
    },
    {
      id: 2,
      title: "Technology Update",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      imageUrl: "/api/placeholder/400/300"
    },
    {
      id: 3,
      title: "Science Discovery",
      content: "Medium length content goes here. Medium length content goes here. Medium length content goes here. Medium length content goes here. This will create a medium-sized card.",
      imageUrl: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Sports Headlines",
      content: "Very short.",
      imageUrl: "/api/placeholder/400/180"
    },
    {
        id: 4,
        title: "Sports Headlines",
        content: "Very short.",
        imageUrl: "/api/placeholder/400/180"
      },
      {
        id: 4,
        title: "Sports Headlines",
        content: "Very short.",
        imageUrl: "/api/placeholder/400/180"
      },
      {
        id: 4,
        title: "Sports Headlines",
        content: "Very short.",
        imageUrl: "/api/placeholder/400/180"
      },
      {
        id: 3,
        title: "Science Discovery",
        content: "Medium length content goes here. Medium length content goes here. Medium length content goes here. Medium length content goes here. This will create a medium-sized card.",
        imageUrl: "/api/placeholder/400/250"
      },
      {
        id: 3,
        title: "Science Discovery",
        content: "Medium length content goes here. Medium length content goes here. Medium length content goes here. Medium length content goes here. This will create a medium-sized card.",
        imageUrl: "/api/placeholder/400/250"
      },
  ];

  return (
    <div className="container mx-auto px-4">
      <div 
        className="
          columns-1 
          md:columns-2 
          gap-4 
          space-y-4 
          [&>*:first-child]:mt-0
        "
      >
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="break-inside-avoid mb-4 bg-white rounded-lg shadow-md overflow-hidden transition-all hover:scale-[1.02] inline-block w-full"
          >
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;