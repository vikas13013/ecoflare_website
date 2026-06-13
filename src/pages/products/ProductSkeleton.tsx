import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6 md:mb-8">
        <Skeleton width={120} height={28} />
      </div>
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div>
          <Skeleton height={320} className="rounded-xl" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={80} className="rounded-lg" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton height={36} width="70%" className="mb-4" />
          <Skeleton height={24} width="40%" className="mb-6" />
          <Skeleton count={4} className="mb-6" width="90%" />
          <div className="flex gap-4 mb-8">
            <Skeleton width={120} height={48} />
            <Skeleton width={120} height={48} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={80} className="rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;