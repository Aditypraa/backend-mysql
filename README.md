<h1 align="center" id="title">Backend With Mysql</h1>

<p align="center"><img src="https://socialify.git.ci/Aditypraa/backend-mysql/image?description=1&amp;descriptionEditable=ExpressJs%20%2B%20Prisma%20%2B%20Mysql&amp;forks=1&amp;issues=1&amp;language=1&amp;name=1&amp;owner=1&amp;pulls=1&amp;stargazers=1&amp;theme=Light" alt="project-image"></p>

<h2>🚀 Link Postman</h2>

[https://www.postman.com/speeding-moon-312702/workspace/backend-mysql/collection/24667557-28ca2402-73e9-4a16-bbc9-ebdbdf10f93b?action=share&creator=24667557](https://www.postman.com/speeding-moon-312702/workspace/backend-mysql/collection/24667557-28ca2402-73e9-4a16-bbc9-ebdbdf10f93b?action=share&creator=24667557)

<h2>🛠️ Installation Steps:</h2>

<p>1. Cloning</p>

```
git clone https://github.com/Aditypraa/backend-mysql
```

<p>2. masuk ke folder</p>

```
cd backend-mysql
```

<p>3. install</p>

```
npm install
```

<p>4. copy file .env.development</p>

```
Linux   : cp .env.development .env
Windows : copy .env.development .env
```

<p>5. setup env</p>

```
DATABASE_URL="mysql://{username}:{password}@localhost:3306/{nama_database}"
```

<p>6. example env</p>

```
PORT=3000
DATABASE_URL="mysql://root:root@localhost:3306/backend_mysql"
```

<p>7. Migrate Database</p>

```
npx prisma migrate dev --name init
```

<p>8. Running</p>

```
npm run dev
```
