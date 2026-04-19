import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "ADMIN" | "FACULTY" | "STUDENT";
        name: string;
        email: string;
      };
    }
  }
}

export {};
