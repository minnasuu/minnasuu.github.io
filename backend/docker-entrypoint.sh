#!/bin/sh
echo "=========================================="
echo "🚀 Backend starting..."
echo "=========================================="

# Step 1: 数据迁移（在 db push 之前保护 Draft 数据）
echo ""
echo "[Step 1/3] Running data migration..."
node migrate-data.js
echo "[Step 1/3] Done (exit: $?)"

# Step 2: 同步数据库 schema
echo ""
echo "[Step 2/3] Running prisma db push..."
npx prisma db push --skip-generate --accept-data-loss 2>&1
DB_PUSH_EXIT=$?
echo "[Step 2/3] Done (exit: $DB_PUSH_EXIT)"

if [ $DB_PUSH_EXIT -ne 0 ]; then
  echo "⚠️  prisma db push failed with exit code $DB_PUSH_EXIT"
  echo "⚠️  Trying again in 5 seconds..."
  sleep 5
  npx prisma db push --skip-generate --accept-data-loss 2>&1
  DB_PUSH_EXIT=$?
  echo "[Step 2/3] Retry done (exit: $DB_PUSH_EXIT)"
  if [ $DB_PUSH_EXIT -ne 0 ]; then
    echo "❌ prisma db push failed after retry. Exiting."
    exit 1
  fi
fi

# Step 3: 启动服务
echo ""
echo "[Step 3/3] Starting server..."
exec node index.js
