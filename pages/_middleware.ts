import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const baseUrl = process.env.BASE_URL;
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session && req.url.includes("/api/auth")) return NextResponse.next();
  if (!session && req.url.includes(`${baseUrl}/student`))
    return NextResponse.redirect(`${baseUrl}/auth/login`);
  if (session && req.url.includes(`${baseUrl}/auth`))
    return NextResponse.redirect(`${baseUrl}/`);
  if (session && req.url === `${baseUrl}/student`)
    return NextResponse.redirect(`${baseUrl}/student/${session.student_id}`);
  return NextResponse.next();
}
