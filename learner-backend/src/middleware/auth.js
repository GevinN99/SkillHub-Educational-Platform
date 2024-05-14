const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

exports.comparePassword = async (password, hashedPassword) => {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
};

exports.generateToken = (user) => {
    const payload = {
        id: user._id,
        username: user.email,
        role: user.userType
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' });
    return token;
};

exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (err) {
        return null;
    }
};

exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Access Denied');
    }
    const token = authHeader.split(' ')[1];
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        console.log('Verified user:', verified);
        req.user = verified;
        next();
    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid Token');
    }
};
