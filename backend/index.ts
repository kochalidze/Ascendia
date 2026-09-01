import 'dotenv/config';
import {app }from './src/server.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Better Auth app listening on port ${PORT}`);
});