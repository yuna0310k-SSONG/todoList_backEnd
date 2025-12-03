// src/services/todos.service.js
const repo = require("../repositories/todos.repository");

function mapToDto(row) {
  return {
    id: String(row.id),
    title: row.title,
    completed: !!row.is_done,
    createdAt: row.created_at?.toISOString?.() || row.created_at,
    target_date: row.target_date?.toISOString?.().slice(0, 10) || (typeof row.target_date === "string" ? row.target_date.slice(0, 10) : null),
  };
}

module.exports = {
  async list() {
    const rows = await repo.list();
    return rows.map(mapToDto);
  },

  async create({ title, target_date = null }) {
    const row = await repo.create({
      title,
      target_date,
    });
    return mapToDto(row);
  },

  // 체크 토글
  async toggle(id) {
    const numericId = Number(id);
    const current = await repo.findById(numericId);
    if (!current) throw new Error("Not Found");

    const row = await repo.update(numericId, {
      completed: !current.is_done, // ← repo.toDbUpdate 에서 is_done 으로 매핑
    });

    return mapToDto(row);
  },

  // Edit → Save
  async update(id, { title, completed, target_date }) {
    const numericId = Number(id);

    const row = await repo.update(numericId, {
      title,
      completed,
      target_date,
    });

    return mapToDto(row);
  },

  async remove(id) {
    await repo.remove(Number(id));
  },
};
