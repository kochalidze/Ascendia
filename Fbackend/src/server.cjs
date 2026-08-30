const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT ;

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// console.log(PORT);	

// * ____________________Routers____________________
const authRouter = require('./routers/auth.router.cjs');
const postsRouter = require('./routers/posts.router.cjs');
const usersRouter = require('./routers/users.router.cjs');

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 