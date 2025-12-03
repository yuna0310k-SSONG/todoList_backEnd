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
      target_date: b.target_date ? String(b.target_date) : null,
    };
    const created = await service.create(payload);
    res.status(201).json(created);
  },
  async update(req, res) {
    const { id } = req.params;
    const b = req.body || {};

    // 필드 구성: 전달된 키만 사용, target_date는 null로도 클리어 가능
    const patch = {
      ...(typeof b.title === "string" ? { title: b.title } : {}),
      ...(typeof b.completed === "boolean" ? { completed: b.completed } : {}),
      ...("target_date" in b ? { target_date: b.target_date ? String(b.target_date) : null } : {}),
    };

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    try {
      const updated = await service.update(id, patch);
      res.json(updated);
    } catch (err) {
      if (err && err.message === "No valid fields to update") {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }
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
