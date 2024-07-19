export class UserAccount {
    userId: number;
    role: string;
    username: string;
    employeeId: number;
    constructor(
      userId: number,
      role: string,
      username: string,
      employeeId: number
    ) {
      this.userId = userId;
      this.role = role;
      this.username = username;
      this.employeeId = employeeId;
    }
  }
  