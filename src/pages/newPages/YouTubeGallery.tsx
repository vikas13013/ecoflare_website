import React from 'react';

interface VideoItem {
  title: string;
  youtubeUrl: string;
}

const videos: VideoItem[] = [
  {
    title: '',
    youtubeUrl: "https://www.youtube.com/embed/73W1dxJF3-s?si=iGyo5w-GAZj3ecrg",
  },
  {
    title: '',
    youtubeUrl: 'https://www.youtube.com/embed/F_3VYQ3gvj8?si=l7gYl3tZnbl4575m',
  },
  
  {
    title: ' ',
    youtubeUrl: "https://www.youtube.com/embed/0upoAWz1iFA?si=cwardSzz-e-cqWHh",
  },
];

const YouTubeGallery: React.FC = () => {
  return (
    <div className=" bg-gray-50 py-10 px-4 md:px-16">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 border-l-4 border-red-500 pl-4">Video Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={video.youtubeUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            {/* <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-700">{video.title}</h2>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeGallery;
