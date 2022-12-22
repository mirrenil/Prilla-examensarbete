

export interface Review {
    createdAt: Date,
    description: string,
    photo: string,
    productID: string,
    rating: number,
    tags: Tag[],
    userID: string,
    id?: string
}

interface Tag {
    name: string
}