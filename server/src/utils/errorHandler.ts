interface ErrorMessages {
    name?: string;
    email?: string;
    password?: string;
    isAdmin?: string;
    general?: string;
  }
  
  export const handleSignupErrors = (err: any): ErrorMessages => {
    const errors: ErrorMessages = {};
  
    // Duplicate key error (email must be unique)
    if (err.code === 11000 && err.keyPattern?.email) {
      errors.email = 'That email is already registered';
      return errors;
    }
  
    // Mongoose validation errors
    if (err.message.includes('users validation failed')) {
      Object.values(err.errors).forEach(({ properties }: any) => {
        if (properties?.path && properties?.message) {
          errors[properties.path as keyof ErrorMessages] = properties.message;
        }
      });
    }
  
    // Custom thrown login errors (from login method)
    if (err.message === 'Wrong Credentials') {
      errors.general = 'Incorrect email or password';
    }
  
    if (err.message === 'I know not this man') {
      errors.email = 'Invalid Email or Password';
    }
  
    return errors;
  };
  