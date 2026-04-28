export type RegisterInput = {
  email: string;
  password: string;
  pymeName: string;
};

export type RegisterResult = {
  userId: string;
  pymeId: string;
};

export type PymeRole = "owner" | "admin";
