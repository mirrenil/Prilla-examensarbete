

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

export interface Tag {
    name: string
}

export interface User {
    createdAt: Date,
    displayName: string, 
    email: string,
    id: string,
    photo: string
}

export interface Product {
    Brand: string,
    Description: string,
    Flavor: string[],
    Format: string,
    Manufacturer: string,
    Name: string,
    Nicotine: number,
    Photo: string,
    Pouches: number,
    Reviews: string[],
    Strength: number,
    Tags: Tag[],
    Type: string,
    Weight: number,
    Rating?: number,
    id: string
}