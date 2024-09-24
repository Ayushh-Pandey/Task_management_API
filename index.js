const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT;

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('server is running')
})

const userRoutes = require('./routes/userRoute');
const taskRoutes = require('./routes/taskRoute');
const connectDB = require('./config/database');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/user',userRoutes);
app.use('/task',taskRoutes);

app.listen(PORT,()=>{
    console.log(`server is live on http://localhost:${PORT}`);
})

connectDB();