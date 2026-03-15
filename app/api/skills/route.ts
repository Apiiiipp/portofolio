import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const skill = await prisma.skill.create({ data: body });
  revalidatePath("/");
  return NextResponse.json(skill, { status: 201 });
}
