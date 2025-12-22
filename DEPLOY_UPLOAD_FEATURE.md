# 图片上传功能部署指南

## 📋 部署前准备

### 1. 确认改动已提交
```bash
git status
git add .
git commit -m "feat: 添加图片本地上传功能"
git push origin main
```

---

## 🚀 服务器部署步骤

### 方案一：Docker 部署（推荐）

#### 1. 更新 docker-compose.yml

需要为后端容器添加 volumes 配置，持久化上传的图片：

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: minna-backend
    restart: always
    ports:
      - "8001:8001"
    volumes:
      # 新增：持久化上传的图片
      - ./backend/uploads:/app/uploads
    environment:
      # ... 其他环境变量
```

#### 2. 在服务器上拉取最新代码

```bash
# SSH 登录服务器
ssh user@your-server

# 进入项目目录
cd /path/to/I-m-minna

# 拉取最新代码
git pull origin main

# 创建 uploads 目录并设置权限
mkdir -p backend/uploads
chmod 755 backend/uploads
```

#### 3. 重新构建并启动服务

```bash
# 停止旧服务
docker-compose down

# 重新构建后端（因为添加了 multer 依赖）
docker-compose build backend

# 启动所有服务
docker-compose up -d

# 查看日志确认启动成功
docker-compose logs -f backend
```

#### 4. 验证部署

```bash
# 检查后端容器是否正常运行
docker-compose ps

# 测试上传接口
curl -X POST http://your-domain.com/api/upload \
  -F "image=@test.jpg"

# 应该返回类似：
# {"success":true,"url":"/uploads/cover-1234567890-123456789.jpg","filename":"cover-1234567890-123456789.jpg"}
```

---

### 方案二：直接部署（非 Docker）

#### 1. 在服务器上更新代码

```bash
# SSH 登录服务器
ssh user@your-server

# 进入项目目录
cd /path/to/I-m-minna

# 拉取最新代码
git pull origin main
```

#### 2. 安装后端依赖

```bash
cd backend

# 安装新的依赖（multer）
npm install

# 创建上传目录
mkdir -p uploads
chmod 755 uploads
```

#### 3. 重启后端服务

```bash
# 如果使用 PM2
pm2 restart minna-backend

# 或者使用系统服务
sudo systemctl restart minna-backend

# 查看日志
pm2 logs minna-backend
# 或
sudo journalctl -u minna-backend -f
```

#### 4. 前端重新构建

```bash
cd ../frontend

# 安装依赖（如果有新的）
npm install

# 重新构建
npm run build

