import { advocate } from "../_types/advocate";
import React from "react";

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

function getPageButtons(
  currentPage: number,
  totalPages: number,
  paginate: (page: number) => void
) {
  // Helper to render a page button
  const pageBtn = (num: number) => (
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
  );

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => pageBtn(i + 1));
  }

  // More than 7 pages: show ellipsis logic
  const buttons = [];
  if ([1, 2, 3].includes(currentPage)) {
    [1, 2, 3, 4].forEach((num) => buttons.push(pageBtn(num)));
    buttons.push(<span key="start-ellipsis" className="px-3 py-1">...</span>);
    buttons.push(pageBtn(totalPages));
  } else if (currentPage > 3 && currentPage < totalPages - 2) {
    buttons.push(pageBtn(1));
    buttons.push(<span key="mid-ellipsis-left" className="px-3 py-1">...</span>);
    [currentPage - 1, currentPage, currentPage + 1].forEach((num) =>
      buttons.push(pageBtn(num))
    );
    buttons.push(<span key="mid-ellipsis-right" className="px-3 py-1">...</span>);
    buttons.push(pageBtn(totalPages));
  } else {
    buttons.push(pageBtn(1));
    buttons.push(<span key="end-ellipsis" className="px-3 py-1">...</span>);
    [totalPages - 3, totalPages - 2, totalPages - 1, totalPages].forEach((num) =>
      buttons.push(pageBtn(num))
    );
  }
  return buttons;
}

export function PaginationControls({
  filteredAdvocates,
  currentPage,
  itemsPerPage,
  totalItems,
  paginate,
  totalPages,
  setItemsPerPage,
  setCurrentPage,
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
        {getPageButtons(currentPage, totalPages, paginate)}
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
  );
}