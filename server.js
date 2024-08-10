import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// import rules from './routes/router.js';
// import logger from './middleware/logger.js';
// import errorHandler from './middleware/error.js';
// import notFound from './middleware/notFound.js';  

const port = process.env.PORT || 8000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//set view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'ul-book/site/'));

//home
app.get('/', (req,res) => { 
    res.render("index")
    // console.log('get')
})

//about
app.get('/about', (req,res) => { 
    res.render("about")
})

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
// app.use(logger);

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// app.use('/api/rules', rules);
// app.use('/api/theorems', rules);

// Error handler
// app.use(notFound);
// app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
