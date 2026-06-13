export const validateLogin = (emailOrPhone: string, password: string, registeredUsers: any[]) => {
    return registeredUsers.find(
      (user) =>
        (user.email === emailOrPhone || user.phone === emailOrPhone) &&
        user.password === password
    );
  };
  