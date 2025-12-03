// src/repositories/todos.repository.js
const { prisma } = require("../lib/prisma");

function toDbUpdate(data) {
  const update = {};

  if (typeof data.title === "string") update.title = data.title;
  if (typeof data.completed === "boolean") update.is_done = data.completed;
  if ("target_date" in data) {
    update.target_date = data.target_date ? new Date(data.target_date) : null;
  }

  return update;
}

module.exports = {
  async list() {
    return prisma.todos.findMany({
      orderBy: { id: "desc" },
    });
  },

  async findById(id) {
    return prisma.todos.findUnique({ where: { id } });
  },

  async create({ title, target_date = null }) {
    return prisma.todos.create({
      data: {
        title,
        target_date: target_date ? new Date(target_date) : null,
        is_done: false,
        // created_at 은 DB default(now())
      },
    });
  },

  async update(id, patch) {
    const data = toDbUpdate(patch);

    // 최소 한 개 필드는 있어야 update 가능
    if (Object.keys(data).length === 0) {
      throw new Error("No valid fields to update");
    }

    const row = await prisma.todos.update({
      where: { id },
      data,
    });

    return row;
  },

  async remove(id) {
    await prisma.todos.delete({ where: { id } });
  },
};
