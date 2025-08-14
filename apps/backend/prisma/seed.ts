import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main(){
  const users = [
    { code: 'HARRY', name: 'Harry', pin: '3112', homeAirports: 'DEN' },
    { code: 'KYLENE', name: 'Kylene', pin: '2801', homeAirports: 'DEN' },
    { code: 'OLIVIA', name: 'Olivia', pin: '2810', homeAirports: 'MEL' },
    { code: 'BEN', name: 'Ben', pin: '2811', homeAirports: 'MEL' },
    { code: 'VICTORIA', name: 'Victoria', pin: '0602', homeAirports: 'MEL' },
    { code: 'JIM', name: 'Jim', pin: '2704', homeAirports: 'MEL' },
    { code: 'DEB', name: 'Deb', pin: '1002', homeAirports: 'SYD' },
    { code: 'JOHNNO', name: 'Johnno', pin: '0706', homeAirports: 'SYD' },
  ];
  
  for(const user of users){
    await prisma.group.upsert({
      where: { code: user.code },
      create: {
        code: user.code,
        name: user.name,
        pinHash: await bcrypt.hash(user.pin, 10),
        homeAirports: user.homeAirports,
        members: user.name
      },
      update: {
        // Ensure pins can be corrected by re-running the seed after editing values
        name: user.name,
        pinHash: await bcrypt.hash(user.pin, 10),
        homeAirports: user.homeAirports,
        members: user.name
      }
    });
  }
}

main().then(()=>process.exit(0));


