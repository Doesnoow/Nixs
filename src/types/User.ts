interface UserData {
  _id: string;
  blacklisted: {
    reason: string;
    blacklister: string;
  }
}

interface UserLogData {
  _id: string;
  user_id: string;
  subject: {
    tag: string;
    id: string;
  };
  amount: number;
  date: number;
}

export type {
  UserData,
  UserLogData,
};
