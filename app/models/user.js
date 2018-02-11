const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    first_name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 49],
          msg: 'First Name must be between 1 and 49 characters',
        },
        notEmpty: true,
      },
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 49],
          msg: 'Last Name must be between 1 and 49 characters',
        },
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address',
        },
        notEmpty: true,
      },
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [4, 49],
          msg: 'Username must be between 4 and 49 characters',
        },
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 49],
          msg: 'Password must be between 8 and 49 characters',
        },
        notEmpty: true,
      },
    },
    admin: {
      type: DataTypes.BOOLEAN,
      validate: {
      },
    },
  }, {
    underscored: true,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });

  /**
   * Before hook on every db.user.create().
   */

  user.beforeCreate((createdUser, options) => {
    const c = createdUser;
    if (!c.password) return null;

    /**
     * hashSync(plaintextPassword, saltRounds) generates a salted and hashed password.
     *
     * saltRounds refers to cost factor. The cost factor controls how much time is needed to
     * calculate a single bcrypt hash. The higher the cost factor, the more hashing rounds are
     * done. Increasing cost factor by 1 doubles the necessary time.
     */

    const saltedHash = bcrypt.hashSync(c.password, 10);
    c.password = saltedHash;
    c.admin = false;
    return c;
  });

  /**
   * Instance method that can be called on each user, not the User class. Had to use a function
   * expression, because arrow function expressions do not have their own `this`.
   *
   * compareSync(attemptedPassword, encryptedPasswordFromDb)
   */

  user.prototype.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  /**
   * This method is used by Sequelize when returning User rows.
   */

  user.prototype.toJSON = function toJSON() {
    // get() is a sequelize model instance method, returns all fields of the instance
    const jsonUser = this.get();
    // JS delete operator
    delete jsonUser.password;
    return jsonUser;
  };

  return user;
};
