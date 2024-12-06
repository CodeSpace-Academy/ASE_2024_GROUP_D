import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from "bcryptjs";
import connectToDatabase from "./db";

export const { handlers: {GET, POST}, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const db = await connectToDatabase();
                const user = await db.collection("users").findOne({ email: credentials.email });

                if (user && await bcrypt.compare(credentials.password, user.password)) {
                    return { id: user._id, email: user.email };
                }
                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            return session;
        },

        // SignIn callback to add Google users to MongoDB
        async signIn({ user, account }) {
            if (account.provider === "google") {
                const db = await connectToDatabase();
                
                // Check if the user exists in the database
                const existingUser = await db.collection("users").findOne({ email: user.email });
                
                if (!existingUser) {
                    // Add new Google-authenticated user to the database
                    await db.collection("users").insertOne({
                        email: user.email,
                        name: user.name,
                        image: user.image,  // Store profile image if needed
                        createdAt: new Date(),
                    });
                }
            }
            return true;
        },
    },
});




