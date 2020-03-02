class MiddelwaresUtils {
    static isAdmin(req, res, next) {
        if (req.session.connected !== 1 && req.session.user.role === 1) {
            throw new Error("Not connected");
        }
        next();
    }
}

module.exports = MiddelwaresUtils;