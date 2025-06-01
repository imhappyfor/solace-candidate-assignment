"use client";

import { useEffect, useState } from "react";
import { advocate } from "./_types/advocate";
import { PaginationControls } from "./_components/paginationControls";

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<advocate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState("firstName");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchAdvocates = async (
    page: number,
    limit: number,
    search?: string,
    sort?: string,
    order?: string
  ) => {
    setIsLoading(true);
    try {
      let url = `/api/advocates?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (sort) {
        url += `&sortField=${sort}&sortOrder=${order || "asc"}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setFilteredAdvocates(data.data);
      setTotalItems(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch advocates when debounced search term or other dependencies change
  useEffect(() => {
    fetchAdvocates(
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      sortField,
      sortOrder
    );
  }, [currentPage, itemsPerPage, debouncedSearchTerm, sortField, sortOrder]);

  const handleSort = (field: string) => {
    // If clicking the same field, toggle sort order
    if (field === sortField) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
    } else {
      // If clicking a new field, set it as sort field with default asc order
      setSortField(field);
      setSortOrder("asc");
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;

    return <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>;
  };

  const onChange = (e: { target: { value: string } }) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Reset to first page when searching
    setCurrentPage(1);
  };

  const onSearch = () => {
    // Force immediate search by setting debounced term to current search term
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900">Solace Advocates</h1>
      </div>
      <div className="text-center mb-8">
        <div className="max-w-md mx-auto">
          <p className="text-lg font-medium text-gray-700 mb-2">Search</p>
          <p className="text-sm text-gray-500 mb-4">
            Searching for:{" "}
            <span className="font-medium text-gray-700">
              {debouncedSearchTerm}
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <input
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-full sm:w-64"
              placeholder="Search advocates..."
              value={searchTerm}
              onChange={onChange}
              onKeyUp={(e) => e.key === "Enter" && onSearch()}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
              onClick={onSearch}
            >
              Search
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium w-full sm:w-auto"
              onClick={resetSearch}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-500">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-blue-900"
                  onClick={() => handleSort("firstName")}
                >
                  First Name {renderSortIndicator("firstName")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-blue-900"
                  onClick={() => handleSort("lastName")}
                >
                  Last Name {renderSortIndicator("lastName")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-blue-900"
                  onClick={() => handleSort("city")}
                >
                  City {renderSortIndicator("city")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-blue-900"
                  onClick={() => handleSort("degree")}
                >
                  Degree {renderSortIndicator("degree")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-gray-200">
                  Specialties
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-blue-900"
                  onClick={() => handleSort("yearsOfExperience")}
                >
                  Years of Experience {renderSortIndicator("yearsOfExperience")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-gray-200">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdvocates.length > 0 ? (
                filteredAdvocates.map((advocate: advocate, index: number) => (
                  <tr
                    key={`${advocate.firstName}-${advocate.lastName}-${index}`}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {advocate.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {advocate.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {advocate.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {advocate.degree}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        {advocate.specialties.map((s, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {advocate.yearsOfExperience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {advocate.phoneNumber ? (
                        <a
                          href={`tel:${advocate.phoneNumber}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {`(${advocate.phoneNumber
                            .toString()
                            .slice(0, 3)}) ${advocate.phoneNumber
                            .toString()
                            .slice(3, 6)}-${advocate.phoneNumber
                            .toString()
                            .slice(6, 10)}`}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No advocates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <PaginationControls
          filteredAdvocates={filteredAdvocates}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          totalPages={totalPages}
          setItemsPerPage={setItemsPerPage}
          paginate={paginate}
          setCurrentPage={setCurrentPage}
        />
      </>
    </main>
  );
}
