import { PrismaClient } from '@prisma/client'

export const getUsers = async (query: any, username: string) => {
    const queries: any = []
    if ('username' in query){
        queries.push({
            "username": query.full_name
        })
    }
    
    if ('id' in query){
        console.log(query.id)
        queries.push({
            "id": parseInt(query.id)
        })
    }

    if ('A1Id' in query){
        queries.push({
            "A1Id": query.country_code
        })
    }
   

    
    const players = await prisma.player.findMany({
        where: { AND: queries },
        skip: Number(query.offset) || 0,
        take: Number(query.limit) || 10,
    })
    return players
}

export const createPlayer = async (player: any, username: string) => {
    const { full_name, country_code, birth_date, gender } = player;
    if (!full_name) {
      throw new HttpException(422, { errors: { name: ["can't be blank"] } });
    }
  
    if (!country_code) {
      throw new HttpException(422, { errors: { location: ["can't be blank"] } });
    }
  
 
    const createdPlayer = await prisma.player.create({
      data: {
        full_name,
        country_code,
        ...(birth_date ? {birth_date: new Date(birth_date)} : {}),
        ...(gender ? {gender: gender as Gender} : {})
      }
        
      
    });
  
    return createdPlayer
  };


  export const updatePlayer = async (player: any, id: number, username: string) => { 
    const {full_name, country_code, birth_date, gender} = player
    const user = await findUserIdByUsername(username);

    if (!user.id) {
      throw new HttpException(422, { errors: { id: ["can't be blank"] } });
    }
 
    const updatedPlayer = await prisma.player.update({
      where: {
        id
      },
      data: {
        ...(full_name ? { full_name } : {}),
        ...(country_code ? { country_code } : {}),
        ...(birth_date ? {birth_date: new Date(birth_date)} : {}),
        ...(gender ? {gender: gender as Gender} : {})
      }
      
    });
  
    return updatedPlayer
  };


  export const deletePlayer = async (id: number) => {
    await prisma.player.delete({
      where: {
        id
      }
    })
  }

