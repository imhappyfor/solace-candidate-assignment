import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { sql, asc, desc } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") || "firstName";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const offset = (page - 1) * limit;

  let data;
  let totalCount;

  if (process.env.DATABASE_URL) {
    const dbInstance = db as PostgresJsDatabase<any>;

    // Build the where condition for search
    const searchCondition = search
      ? sql`LOWER(first_name) LIKE ${`%${search.toLowerCase()}%`} OR
        LOWER(last_name) LIKE ${`%${search.toLowerCase()}%`} OR
        LOWER(city) LIKE ${`%${search.toLowerCase()}%`} OR
        LOWER(degree) LIKE ${`%${search.toLowerCase()}%`}`
      : undefined;

    // Add sorting - map frontend field names to database column objects
    let column;
    switch (sortField) {
      case "firstName":
        column = advocates.firstName;
        break;
      case "lastName":
        column = advocates.lastName;
        break;
      case "city":
        column = advocates.city;
        break;
      case "degree":
        column = advocates.degree;
        break;
      case "yearsOfExperience":
        column = advocates.yearsOfExperience;
        break;
      default:
        throw new Error(`Invalid sort field: ${sortField}`);
    }

    // Build and execute the main query
    const queryBuilder = dbInstance.select().from(advocates);
    if (searchCondition) {
      data = await queryBuilder
        .where(searchCondition)
        .orderBy(sortOrder === "asc" ? asc(column) : desc(column))
        .limit(limit)
        .offset(offset);
    } else {
      data = await queryBuilder
        .orderBy(sortOrder === "asc" ? asc(column) : desc(column))
        .limit(limit)
        .offset(offset);
    }

    // Get total count for pagination metadata
    const countQueryBuilder = dbInstance
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(advocates);

    if (searchCondition) {
      const countResult = await countQueryBuilder.where(searchCondition);
      totalCount = countResult[0]?.count || 0;
    } else {
      const countResult = await countQueryBuilder;
      totalCount = countResult[0]?.count || 0;
    }
  } else {
    // Fallback to static data with client-side filtering and sorting
    let filteredData = [...advocateData];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(
        (advocate) =>
          advocate.firstName.toLowerCase().includes(searchLower) ||
          advocate.lastName.toLowerCase().includes(searchLower) ||
          advocate.city.toLowerCase().includes(searchLower) ||
          advocate.degree.toLowerCase().includes(searchLower) ||
          advocate.specialties.some((s) =>
            s.toLowerCase().includes(searchLower)
          ) ||
          String(advocate.yearsOfExperience).includes(searchLower)
      );
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

    totalCount = filteredData.length;
    data = filteredData.slice(offset, offset + limit);
  }

  return Response.json({
    data,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
}
