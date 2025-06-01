"use client";

import { useEffect, useState } from "react";
import { advocate } from "./_types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: { target: { value: string } }) => {
    const searchTerm = e.target.value.toLowerCase();

    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
      searchTermElement.innerHTML = searchTerm;
    }

    console.log("filtering advocates...", searchTerm);
    const filteredAdvocates = advocates.filter((advocate: advocate) => {
      const firstNameMatch = advocate.firstName
        .toLowerCase()
        .includes(searchTerm);
      const lastNameMatch = advocate.lastName
        .toLowerCase()
        .includes(searchTerm);
      const cityMatch = advocate.city.toLowerCase().includes(searchTerm);
      const degreeMatch = advocate.degree.toLowerCase().includes(searchTerm);
      const specialtiesMatch = advocate.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm)
      );
      const yearsMatch = String(advocate.yearsOfExperience)
        .toLowerCase()
        .includes(searchTerm);

      return (
        firstNameMatch ||
        lastNameMatch ||
        cityMatch ||
        degreeMatch ||
        specialtiesMatch ||
        yearsMatch
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate: advocate, index: number) => {
            return (
              <tr key={`${advocate.firstName}-${advocate.lastName}-${index}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, index) => (
                    <div key={index}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
