import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {}

// si PrismaService est juste un extend de PrismaClient, pourquoi ne pas utiliser directement PrismaClient ?