export interface Movies {
    _id: string,
    title: string,
    genre: string[],
    description: string,
    coverImg: string,
    video: string,
    rating: {
        userId: string,
        no: number
    },
    comments: {
        userId: string,
        text: string,
        userName: string,
        replies: [{
            userId: string,
            text: string,
            userName: string,
            replyTo: string
        }]
    },
    director: string
}