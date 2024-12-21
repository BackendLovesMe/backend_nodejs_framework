export const SQLProvider: any = {
    values: {

        schema_CMN: process.env.DB_SCHEMA2_CMN || "public",

        microService: 'Evian-backend ',
        endpoint: process.env.ENDPOINT || 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
        apiKeyId: process.env.APIKEYID || 'Fz8zHlnWQ7UAzY-zZOlN21U4UJtIBclHOrZAEzZFUfrG',
        FaqVideoName: `FaqVideos.mp4`,
        jwtSecretKey : process.env.JWT_SECRET_KEY || "McFcd#18Aa45628E2fc7%eMbk1e171#b63t1bm9aep$311da0@c4bf1!239Mx92U", 
    },
    query: {

       
    },
    apis: {
        basePath: {

        },
        route: {

        }
    }
}