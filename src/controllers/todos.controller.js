const service = require("../services/todos.service");

module.exports = {
  async list(req, res) {
    const data = await service.list();
    res.json(data);
  },
  async create(req, res) {
    const b = req.body || {};
    if (typeof b.title !== "string" || !b.title.trim()) {
      return res.status(400).json({ message: "title is required" });
    }
    const payload = {
      title: b.title.trim(),
      description: typeof b.description === "string" ? b.description : null,
      target_date: b.target_date ? String(b.target_date) : null,
      position: typeof b.position === "number" ? b.position : 0,
    };
    const created = await service.create(payload);
    res.status(201).json(created);
  },
  async update(req, res) {
    const { id } = req.params;
    const b = req.body || {};
    const patch = {
      ...(typeof b.title === "string" ? { title: b.title } : {}),
      ...(typeof b.completed === "boolean" ? { completed: b.completed } : {}),
      ...(typeof b.description === "string" ? { description: b.description } : {}),
      ...(typeof b.position === "number" ? { position: b.position } : {}),
      ...(b.target_date ? { target_date: String(b.target_date) } : {}),
    };
    const updated = await service.update(id, patch);
    res.json(updated);
  },
  async toggle(req, res) {
    const { id } = req.params;
    const updated = await service.toggle(id);
    res.json(updated);
  },
  async remove(req, res) {
    const { id } = req.params;
    await service.remove(id);
    res.status(204).end();
  },
};
