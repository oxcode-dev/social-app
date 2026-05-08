export interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    fullName?: string;
    username: string;
    avatar?: string | null;
    bio?: string | null;
    posts:  string[]; // Assuming these are post IDs
    saved: string[]; // Assuming these are post IDs
    followers: string[]; // Assuming these are user IDs
    followings: string[]; // Assuming these are user IDs
}

export interface AuthUserType {
    id: string;
    first_name: string;
    last_name: string;
    fullName?: string;
    email: string;
    username: string;
    avatar?: string | null;
    bio?: string | null;
    posts:  string[]; // Assuming these are post IDs
    saved: string[]; // Assuming these are post IDs
    followers: string[]; // Assuming these are user IDs
    followings: string[]; // Assuming these are user IDs
}

export interface DataStoredInToken {
  id: string;
  email: string;
}