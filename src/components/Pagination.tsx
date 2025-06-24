type Props = {
  current: number;
  onChange: (page: number) => void;
  totalPages?: number;
};

export function Pagination({ current, onChange, totalPages = 10 }: Props) {
  return (
    <div className="flex justify-center space-x-2 mt-6">
      {current > 1 && (
        <button
          onClick={() => onChange(current - 1)}
          className="px-3 py-1 border rounded"
        >
          Previous
        </button>
      )}
      
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`px-3 py-1 border rounded ${current === page ? 'bg-blue-500 text-white' : ''}`}
          >
            {page}
          </button>
        );
      })}
      
      {current < totalPages && (
        <button
          onClick={() => onChange(current + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      )}
    </div>
  );
}