import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema";
import { db } from "../db";

const router = express.Router();

// Get all subjects with optional search, filtering pagination
router.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<Number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(departments.id, subjects.departmentId))
      .where(whereClause);
    
    const totalCount = countResult[0]?.count ?? 0;

    const subjectsList = await db
      .select({...getTableColumns(subjects), department: {
        ...getTableColumns(departments)
      }})
      .from(subjects)
      .leftJoin(departments, eq(departments.id, subjects.departmentId))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .offset(offset)
      .limit(limitPerPage);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount as number / limitPerPage)
      }
    })
  } catch (e) {
    console.error(`GET /subjects error: ${e}`);
    res.status(500).json({ error: "Failed to get subject." });
  }
});

export default router;