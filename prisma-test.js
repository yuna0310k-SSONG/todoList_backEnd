// prisma-test.js
const { prisma } = require("./src/lib/prisma");

async function main() {
  // 1) 아무 todo 하나 가져오기
  const first = await prisma.todos.findFirst();
  if (!first) {
    console.log("todo가 하나도 없어요. 하나 만들어주세요!");
    return;
  }

  console.log("📌 BEFORE:", first.id, first.updated_at);

  // 2) title만 살짝 수정
  const updated = await prisma.todos.update({
    where: { id: first.id },
    data: { title: first.title + " *" },
  });

  console.log("✅ AFTER :", updated.id, updated.updated_at);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
