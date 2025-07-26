import jwt from 'jsonwebtoken';

export const testToken = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (token == null) {
        return res.status(401).send({ message: 'לא נמצא משתמש התואם לפרטים' });
    }
    // אימות הטוקן
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send({ message: 'הטוקן אינו תקין' });
        }
        req.user = user;
        next();
    });
};




