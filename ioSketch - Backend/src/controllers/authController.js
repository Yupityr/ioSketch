import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await prisma.user.findUnique({
        where: {email},
    });


    if (userExists) { 
        return res.status(400).json({error: "user already exists"});
    };

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    //create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        },
    });

    //JWT Token
    const token = generateToken(user.id, res)

    res.status(201).json({
        status: "success",
        data: {
            user:{
                id: user.id,
                name: user.name,
                email: user.email
            },
            token,
        }
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {email: email},
    });

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password"})
    }

    //verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({error : "Invalid email or password"})
    }

    //JWT Token
    const token = generateToken(user.id, res)

    res.status(201).json({
        status: "Sign in successful",
        data: {
            user:{
                id: user.id,
                email: user.email
            },
            token,
        }
    });
};

const signout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({
        status: "Signed out",
        message: "Sign out successfully"
    })
}

export {register, login, signout};