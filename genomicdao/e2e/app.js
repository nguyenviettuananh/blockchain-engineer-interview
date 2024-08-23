const express = require('express');
const { submitGeneData, getGeneDataReport } = require('./service/geneData');
const { safetyExecution } = require('./service/tee');
const { generateToken, jwtMiddleware } = require('./service/auth');
require('dotenv').config("../.env")
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


const users = [
    { id: 1, email: 'user@example.com', password: 'password123' },
];


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const token = generateToken(user);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid email or password' });
    }
});

app.post('/admin/execution', async (req, res) => {
    try {
        // verify is admin, allow to execute user gene or not
        const userId = req.body.userId
        const executionResult = await safetyExecution(userId)
        res.status(200).json(executionResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.use(jwtMiddleware);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ code: 401, message: 'unauthorized' });
    }
    next()
});

// app.use((req, res, next) => {
//     const publicPaths = ['/login', '/signup']; 

//     if (publicPaths.includes(req.path)) {
//       return next(); 
//     }

//     jwtMiddleware({
//         secret: process.env.JWT_SECRET_KEY,
//         algorithms: ['HS256'],
//         requestProperty: 'auth', // This is where express-jwt stores the decoded token
//     })(req, res, function(err, req, res, next) { // Add an error handling callback
//         if (err) {
//             if (err.name === 'UnauthorizedError') {
//                 return res.status(401).json({ message: 'Invalid token' });
//             }
//             return res.status(500).json({ message: 'Internal server error' });
//         }
//         console.log
//         // Assuming your JWT payload contains a 'user' property
//         req.user = req.auth.user; // Assign the user to req.user
//         next(); 
//     });
// });
  
  // Custom error handling middleware for JWT
// app.use((err, req, res, next) => {
// if (err.name === 'UnauthorizedError') {
//     res.status(401).json({ code: 401, message: 'unauthorized' });
// } else {
//     next(err);
// }
// });
  


app.post('/submit-gene-data', async (req, res) => {
    try {
        const { geneData } = req.body;
        const result = await submitGeneData(req.user.id, geneData);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/me/gene-data', async (req, res) => {
    try {
        const result = await getGeneDataReport(req.user.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
