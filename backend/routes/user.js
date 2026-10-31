
import express from 'express';
import User from '../models/user.js';
import passport from 'passport';

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newUser = new User({
            username,
            email
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            res.status(201).json({
                message: "Signup successful",
                user: {
                    id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email
                }
            });
        });

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

// Login Route
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                message: info?.message || "Invalid username or password"
            });
        }

        req.login(user, (err) => {
            if (err) {
                return next(err);
            }

            res.status(200).json({
                message: "Login successful",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        });
    })(req, res, next);
});

// Check Login Session
router.get("/me", (req, res) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({
            authenticated: false
        });
    }

    res.status(200).json({
        authenticated: true,
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email
        }
    });
});
// Logout Route
router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    message: "Logout failed"
                });
            }

            res.clearCookie("connect.sid");

            return res.status(200).json({
                message: "Logout successful"
            });
        });
    });
});
export default router;
