import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@corumbau.com' },
    update: {},
    create: {
      name: 'Admin Corumbau',
      email: 'admin@corumbau.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Create operator user
  const operatorPassword = await bcrypt.hash('operador123', 12)
  const operator = await prisma.user.upsert({
    where: { email: 'operador@corumbau.com' },
    update: {},
    create: {
      name: 'Capitão João',
      email: 'operador@corumbau.com',
      password: operatorPassword,
      role: 'OPERATOR',
      phone: '73999001234',
    },
  })
  console.log('✅ Operator created:', operator.email)

  // Create tours
  const baleiaJubarte = await prisma.tour.upsert({
    where: { slug: 'baleia-jubarte' },
    update: {},
    create: {
      name: 'Passeio Baleia Jubarte',
      slug: 'baleia-jubarte',
      description: 'Navegue pelas águas do Banco de Abrolhos e observe as majestosas baleias jubarte em seu habitat natural. Uma experiência inesquecível com avistamento garantido na temporada.',
      duration: '4 horas',
      includes: ['Barco com cobertura', 'Guia especializado', 'Coletes salva-vidas', 'Água e frutas'],
      priceAdult: 250,
      priceChild: 125,
      maxCapacity: 20,
      category: 'WHALE',
      images: ['/images/800x600/1E40AF/FFFFFF?text=Baleia+Jubarte'],
      isActive: true,
      commissionRate: 0.10,
    },
  })

  const barcoEspelho = await prisma.tour.upsert({
    where: { slug: 'barco-espelho' },
    update: {},
    create: {
      name: 'Passeio de Barco à Praia do Espelho',
      slug: 'barco-espelho',
      description: 'Navegue até a deslumbrante Praia do Espelho, conhecida por suas falésias coloridas e piscinas naturais de águas cristalinas. Parada para banho e almoço na praia.',
      duration: '6 horas',
      includes: ['Barco', 'Guia', 'Parada para banho', 'Snorkel'],
      priceAdult: 180,
      priceChild: 90,
      maxCapacity: 16,
      category: 'BOAT',
      images: ['/images/800x600/0891B2/FFFFFF?text=Praia+do+Espelho'],
      isActive: true,
      commissionRate: 0.10,
    },
  })

  const buggyCosta = await prisma.tour.upsert({
    where: { slug: 'buggy-costa' },
    update: {},
    create: {
      name: 'Buggy Costa das Baleias',
      slug: 'buggy-costa',
      description: 'Explore a Costa das Baleias em um emocionante passeio de buggy. Visite praias desertas, aldeias de pescadores e cenários de tirar o fôlego.',
      duration: 'Dia inteiro',
      includes: ['Buggy 4x4', 'Motorista/guia', 'Paradas em praias', 'Almoço incluso'],
      priceAdult: 320,
      priceChild: 160,
      maxCapacity: 4,
      category: 'BUGGY',
      images: ['/images/800x600/B45309/FFFFFF?text=Buggy'],
      isActive: true,
      commissionRate: 0.08,
    },
  })

  const vivencia = await prisma.tour.upsert({
    where: { slug: 'vivencia-pescadores' },
    update: {},
    create: {
      name: 'Vivência com Pescadores',
      slug: 'vivencia-pescadores',
      description: 'Viva um dia na rotina dos pescadores artesanais de Corumbau. Aprenda técnicas tradicionais de pesca, cozinhe o peixe do dia e ouça histórias do mar.',
      duration: '3 horas',
      includes: ['Acompanhamento local', 'Material de pesca', 'Degustação'],
      priceAdult: 150,
      priceChild: 75,
      maxCapacity: 10,
      category: 'EXPERIENCE',
      images: ['/images/800x600/7C3AED/FFFFFF?text=Vivencia'],
      isActive: true,
      commissionRate: 0.12,
    },
  })

  console.log('✅ Tours created:', [baleiaJubarte.slug, barcoEspelho.slug, buggyCosta.slug, vivencia.slug].join(', '))

  // Create tour dates (next 7 days)
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateStr = date.toISOString()

    await prisma.tourDate.create({
      data: {
        tourId: baleiaJubarte.id,
        date: dateStr,
        time: '06:00',
        totalSlots: 20,
        bookedSlots: Math.floor(Math.random() * 8),
        status: 'OPEN',
      },
    })

    await prisma.tourDate.create({
      data: {
        tourId: barcoEspelho.id,
        date: dateStr,
        time: '09:00',
        totalSlots: 16,
        bookedSlots: Math.floor(Math.random() * 6),
        status: 'OPEN',
      },
    })

    if (i <= 3) {
      await prisma.tourDate.create({
        data: {
          tourId: buggyCosta.id,
          date: dateStr,
          time: '08:00',
          totalSlots: 4,
          bookedSlots: Math.floor(Math.random() * 2),
          status: 'OPEN',
        },
      })
    }

    if (i % 2 === 0) {
      await prisma.tourDate.create({
        data: {
          tourId: vivencia.id,
          date: dateStr,
          time: '14:00',
          totalSlots: 10,
          bookedSlots: Math.floor(Math.random() * 4),
          status: 'OPEN',
        },
      })
    }
  }

  console.log('✅ Tour dates created for next 7 days')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
