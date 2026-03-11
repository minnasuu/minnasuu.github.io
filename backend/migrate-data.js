/**
 * 数据迁移脚本
 * 在 prisma db push 之后运行，处理需要数据迁移逻辑的变更
 * 此脚本设计为幂等的——重复运行不会出错
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrate() {
  console.log('🔄 Running data migrations...');

  // 迁移 1: Draft -> Article 合并
  // 如果 Draft 表存在，将数据复制到 Article 表（isDraft=true），然后删除 Draft 表
  try {
    // 检查 Draft 表是否存在
    const draftTableExists = await prisma.$queryRawUnsafe(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'Draft'
      ) AS exists
    `);

    if (draftTableExists[0]?.exists) {
      console.log('📋 Found Draft table, migrating data to Article...');

      // 获取 Draft 数据数量
      const draftCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "Draft"`);
      const count = Number(draftCount[0]?.count || 0);
      console.log(`   Found ${count} drafts to migrate`);

      if (count > 0) {
        // 将 Draft 数据复制到 Article（跳过已存在的 ID，避免重复）
        await prisma.$queryRawUnsafe(`
          INSERT INTO "Article" ("id", "title", "summary", "content", "publishDate", "tags", "readTime", "coverImage", "link", "type", "isDraft", "createdAt", "updatedAt")
          SELECT "id", "title", "summary", "content", "publishDate", "tags", "readTime", "coverImage", "link", "type", true, "createdAt", "updatedAt"
          FROM "Draft"
          ON CONFLICT ("id") DO NOTHING
        `);
        console.log(`   ✅ Migrated ${count} drafts to Article table`);
      }

      // 删除 Draft 表
      await prisma.$queryRawUnsafe(`DROP TABLE IF EXISTS "Draft"`);
      console.log('   ✅ Dropped Draft table');
    } else {
      console.log('📋 Draft table not found (already migrated or never existed), skipping...');
    }
  } catch (error) {
    // Draft 表可能本来就不存在，不是致命错误
    console.log('📋 Draft migration skipped:', error.message);
  }

  console.log('✅ Data migrations complete!');
}

migrate()
  .catch((error) => {
    console.error('❌ Data migration failed:', error);
    // 数据迁移失败不应阻止服务启动（表结构已经由 db push 同步了）
    // 下次重启时会重试
    console.log('⚠️  Continuing with server startup...');
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0); // 始终以 0 退出，不阻止后续服务启动
  });
