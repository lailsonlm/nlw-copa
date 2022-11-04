import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@hotmail.com',
      avatarUrl: 'http://github.com/lailsonlm.png',
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Exemple Pool',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-01T16:00:00.913Z',
      firstTeamCountryCode: 'DE',
      secondTeamContryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-03T16:00:00.913Z',
      firstTeamCountryCode: 'BR',
      secondTeamContryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    
    }
  })
}

main()