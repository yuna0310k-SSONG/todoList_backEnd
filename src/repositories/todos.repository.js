const { prisma } = require("../lib/prisma");

function toDbUpdate(data) {
  const update = {};
  if (typeof data.title === "string") update.title = data.title;
  if (typeof data.completed === "boolean") update.is_done = data.completed;
  if (typeof data.description === "string") update.description = data.description;
  if (data.target_date) update.target_date = new Date(data.target_date);
  if (typeof data.position === "number") update.position = data.position;
  return update;
}

module.exports = {
  async list() {
    return prisma.todos.findMany({ orderBy: { id: "desc" } });
  },

  async findById(id) {
    return prisma.todos.findUnique({ where: { id } });
  },

  async create({ title, description = null, target_date = null, position = 0 }) {
    return prisma.todos.create({
      data: {
        title,
        description,
        target_date: target_date ? new Date(target_date) : null,
        position,
        is_done: false,
      },
    });
  },

  async update(id, patch) {
    const data = toDbUpdate(patch);
    return prisma.todos.update({ where: { id }, data });
  },

  async remove(id) {
    await prisma.todos.delete({ where: { id } });
  },
};
