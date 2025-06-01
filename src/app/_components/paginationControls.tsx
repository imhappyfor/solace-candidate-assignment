import { advocate } from "../_types/advocate";

// pagination component

type PaginationControlsProps = {
  filteredAdvocates: advocate[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  totalPages: number;
  setItemsPerPage: (items: number) => void;
  setCurrentPage: (page: number) => void;
};
export function PaginationControls ({
  filteredAdvocates,
  currentPage,
  itemsPerPage,
  totalItems,
  paginate,
  totalPages,
  setItemsPerPage,
  setCurrentPage
}: PaginationControlsProps) {

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {filteredAdvocates.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> advocates
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            {totalPages <= 7 ? (
              // Show all pages if there are 7 or fewer
              Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              // Show limited pages with ellipsis for many pages
              <>
                {[1, 2, 3].includes(currentPage) && (
                  <>
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => paginate(num)}
                        className={`px-3 py-1 rounded ${
                          currentPage === num
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <span className="px-3 py-1">...</span>
                    <button
                      onClick={() => paginate(totalPages)}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {currentPage > 3 && currentPage < totalPages - 2 && (
                  <>
                    <button
                      onClick={() => paginate(1)}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      1
                    </button>
                    <span className="px-3 py-1">...</span>
                    {[currentPage - 1, currentPage, currentPage + 1].map(
                      (num) => (
                        <button
                          key={num}
                          onClick={() => paginate(num)}
                          className={`px-3 py-1 rounded ${
                            currentPage === num
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {num}
                        </button>
                      )
                    )}
                    <span className="px-3 py-1">...</span>
                    <button
                      onClick={() => paginate(totalPages)}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {[totalPages - 2, totalPages - 1, totalPages].includes(
                  currentPage
                ) && (
                  <>
                    <button
                      onClick={() => paginate(1)}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      1
                    </button>
                    <span className="px-3 py-1">...</span>
                    {[
                      totalPages - 3,
                      totalPages - 2,
                      totalPages - 1,
                      totalPages,
                    ].map((num) => (
                      <button
                        key={num}
                        onClick={() => paginate(num)}
                        className={`px-3 py-1 rounded ${
                          currentPage === num
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </>
                )}
              </>
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>

          <div className="flex items-center">
            <label className="text-sm text-gray-700 mr-2">
              Items per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 10, 25, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
)
}