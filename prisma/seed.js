import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
  console.log("Sowing seeds... 🌱");

  // 1. DAFTAR PERMISSIONS
  const permissions = [
    // Dashboard
    { code: "dashboard:view", description: "Melihat statistik dashboard" },
    // Master Data: Authors
    { code: "author:view", description: "Melihat daftar penulis" },
    { code: "author:create", description: "Menambah penulis baru" },
    { code: "author:update", description: "Mengubah data penulis" },
    { code: "author:delete", description: "Menghapus data penulis" },
    // Master Data: Publishers
    { code: "publisher:view", description: "Melihat daftar penerbit" },
    { code: "publisher:create", description: "Menambah penerbit baru" },
    { code: "publisher:update", description: "Mengubah data penerbit" },
    { code: "publisher:delete", description: "Menghapus data penerbit" },
    // Books
    { code: "book:view", description: "Melihat daftar buku" },
    { code: "book:create", description: "Menambah buku baru" },
    { code: "book:update", description: "Mengubah data buku" },
    { code: "book:delete", description: "Menghapus data buku" },
    // User Access Management (UAM)
    { code: "user:view", description: "Melihat daftar user" },
    {
      code: "user:manage",
      description: "Menambah, mengubah, dan menghapus user",
    },
    { code: "role:manage", description: "Mengatur roles dan permissions" },
  ];

  console.log("Upserting permissions...");
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  // 2. DEFAULT ROLE (SUPER_ADMIN)
  console.log("Creating default roles...");
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "Akses penuh ke seluruh sistem",
    },
  });

  // 3. CONNECT ALL PERMISSIONS TO SUPER_ADMIN
  console.log("Assigning all permissions to SUPER_ADMIN...");
  const allPermissions = await prisma.permission.findMany();

  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: p.id,
      },
    });
  }

  console.log("Seeding finished successfully! 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
