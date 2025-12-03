const repo = require("../repositories/todos.repository");

function mapToDto(row) {
  return {
    id: String(row.id),
    title: row.title,
    completed: !!row.is_done,
    createdAt: row.created_at?.toISOString?.() || row.created_at,
    updatedAt: row.updated_at?.toISOString?.() || row.updated_at,
    target_date: row.target_date?.toISOString?.().slice(0, 10) || (typeof row.target_date === "string" ? row.target_date.slice(0, 10) : null),
  };
}

module.exports = {
  async list() {
    const rows = await repo.list();
    return rows.map(mapToDto);
  },
  async create({ title, description = null, target_date = null, position = 0 }) {
    const row = await repo.create({ title, description, target_date, position });
    return mapToDto(row);
  },
  async toggle(id) {
    const current = await repo.findById(Number(id));
    if (!current) throw new Error("Not Found");
    const row = await repo.update(Number(id), { completed: !current.is_done });
    return mapToDto(row);
  },
  async update(id, { title, completed, description, target_date, position }) {
    const row = await repo.update(Number(id), { title, completed, description, target_date, position });
    return mapToDto(row);
  },
  async remove(id) {
    await repo.remove(Number(id));
  },
};
