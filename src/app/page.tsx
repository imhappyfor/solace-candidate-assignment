"use client";

import { useEffect, useState } from "react";
import { advocate } from "./_types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState<advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<advocate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
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

      setAdvocates(data.data);
      setFilteredAdvocates(data.data);
      setTotalItems(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates(currentPage, itemsPerPage, searchTerm, sortField, sortOrder);
  }, [currentPage, itemsPerPage, searchTerm, sortField, sortOrder]);

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
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Reset to first page when searching
    setCurrentPage(1);

    // For client-side filtering (if needed)
    // We'll keep this for now, but ideally search should be handled server-side
    const filtered = advocates.filter((advocate: advocate) => {
      const firstNameMatch = advocate.firstName.toLowerCase().includes(term);
      const lastNameMatch = advocate.lastName.toLowerCase().includes(term);
      const cityMatch = advocate.city.toLowerCase().includes(term);
      const degreeMatch = advocate.degree.toLowerCase().includes(term);
      const specialtiesMatch = advocate.specialties.some((specialty) =>
        specialty.toLowerCase().includes(term)
      );
      const yearsMatch = String(advocate.yearsOfExperience)
        .toLowerCase()
        .includes(term);

      return (
        firstNameMatch ||
        lastNameMatch ||
        cityMatch ||
        degreeMatch ||
        specialtiesMatch ||
        yearsMatch
      );
    });

    setFilteredAdvocates(filtered);
  };

  const onSearch = () => {
    fetchAdvocates(1, itemsPerPage, searchTerm);
  };

  const resetSearch = () => {
    setSearchTerm("");
    const searchInput = document.querySelector(
      'input[placeholder="Search advocates..."]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
    }
    fetchAdvocates(1, itemsPerPage);
  };

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Solace Advocates</h1>
      </div>
      <div className="text-center mb-8">
        <div className="max-w-md mx-auto">
          <p className="text-lg font-medium text-gray-700 mb-2">Search</p>
          <p className="text-sm text-gray-500 mb-4">
            Searching for:{" "}
            <span className="font-medium text-gray-700">{searchTerm}</span>
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
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("firstName")}
                >
                  First Name {renderSortIndicator("firstName")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("lastName")}
                >
                  Last Name {renderSortIndicator("lastName")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("city")}
                >
                  City {renderSortIndicator("city")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("degree")}
                >
                  Degree {renderSortIndicator("degree")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Specialties
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("yearsOfExperience")}
                >
                  Years of Experience {renderSortIndicator("yearsOfExperience")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
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
      </>
    </main>
  );
}
