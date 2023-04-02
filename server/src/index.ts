import { PrismaClient } from '@prisma/client'
import express from 'express'
import { validate } from 'uuid';
import { uuid } from 'uuidv4';

const prisma = new PrismaClient()
const app = express()


// ... your REST API routes will go here
app.use(express.json())

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})


app.get('/user/:username', async (req, res) => {
  console.log(req.params.username)
  const user = await prisma.user.findUnique({
    where: {
      username: req.params.username
    },
    include: {
      referal: {
        select: {
          username: true
        }
      }
    }
  })
  console.log(user)
  res.json(user)
})
app.get('/friends', async (req, res) => {
  const friends = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      score: true
    }
  })
  console.log(friends)
  res.json(friends)
})
app.get('/friends/:id', async (req, res) => {

  // const friends = await prisma.interaction.findMany({
  //   where: {
  //     user1Id: parseInt(req.params.id)
  //   }, 
  //   include: {user2: {select: {username: true, score: true}}}
  // })
  const ids = await prisma.interaction.findMany({
    where: {
      "OR": [{
        user1Id: parseInt(req.params.id)
      }, { user2Id: parseInt(req.params.id) }]
    },
    select: { user1Id: true, user2Id: true }
  })
  let idsFilter = [...new Set(ids.map((obj) => {
    if (obj.user1Id == parseInt(req.params.id)) {
      return obj.user2Id
    } else { return obj.user1Id }
  }))].filter(el => el != null) as number[]
  const friends = await prisma.user.findMany({
    where: { id: { in: idsFilter } },
    select: {
      id: true,
      username: true,
      score: true

    }
  })
  console.log(friends)
  res.json(friends)
})

app.get("/history/:id", async (req, res) => {
  const users = await prisma.interaction.findMany(
    {
      where: {
        user1Id: parseInt(req.params.id),
        completed: true
      },
      include: {
        user2: {
          select: {
            username: true
          }
        }
      }})
    console.log(users)
    res.json(users)
})

app.get('/interactions', async (req, res) => {
  const users = await prisma.interaction.findMany()
  res.json(users)
})

app.get('/createCode/:id', async (req, res) => {
  const users = await prisma.interaction.create({
    data: {
      user1: {
        connect: { id: parseInt(req.params.id) }
      },
      code: uuid(),
      points: 10
    }
  })
  res.json(users)
})


app.get('/scanCode/:id/:code', async (req, res) => {
  const interaction = await prisma.interaction.findUnique({
    where: {
      code: req.params.code
    }
  })

  if (interaction === null) {
    res.json({ messageCODE: 404 })
  } else if (interaction.user2Id !== null) {
    res.json({ messageCODE: 400 })
  } else {

    const user1 = await prisma.user.findUnique({
      where: {
        id: interaction.user1Id
      }
    })
    const user2 = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    })
    if (user1?.validated && user2?.validated) {
      res.json({ messageCODE: 401, message: "Both of you are already validated" })
    } else {

      const updatedInteraction = await prisma.interaction.update({
        where: {
          code: req.params.code
        },
        data: {
          user2: {
            connect: { id: parseInt(req.params.id) }
          },
          scannedAt: new Date(),
        }
      })
      const updatedUser = await prisma.user.update({
        where: {
          id: user2?.id
        },
        data: {
          referal: {
            connect: {
              id: user1?.id
            }
          }
        }
      })
      res.json({ messageCODE: 200, link: "https://www.a1.si/", referedBy: user1?.username })
    }
  }

  console.log(interaction)
  res.json(interaction)
})

app.get("/validate/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if (user?.validated == true) {
    res.json({ messageCODE: 110, message: "Hvala, ampak ste že izpolnili vse obveznosti" })
  }
  else {
    await prisma.user.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        score: user?.score as number + 60,
        validated: true
      }
    })
    if (user?.referalId) {
      await prisma.user.update({
        where: { id: user?.referalId },
        data: {
          score: {
            increment: 20
          }
        }
      })
      await prisma.interaction.updateMany({
        where: {
          user1Id: user?.referalId,
          user2Id: user?.id
        },
        data: {
          completed: true,
          completedAt: new Date()
        }
      })

    }

    res.json({ messageCODE: 100, message: "Prejeli ste 60 točk, hvala ker izpolnjujete svojo dolžnost" })
  }

})
app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)
