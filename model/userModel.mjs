import { pool } from "../db/postresConnection.mjs";

const userModel = {
  getUsers: async (paginate, page, limit) => {
    try {
      if (paginate === "true") {
        const users = await pool.query(
          "SELECT * FROM users OFFSET $1 LIMIT $2",
          [(page - 1) * limit, limit]
        );
        return users.rows;
      } else {
        const users = await pool.query("SELECT * FROM users ORDER BY id");
        return users.rows;
      }
    } catch (error) {
      console.error(error);
    }
  },
  getUserById: async (userId) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [
        userId,
      ]);
      return result.rows[0]; // Assuming there's only one user with the given ID
    } catch (error) {
      throw error;
    }
  },
  createUser: async (userData) => {
    const client = await pool.connect();
    try {
      const { username, email, password, phone_number, address } = userData;

      const result = await client.query(
        "INSERT INTO users (username, email, password, phone_number, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [username, email, password, phone_number, address]
      );
      const newUser = result.rows[0];
      return newUser;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      client.release();
    }

    // },

    // createReservation: async ({ userId, bookId }) => {
    //     const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    //     const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);

    //     const user = userResult.rows[0];
    //     const book = bookResult.rows[0];

    //     if (!user || !book) {
    //         throw new Error('User or book not found');
    //     }

    //     const reservationResult = await pool.query('SELECT * FROM reservations WHERE user_id = $1 AND book_id = $2', [userId, bookId]);
    //     const reservation = reservationResult.rows[0];

    //     if (reservation) {
    //         throw new Error('Book is already reserved by the user.')
    //     }

    //     if (book.quantity === 0 || !book.available) {
    //         throw new Error('Book is not available');
    //     }

    //     await pool.query('INSERT INTO reservations (user_id, book_id) VALUES ($1, $2)', [userId, bookId]);

    //     book.quantity--;

    //     if (book.quantity === 0) {
    //         book.available = false;
    //     }

    //     await pool.query('UPDATE books SET quantity = $1, available = $2 WHERE id = $3', [book.quantity, book.available, bookId]);

    //     return { user, book };
  },
  deleteUser: async (UserId) => {
    try {
      const result = await pool.query(
        `
        DELETE FROM users
              WHERE id=$1
              `,
        [UserId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (userId, newData) => {
    try {
      const { username, email, password, phone_number, address } = newData;

      const client = await pool.connect();

      const result = await client.query(`
        UPDATE users 
        SET username = $1, email = $2, password = $3, phone_number = $4, address = $5
        WHERE id = $6
        RETURNING *
      `, [username, email, password, phone_number, address, userId]);

      client.release();

      return result.rows[0]; // Return the updated user data
    } catch (error) {
      throw error;
    }
  },
};

export default userModel;
