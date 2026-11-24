const ProductGridSkeleton = ({ count = 8 }) => (
  <div
    aria-hidden
    className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <div className="skeleton aspect-[4/5] rounded-xl" />
        <div className="skeleton mt-3 h-4 w-3/4" />
        <div className="skeleton mt-2 h-4 w-1/3" />
      </div>
    ))}
  </div>
);

export default ProductGridSkeleton;