# 复制到 Nginx 目录（根据你的配置）
sudo cp -r dist/* /var/www/minna-blog/
```

#### 5. 重启 Nginx

```bash
# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 🔧 Nginx 配置（重要）

如果使用 Nginx 作为反向代理，需要配置：

### 1. 增加上传文件大小限制

编辑 Nginx 配置文件：

```nginx
http {
    # 全局设置
    client_max_body_size 10M;  # 允许上传 10MB 文件
    
    server {
        listen 80;
        server_name your-domain.com;
        
        # 前端静态文件
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }
        
        # 后端 API 代理
        location /api/ {
            proxy_pass http://backend:8001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            
            # 上传文件大小限制
            client_max_body_size 10M;
        }
        
        # 上传的图片文件代理
        location /uploads/ {
            proxy_pass http://backend:8001/uploads/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            
            # 图片缓存（可选）
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### 2. 重载 Nginx 配置

```bash
sudo nginx -t
sudo nginx -s reload
```

---

## 📁 文件权限设置

确保 Node.js 进程有权限写入 uploads 目录：

```bash
# Docker 方式
# 在宿主机上
chmod 755 backend/uploads
chown -R 1000:1000 backend/uploads  # Node.js 容器默认用户 ID

# 直接部署方式
# 在服务器上
cd backend
chmod 755 uploads
chown -R www-data:www-data uploads  # 或使用你的 Node.js 运行用户
```

---

## ✅ 部署检查清单

- [ ] 代码已推送到远程仓库
- [ ] 服务器已拉取最新代码
- [ ] 后端 multer 依赖已安装
- [ ] uploads 目录已创建并设置权限
- [ ] Docker volumes 已配置（Docker 部署）
- [ ] Nginx 上传大小限制已设置
- [ ] 后端服务已重启
- [ ] 前端已重新构建和部署
- [ ] 测试上传功能正常
- [ ] 上传的图片可以正常访问

---

## 🧪 测试步骤

### 1. 测试上传接口

```bash
# 使用 curl 测试
curl -X POST http://your-domain.com/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/test-image.jpg"

# 预期返回：
# {"success":true,"url":"/uploads/cover-xxxxx.jpg","filename":"cover-xxxxx.jpg"}
```

### 2. 测试图片访问

在浏览器访问：
```
http://your-domain.com/uploads/cover-xxxxx.jpg
```

应该能看到上传的图片。

### 3. 前端功能测试

1. 打开文章编辑器
2. 点击设置按钮
3. 在"封面图片"区域点击上传
4. 选择一张图片
5. 等待上传完成
6. 检查预览是否正常显示
7. 保存文章
8. 刷新页面，检查图片是否持久化

---

## 🐛 常见问题

### 1. 上传失败：413 Request Entity Too Large

**原因**：Nginx 上传文件大小限制

**解决**：
```nginx
# 在 nginx.conf 中添加
client_max_body_size 10M;
```

### 2. 上传成功但无法访问图片

**原因**：文件权限或路径问题

**解决**：
```bash
# 检查文件是否存在
ls -la backend/uploads/

# 设置正确权限
chmod 755 backend/uploads
chmod 644 backend/uploads/*
```

### 3. Docker 容器重启后图片丢失

**原因**：没有配置 volumes

**解决**：
在 `docker-compose.yml` 中添加：
```yaml
volumes:
  - ./backend/uploads:/app/uploads
```

### 4. CORS 错误

**原因**：跨域配置问题

**解决**：
检查 `backend/index.js` 中的 CORS 配置，确保允许你的前端域名。

---

## 📊 监控和维护

### 1. 定期清理旧图片（可选）

创建清理脚本 `backend/scripts/cleanup-uploads.sh`：

```bash
#!/bin/bash
# 删除 30 天前的图片
find /app/uploads -type f -mtime +30 -delete
echo "Cleanup completed: $(date)"
```

添加到 crontab：
```bash
# 每天凌晨 2 点执行
0 2 * * * /path/to/cleanup-uploads.sh >> /var/log/upload-cleanup.log 2>&1
```

### 2. 监控磁盘空间

```bash
# 查看 uploads 目录大小
du -sh backend/uploads

# 监控磁盘使用
df -h
```

### 3. 备份上传的图片

```bash
# 定期备份到远程服务器或对象存储
rsync -avz backend/uploads/ backup-server:/backups/uploads/
```

---

## 🔄 回滚方案

如果部署出现问题，可以快速回滚：

```bash
# 回退代码
git revert HEAD
git push origin main

# 或回到上一个版本
git reset --hard HEAD~1
git push -f origin main

# 重新部署
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 📝 补充说明

1. **生产环境优化**：考虑使用对象存储（如 AWS S3、阿里云 OSS）替代本地存储
2. **图片压缩**：可以添加图片压缩中间件优化性能
3. **安全性**：已实现文件类型和大小验证，可以进一步添加防病毒扫描
4. **CDN 加速**：可以将 `/uploads` 目录配置 CDN 加速访问

---

## 🎯 完成标志

部署成功后，你应该能够：
- ✅ 在文章编辑器中上传图片
- ✅ 实时预览上传的图片
- ✅ 保存后图片正常显示
- ✅ 刷新页面图片依然可访问
- ✅ 图片在服务器重启后依然存在
