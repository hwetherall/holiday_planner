import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main(){
  const groups = [
    { code: 'A', name: 'Harry + Ky + Occi', pin: '3112' },
    { code: 'B', name: 'Mum + Johno',       pin: '1002' },
    { code: 'C', name: 'Liv + Ben',         pin: '2810' },
    { code: 'D', name: 'Victoria + Jim',    pin: '0602' },
  ];
  for(const g of groups){
    await prisma.group.upsert({
      where: { code: g.code },
      create: {
        code: g.code,
        name: g.name,
        pinHash: await bcrypt.hash(g.pin, 10),
        homeAirports: g.code==='A'?'DEN':'SYD,MEL',
        members: g.name
      },
      update: {
        // Ensure pins can be corrected by re-running the seed after editing values
        name: g.name,
        pinHash: await bcrypt.hash(g.pin, 10),
        homeAirports: g.code==='A'?'DEN':'SYD,MEL',
        members: g.name
      }
    });
  }
}

main().then(()=>process.exit(0));


