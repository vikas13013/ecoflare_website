import React, { useState, useRef, useCallback } from "react";
import { FiZoomIn, FiX } from "react-icons/fi";

interface ProductImageGalleryProps {
  images: Array<{ id: number; image: string }>;
  productImage: string;
  productName: string;
  isFlexibleBuying?: boolean;
  organicCertified?: boolean;
  onImageClick?: () => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productImage,
  productName,
  isFlexibleBuying,
  organicCertified,
  onImageClick,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomedImageRef = useRef<HTMLDivElement>(null);

  const galleryImages = images?.length ? images : [{ id: 0, image: productImage }];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!showZoom || !containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    // Calculate mouse position relative to container
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    // Calculate lens position (centered on mouse)
    const lensSize = 150; // Size of the lens
    let lensLeft = mouseX - lensSize / 2;
    let lensTop = mouseY - lensSize / 2;

    // Constrain lens within container bounds
    lensLeft = Math.max(0, Math.min(lensLeft, containerRect.width - lensSize));
    lensTop = Math.max(0, Math.min(lensTop, containerRect.height - lensSize));

    // Calculate zoom position percentage for the zoomed image
    const zoomX = (lensLeft / (containerRect.width - lensSize)) * 100;
    const zoomY = (lensTop / (containerRect.height - lensSize)) * 100;

    // Update lens position
    if (lensRef.current) {
      lensRef.current.style.left = `${lensLeft}px`;
      lensRef.current.style.top = `${lensTop}px`;
    }

    // Update zoomed image position
    if (zoomedImageRef.current) {
      zoomedImageRef.current.style.backgroundPosition = `${zoomX}% ${zoomY}%`;
    }

    setZoomPosition({ x: zoomX, y: zoomY });
  }, [showZoom]);

  const handleMouseEnter = useCallback(() => {
    if (showZoom) {
      setShowLens(true);
    }
  }, [showZoom]);

  const handleMouseLeave = useCallback(() => {
    setShowLens(false);
  }, []);

  const toggleZoom = useCallback(() => {
    setShowZoom(!showZoom);
    setShowLens(false);
  }, [showZoom]);

  const handleImageLoad = useCallback(() => {
    // Reset zoom state when image changes
    setShowLens(false);
  }, []);

  return (
    <div className="lg:w-2/5">
      <div className="relative">
        {/* Main Image Container */}
        <div
          ref={containerRef}
          className="relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
          style={{ aspectRatio: "1/1" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onImageClick}
        >
          {/* Main Image */}
          <img
            ref={imageRef}
            src={galleryImages[selectedImage]?.image}
            alt={productName}
            className="w-full h-full object-contain"
            onLoad={handleImageLoad}
            draggable={false}
          />

          {/* Zoom Lens */}
          {showZoom && showLens && (
            <div
              ref={lensRef}
              className="absolute border-2 border-green-500 bg-white/20 pointer-events-none"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.5)",
              }}
            />
          )}

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            {isFlexibleBuying && (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                Flexible Buying
              </span>
            )}
            {organicCertified && (
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                Organic
              </span>
            )}
          </div>

          {/* Zoom Toggle Button */}
          <button
            onClick={toggleZoom}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors z-10"
            title={showZoom ? "Disable zoom" : "Enable zoom"}
          >
            {showZoom ? <FiX size={20} /> : <FiZoomIn size={20} />}
          </button>
        </div>

        {/* Zoomed Image Result - Separate from main container */}
        {showZoom && showLens && (
          <div
            ref={zoomedImageRef}
            className="absolute hidden lg:block"
            style={{
              left: "calc(100% + 20px)",
              top: 0,
              width: "500px",
              height: "500px",
              backgroundImage: `url(${galleryImages[selectedImage]?.image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "200%",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              zIndex: 50,
              backgroundColor: "white",
            }}
          />
        )}
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2 mt-4">
          {galleryImages.map((img: any, index: number) => (
            <button
              key={img.id || index}
              onClick={() => {
                setSelectedImage(index);
                setShowLens(false);
              }}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={img.image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;