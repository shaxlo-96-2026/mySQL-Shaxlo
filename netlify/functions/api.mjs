import mysql from "mysql2/promise";

export default async (req) => {
  const db = await mysql.createConnection({
    host: process.env.HOST,
    port: Number(process.env.PORT || 4000),
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
  });

  try {
    if (req.method === "POST") {
      const { name } = await req.json();
      const clean = String(name ?? "").trim().slice(0, 100);
      if (clean) {
        await db.execute("INSERT INTO notes (name) VALUES (?)", [clean]);
      }
    }
    const [rows] = await db.execute(
      "SELECT name, created_at FROM notes ORDER BY id DESC LIMIT 50"
    );
    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: "Server xatosi" }, { status: 500 });
  } finally {
    await db.end();
  }
};
