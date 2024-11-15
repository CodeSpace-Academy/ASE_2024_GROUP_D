import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectToDatabase from "../../../../db";

export const authOptions = {
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
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name
                    };
                }
                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account.provider === "google") {
                const db = await connectToDatabase();
                const existingUser = await db.collection("users").findOne({ email: user.email });
                if (!existingUser) {
                    await db.collection("users").insertOne({
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        createdAt: new Date(),
                    });
                }
            }
            return true;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
